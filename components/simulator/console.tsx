"use client";

import { Trash2, Terminal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConsoleProps {
    output: string[];
    onClear: () => void;
    executionTime: number | null;
}

export function Console({ output, onClear, executionTime }: ConsoleProps) {
    return (
        <div className="flex flex-col h-full rounded-xl border border-white/10 bg-[#0c0c0c] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-bold font-mono text-gray-300">OUTPUT CONSOLE</span>
                </div>
                <div className="flex items-center gap-2">
                    {executionTime !== null && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                            <Clock className="h-3 w-3" />
                            {executionTime}ms
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-red-400 hover:bg-white/5"
                        onClick={onClear}
                        title="Clear Console"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Output Area */}
            <ScrollArea className="flex-1 p-4 font-mono text-sm">
                {output.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-700 italic select-none">
                        No output to display...
                    </div>
                ) : (
                    <div className="space-y-1">
                        {output.map((line, i) => (
                            <div key={i} className="text-gray-300 break-words whitespace-pre-wrap font-mono">
                                <span className="text-gray-600 mr-2 select-none">$</span>
                                {line}
                            </div>
                        ))}
                        <div className="text-neon-green/50 mt-2 text-xs">
                            ► End of execution
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
