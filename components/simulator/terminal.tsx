"use client";

import { useState, useRef, useEffect } from "react";
import { processCommand } from "@/actions/simulator";
import { cn } from "@/lib/utils";
import { Terminal as TerminalIcon } from "lucide-react";

type HistoryItem = {
    command: string;
    output: string[];
    type: "success" | "error" | "info" | "warning";
};

interface TerminalProps {
    initialCommand?: string;
}

export function Terminal({ initialCommand }: TerminalProps) {
    const [input, setInput] = useState(initialCommand || "");
    const [history, setHistory] = useState<HistoryItem[]>([
        {
            command: "init",
            output: [
                "WELCOME TO INSYT OS v1.0.4",
                "INITIALIZING TERMINAL...",
                "ACCESS GRANTED.",
                "TYPE 'help' FOR COMMANDS.",
            ],
            type: "success",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-fill and focus
    useEffect(() => {
        if (initialCommand) {
            inputRef.current?.focus();
            // Optional: We could auto-run it, but it's often better to let user press Enter so they see what they're running
        }
    }, [initialCommand]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input on click
    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && input.trim()) {
            const cmd = input;
            setInput("");
            setLoading(true);

            // Optimistic update
            setHistory((prev) => [
                ...prev,
                { command: cmd, output: [], type: "info" },
            ]);

            if (cmd.toLowerCase() === "clear") {
                setHistory([]);
                setLoading(false);
                return;
            }

            // Call Server Action
            const result = await processCommand(cmd);

            setHistory((prev) => {
                const newHistory = [...prev];
                const lastIndex = newHistory.length - 1;
                newHistory[lastIndex] = {
                    command: cmd,
                    output: result.output,
                    type: result.type,
                };
                return newHistory;
            });

            setLoading(false);
        }
    };

    return (
        <div
            className="flx flex-col h-[600px] w-full max-w-4xl overflow-hidden rounded-lg border border-neon-green/30 bg-black font-mono text-sm shadow-[0_0_20px_rgba(0,255,148,0.1)]"
            onClick={handleTerminalClick}
        >
            {/* Header */}
            <div className="flex bg-agri-dark/90 px-4 py-2 border-b border-white/10 items-center justify-between">
                <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                    <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                    <TerminalIcon className="h-3 w-3" />
                    <span>bash — agent@insyt</span>
                </div>
                <div className="w-10"></div>
            </div>

            {/* Body */}
            <div
                ref={scrollRef}
                className="h-full overflow-y-auto p-4 space-y-4 cursor-text pb-20"
            >
                {history.map((item, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-neon-green">➜</span>
                            <span className="text-blue-400">~</span>
                            <span>{item.command}</span>
                        </div>

                        {item.output.map((line, j) => (
                            <div
                                key={j}
                                className={cn(
                                    "pl-6",
                                    item.type === "error" ? "text-red-400" :
                                        item.type === "warning" ? "text-yellow-400" :
                                            item.type === "success" ? "text-neon-green" : "text-gray-300"
                                )}
                            >
                                {line}
                            </div>
                        ))}
                    </div>
                ))}

                {/* Input Line */}
                <div className="flex items-center gap-2">
                    <span className="text-neon-green">➜</span>
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            className="bg-transparent text-white outline-none w-full border-none p-0 focus:ring-0"
                            autoFocus
                            autoComplete="off"
                        />
                    </div>
                </div>

                {loading && <div className="pl-6 text-gray-500 animate-pulse">Processing...</div>}
            </div>
        </div>
    );
}
