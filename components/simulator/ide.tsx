"use client";

import { useState, useEffect } from "react";
import { Editor } from "./editor";
import { Console } from "./console";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { executeCode } from "@/actions/ide";
// import { toast } from "sonner"; // Removed dependency
import { BackButton } from "@/components/ui/back-button";

interface IDEProps {
    initialCode?: string;
    initialLanguage?: "r" | "python";
}

export function IDE({ initialCode, initialLanguage = "r" }: IDEProps) {
    const [code, setCode] = useState(initialCode || getDefaultCode(initialLanguage));
    const [language, setLanguage] = useState<"r" | "python">(initialLanguage);
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState<string[]>([]);
    const [executionTime, setExecutionTime] = useState<number | null>(null);

    // Auto-update default code if switching languages and code is empty/default
    useEffect(() => {
        if (!initialCode) {
            const defaultR = getDefaultCode("r");
            const defaultPy = getDefaultCode("python");
            if (language === "r" && code === defaultPy) setCode(defaultR);
            if (language === "python" && code === defaultR) setCode(defaultPy);
        }
    }, [language, code, initialCode]);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput([]);
        setExecutionTime(null);

        try {
            const result = await executeCode(code, language);
            if (result.error) {
                setOutput([`RUNTIME ERROR: ${result.error}`]);
                // toast.error("Execution Failed");
            } else {
                setOutput(result.output);
                setExecutionTime(result.executionTime);
                // toast.success("Code Executed Successfully");
            }
        } catch {
            setOutput(["System Critical Failure."]);
        } finally {
            setIsRunning(false);
        }
    };

    const handleClear = () => {
        setOutput([]);
        setExecutionTime(null);
    };

    return (
        <div className="flex flex-col h-[85vh] gap-4">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between bg-black/40 border border-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <BackButton href="/academy" label="EXIT" />
                    <div className="h-6 w-px bg-white/10" />
                    <h2 className="font-bold text-white font-mono hidden md:block">
                        INSYT IDE <span className="text-neon-green text-xs">v2.0</span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Simplified Native Select */}
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as "r" | "python")}
                            className="bg-black/90 border border-white/10 text-white font-mono text-sm rounded-md h-9 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-neon-green appearance-none cursor-pointer"
                        >
                            <option value="r">R Stats</option>
                            <option value="python">Python</option>
                        </select>
                        {/* Custom Arrow */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        variant="primary"
                        className="bg-neon-green text-black hover:bg-neon-green/90 font-bold gap-2 min-w-[100px]"
                        onClick={handleRun}
                        disabled={isRunning}
                    >
                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                        {isRunning ? "Running..." : "RUN"}
                    </Button>
                </div>
            </div>

            {/* Main Workspace (Split View) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
                <Editor
                    code={code}
                    onChange={setCode}
                    language={language}
                />
                <Console
                    output={output}
                    onClear={handleClear}
                    executionTime={executionTime}
                />
            </div>
        </div>
    );
}

function getDefaultCode(lang: "r" | "python") {
    if (lang === "r") {
        return `# Welcome to the INSYT R Environment
# Analyze crop yields, run stats, or visualize data.

x <- c(10, 20, 30, 40, 50)
mean_val <- mean(x)

print("Yield Analysis Complete")
print(mean_val)
`;
    }
    return `# Welcome to the INSYT Python Environment
# Build algorithms and process data.

data = [10, 20, 30, 40, 50]
total = sum(data)

print("Processing Complete")
print(f"Total Yield: {total}")
`;
}
