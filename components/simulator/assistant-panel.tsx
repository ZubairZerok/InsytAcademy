"use client";

import { useState, useRef, useEffect } from "react";
import { askAssistant, ChatMessage } from "@/actions/assistant";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, User, Sparkles, Copy, Check, Terminal } from "lucide-react";

interface AssistantPanelProps {
    code: string;
    language: "r" | "python";
    onInsertCode?: (newCode: string) => void;
}

const suggestionChips = [
    { label: "Analyze salt stress code", prompt: "Can you analyze the crop salinity stress calculations in my current code and suggest mathematical improvements?" },
    { label: "FASTA sequence parser", prompt: "Show me a clean way to load and parse DNA FASTA sequences using Python." },
    { label: "GGPlot yield chart in R", prompt: "Explain how to visualize soil classification distributions using ggplot2 in R." }
];

export function AssistantPanel({ code, language, onInsertCode }: AssistantPanelProps) {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (customPrompt?: string) => {
        const query = (customPrompt || prompt).trim();
        if (!query || isLoading) return;

        setPrompt("");
        setIsLoading(true);

        const newMessages: ChatMessage[] = [...messages, { role: "user", content: query }];
        setMessages(newMessages);

        try {
            const res = await askAssistant(query, messages, code, language);
            if (res.error) {
                setMessages(prev => [
                    ...prev,
                    { role: "model", content: `⚠️ INSYT CORE LINK ERROR: ${res.error}` }
                ]);
            } else if (res.text) {
                setMessages(prev => [
                    ...prev,
                    { role: "model", content: res.text || "" }
                ]);
            }
        } catch {
            setMessages(prev => [
                ...prev,
                { role: "model", content: "⚠️ System Communication Outage. Retrying downlink..." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Extract code block helper
    const extractCodeBlock = (content: string): string | null => {
        const match = content.match(/```(?:python|r|R)?\n([\s\S]*?)```/);
        return match ? match[1].trim() : null;
    };

    return (
        <div className="flex flex-col h-full rounded-xl border border-white/10 bg-[#070A08]/90 backdrop-blur-md overflow-hidden relative group">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-neon-green animate-pulse" />
                    <span className="text-xs font-bold font-mono text-gray-300">24/7 LAB DIRECTOR AI</span>
                </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6 select-none my-auto">
                        <div className="h-14 w-14 rounded-2xl bg-neon-green/10 flex items-center justify-center border border-neon-green/20 relative">
                            <Bot className="h-7 w-7 text-neon-green animate-pulse" />
                        </div>
                        <div className="max-w-[280px]">
                            <h3 className="text-white text-sm font-bold font-mono mb-2">System Assistant Ready</h3>
                            <p className="text-xs text-gray-400 leading-relaxed leading-5">
                                Ask crop genomics questions, soil forecast algorithms, or get dynamic math analysis on your current script.
                            </p>
                        </div>
                        <div className="w-full flex flex-col gap-2 pt-4">
                            {suggestionChips.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(chip.prompt)}
                                    className="text-left text-xs bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-neon-green/30 text-gray-400 hover:text-white p-3 rounded-xl transition-all duration-200"
                                >
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, i) => {
                            const isAI = msg.role === "model";
                            const isError = msg.content.startsWith("⚠️");
                            const codeToApply = isAI ? extractCodeBlock(msg.content) : null;

                            return (
                                <div key={i} className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}>
                                    {isAI && (
                                        <div className="h-8 w-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center flex-shrink-0">
                                            <Bot className="h-4 w-4 text-neon-green" />
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-2xl p-4 text-sm max-w-[85%] leading-relaxed ${
                                            isAI
                                                ? isError
                                                    ? "bg-red-500/10 border border-red-500/20 text-red-200"
                                                    : "bg-white/[0.03] border border-white/5 text-gray-300"
                                                : "bg-neon-green/10 border border-neon-green/20 text-white"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-gray-400">
                                                {isAI ? "LAB DIRECTOR AI" : "BIO-ENGINEER"}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {isAI && codeToApply && onInsertCode && (
                                                    <button
                                                        onClick={() => onInsertCode(codeToApply)}
                                                        title="Load code directly into editor"
                                                        className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-neon-green/15 text-neon-green border border-neon-green/30 hover:bg-neon-green/25 transition-all"
                                                    >
                                                        <Terminal className="h-3 w-3" />
                                                        APPLY
                                                    </button>
                                                )}
                                                {isAI && !isError && (
                                                    <button
                                                        onClick={() => handleCopy(msg.content, i)}
                                                        className="text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        {copiedIndex === i ? <Check className="h-3.5 w-3.5 text-neon-green" /> : <Copy className="h-3.5 w-3.5" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="whitespace-pre-wrap leading-6">{msg.content}</p>
                                    </div>
                                    {!isAI && (
                                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex gap-3 justify-start">
                                <div className="h-8 w-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-neon-green animate-pulse" />
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm flex items-center gap-2 text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin text-neon-green" />
                                    <span>Core AI compiling analysis...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>

            {/* Input Bar */}
            <div className="border-t border-white/5 p-3 bg-black/40 flex gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask crop forecast, salinity stress models..."
                    disabled={isLoading}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-green/30 focus:ring-1 focus:ring-neon-green/20 transition-all font-mono placeholder:text-gray-400 disabled:opacity-50"
                />
                <Button
                    size="icon"
                    variant="primary"
                    onClick={() => handleSend()}
                    disabled={isLoading || !prompt.trim()}
                    className="h-10 w-10 rounded-xl bg-neon-green hover:bg-neon-green/90 text-black flex items-center justify-center flex-shrink-0"
                >
                    <Send className="h-4 w-4 fill-current" />
                </Button>
            </div>
        </div>
    );
}
