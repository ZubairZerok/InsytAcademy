// components/tutor/syllabus-tutor-drawer.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { askBAUCourseTutor, TutorChatMessage } from "@/actions/bau-tutor";
import {
    Sparkles, Send, Bot, Loader2, X
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface SyllabusTutorDrawerProps {
    courseCode: string;
    courseTitle: string;
    initialModuleTitle?: string;
}

export function SyllabusTutorDrawer({ courseCode, courseTitle }: SyllabusTutorDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<TutorChatMessage[]>([
        {
            role: "assistant",
            content: `Hello! I am your **BAU AI Faculty Tutor** for **${courseCode}: ${courseTitle}**.\n\nI am grounded strictly in the verified BAU syllabus. Ask me to explain statistical proofs, derive formulas in LaTeX, or provide agricultural case studies.`
        }
    ]);

    const QUICK_PROMPTS = [
        "Explain Type I vs Type II errors with an agricultural trial example",
        "Derive the pooled variance formula for two-sample t-test",
        "How do I choose between CRD and RCBD in BAU field plots?",
        "Give a numerical practice problem on Hypothesis Testing"
    ];

    const handleSendMessage = async (textToSend?: string) => {
        const text = textToSend || input;
        if (!text.trim() || isLoading) return;

        const newMessages: TutorChatMessage[] = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const res = await askBAUCourseTutor(courseCode, text, newMessages);
            if (res.text) {
                setMessages(prev => [...prev, { role: "assistant", content: res.text! }]);
            } else if (res.error) {
                setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${res.error}` }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-neon-green text-black font-bold font-mono text-xs shadow-[0_0_25px_rgba(0,255,148,0.4)] hover:bg-neon-green/90 transition-all transform hover:scale-105"
                >
                    <Sparkles className="h-4 w-4" />
                    <span>ASK GEMINI COURSE TUTOR</span>
                </button>
            )}

            {/* Slide-out Drawer Panel */}
            {isOpen && (
                <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white/98 dark:bg-agri-dark/95 border-l border-black/[0.08] dark:border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col animate-in slide-in-from-right duration-300">
                    {/* Drawer Header */}
                    <div className="p-4 border-b border-black/[0.06] dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-black/30">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-neon-green">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-mono text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                    <span>{courseCode} AI TUTOR</span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-800 dark:text-neon-green border border-emerald-500/20">
                                        RAG Grounded
                                    </span>
                                </div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono truncate max-w-[280px]">
                                    Provenance: BAU {courseCode} Syllabus
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 text-xs leading-relaxed ${
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-neon-green flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot className="h-3.5 w-3.5" />
                                    </div>
                                )}

                                <div
                                    className={`p-3.5 rounded-2xl max-w-[85%] ${
                                        msg.role === "user"
                                            ? "bg-emerald-700 text-white dark:bg-neon-green dark:text-black font-medium"
                                            : "bg-black/[0.03] dark:bg-black/50 border border-black/[0.04] dark:border-white/5 text-gray-800 dark:text-gray-200"
                                    }`}
                                >
                                    <div className="prose dark:prose-invert prose-xs max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {msg.role === "user" && (
                                    <div className="h-6 w-6 rounded-md bg-black/10 dark:bg-white/10 text-gray-700 dark:text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                                        U
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-neon-green animate-pulse p-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Gemini referencing {courseCode} syllabus...</span>
                            </div>
                        )}
                    </div>

                    {/* Quick Prompts Chips */}
                    <div className="p-3 border-t border-black/[0.06] dark:border-white/10 bg-black/[0.01] dark:bg-black/20 space-y-1.5">
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                            Verified Syllabus Prompts:
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                            {QUICK_PROMPTS.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(prompt)}
                                    className="px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/10 text-[10px] font-mono text-gray-600 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-neon-green transition-all whitespace-nowrap shrink-0"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Footer */}
                    <div className="p-3.5 border-t border-black/[0.06] dark:border-white/10 bg-white/98 dark:bg-agri-dark/95">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Ask a syllabus question on ${courseCode}...`}
                                className="flex-1 bg-black/[0.03] dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-sans text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                size="icon"
                                className="bg-neon-green text-black hover:bg-neon-green/90 h-9 w-9 rounded-xl shrink-0"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
