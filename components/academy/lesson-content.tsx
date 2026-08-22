"use client";

import { TryItButton } from "@/components/academy/try-it-button";
import { Info, Lightbulb, AlertTriangle, ShieldAlert, Sparkles, Code2, Check, Copy } from "lucide-react";
import { useState } from "react";

interface LessonContentProps {
    content: string;
}

export function LessonContent({ content }: LessonContentProps) {
    if (!content) return null;

    // 1. Split content by code blocks ```lang ... ```
    const codeBlockRegex = /(```(?:[a-zA-Z]+)?[\s\S]*?```)/g;
    const parts = content.split(codeBlockRegex);

    return (
        <div className="space-y-6 text-gray-300 leading-relaxed font-sans text-base">
            {parts.map((part, index) => {
                if (part.startsWith("```")) {
                    return <CodeBlockContainer key={index} codeBlock={part} />;
                }
                return <MarkdownBlock key={index} text={part} />;
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Code Block Component with Copy & Try-It Buttons
// ---------------------------------------------------------------------------
function CodeBlockContainer({ codeBlock }: { codeBlock: string }) {
    const [copied, setCopied] = useState(false);
    const match = codeBlock.match(/^```([a-zA-Z]+)?\s*([\s\S]*?)```$/);
    const lang = (match?.[1] || "code").toLowerCase();
    const code = (match?.[2] || "").trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const langDisplayNames: Record<string, string> = {
        r: "R SCRIPT",
        js: "JAVASCRIPT (GEE)",
        javascript: "JAVASCRIPT (GEE)",
        python: "PYTHON SCRIPT",
        json: "JSON DATA",
        sql: "POSTGRES SQL",
    };

    return (
        <div className="rounded-xl bg-black/60 border border-white/10 overflow-hidden my-6 shadow-2xl group">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-neon-green" />
                    <span className="text-xs font-mono font-bold text-gray-300 tracking-wider">
                        {langDisplayNames[lang] || lang.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="text-xs font-mono text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1 transition-colors"
                        title="Copy Code"
                    >
                        {copied ? (
                            <>
                                <Check className="h-3 w-3 text-neon-green" /> Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3" /> Copy
                            </>
                        )}
                    </button>
                    <div className="flex gap-1.5 ml-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                    </div>
                </div>
            </div>

            {/* Code View */}
            <div className="p-4 font-mono text-xs md:text-sm text-cyan-300 bg-black/90 overflow-x-auto leading-relaxed">
                <pre>{code}</pre>
            </div>

            {/* Try It Action Bar */}
            <div className="bg-white/[0.02] px-4 py-2 border-t border-white/10 flex justify-end">
                <TryItButton code={code} />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Markdown Paragraphs, Headers, Lists & Callouts Parser
// ---------------------------------------------------------------------------
function MarkdownBlock({ text }: { text: string }) {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let calloutLines: string[] = [];
    let calloutType: "NOTE" | "TIP" | "WARNING" | "IMPORTANT" | "QUOTE" | null = null;

    const flushCallout = () => {
        if (calloutLines.length > 0 && calloutType) {
            elements.push(
                <CalloutBox
                    key={`callout-${elements.length}`}
                    type={calloutType}
                    lines={calloutLines}
                />
            );
            calloutLines = [];
            calloutType = null;
        }
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();

        // 1. Detect Callout Blockquotes
        if (trimmed.startsWith(">")) {
            const quoteContent = trimmed.replace(/^>\s?/, "");

            if (quoteContent.startsWith("[!NOTE]")) {
                flushCallout();
                calloutType = "NOTE";
                calloutLines.push(quoteContent.replace("[!NOTE]", "").trim());
            } else if (quoteContent.startsWith("[!TIP]")) {
                flushCallout();
                calloutType = "TIP";
                calloutLines.push(quoteContent.replace("[!TIP]", "").trim());
            } else if (quoteContent.startsWith("[!WARNING]")) {
                flushCallout();
                calloutType = "WARNING";
                calloutLines.push(quoteContent.replace("[!WARNING]", "").trim());
            } else if (quoteContent.startsWith("[!IMPORTANT]")) {
                flushCallout();
                calloutType = "IMPORTANT";
                calloutLines.push(quoteContent.replace("[!IMPORTANT]", "").trim());
            } else {
                if (!calloutType) calloutType = "QUOTE";
                calloutLines.push(quoteContent);
            }
            return;
        } else {
            flushCallout();
        }

        // 2. Empty Lines
        if (!trimmed) {
            return;
        }

        // 3. Headers
        if (trimmed.startsWith("# ")) {
            elements.push(
                <h1 key={idx} className="text-3xl md:text-4xl font-bold text-white mt-10 mb-4 tracking-tight border-b border-white/10 pb-3">
                    {renderInlineFormattedText(trimmed.replace("# ", ""))}
                </h1>
            );
            return;
        }
        if (trimmed.startsWith("## ")) {
            elements.push(
                <h2 key={idx} className="text-xl md:text-2xl font-bold text-neon-green font-mono mt-8 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-neon-green shrink-0 animate-pulse" />
                    {renderInlineFormattedText(trimmed.replace("## ", ""))}
                </h2>
            );
            return;
        }
        if (trimmed.startsWith("### ")) {
            elements.push(
                <h3 key={idx} className="text-lg md:text-xl font-bold text-white mt-6 mb-2">
                    {renderInlineFormattedText(trimmed.replace("### ", ""))}
                </h3>
            );
            return;
        }

        // 4. Bulleted & Numbered Lists
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const listText = trimmed.replace(/^[-*]\s+/, "");
            elements.push(
                <div key={idx} className="flex items-start gap-3 my-1.5 ml-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green mt-2 shrink-0 shadow-[0_0_8px_rgba(0,255,148,0.6)]" />
                    <div className="text-gray-300">
                        {renderInlineFormattedText(listText)}
                    </div>
                </div>
            );
            return;
        }

        // 5. Standard Paragraphs
        elements.push(
            <p key={idx} className="my-3 leading-relaxed text-gray-300">
                {renderInlineFormattedText(line)}
            </p>
        );
    });

    flushCallout();

    return <>{elements}</>;
}

// ---------------------------------------------------------------------------
// Callout Alert Box Component
// ---------------------------------------------------------------------------
function CalloutBox({ type, lines }: { type: "NOTE" | "TIP" | "WARNING" | "IMPORTANT" | "QUOTE"; lines: string[] }) {
    const config = {
        NOTE: {
            border: "border-cyan-500/40",
            bg: "bg-cyan-500/[0.08]",
            text: "text-cyan-300",
            icon: <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
            title: "NOTE",
        },
        TIP: {
            border: "border-neon-green/40",
            bg: "bg-neon-green/[0.08]",
            text: "text-neon-green",
            icon: <Lightbulb className="h-5 w-5 text-neon-green shrink-0" />,
            title: "PRO TIP",
        },
        WARNING: {
            border: "border-amber-500/40",
            bg: "bg-amber-500/[0.08]",
            text: "text-amber-400",
            icon: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
            title: "WARNING",
        },
        IMPORTANT: {
            border: "border-purple-500/40",
            bg: "bg-purple-500/[0.08]",
            text: "text-purple-300",
            icon: <ShieldAlert className="h-5 w-5 text-purple-400 shrink-0" />,
            title: "CRITICAL",
        },
        QUOTE: {
            border: "border-white/20",
            bg: "bg-white/[0.03]",
            text: "text-gray-300",
            icon: <Info className="h-5 w-5 text-gray-400 shrink-0" />,
            title: "KEY TAKEAWAY",
        },
    }[type];

    return (
        <div className={`p-4 md:p-5 rounded-xl border ${config.border} ${config.bg} my-5 flex items-start gap-4 shadow-lg backdrop-blur-md`}>
            {config.icon}
            <div className="space-y-1">
                <div className={`text-xs font-mono font-bold uppercase tracking-wider ${config.text}`}>
                    {config.title}
                </div>
                <div className="text-sm text-gray-200 leading-relaxed">
                    {lines.map((l, i) => (
                        <p key={i}>{renderInlineFormattedText(l)}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Multi-pass Inline Formatter for Bold, Italic, Underline & Inline Code
// ---------------------------------------------------------------------------
function renderInlineFormattedText(text: string): React.ReactNode {
    if (!text) return null;

    // Pattern matches:
    // 1. Inline code: `code`
    // 2. Underline: <u>text</u> or ~text~
    // 3. Bold: **text**
    // 4. Italic: *text* or _text_
    const tokens = text.split(/(`[^`]+`|<u>[^<]+<\/u>|~[^~]+~|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);

    return tokens.map((token, i) => {
        if (!token) return null;

        // Inline Code `code`
        if (token.startsWith("`") && token.endsWith("`")) {
            const codeVal = token.slice(1, -1);
            return (
                <code key={i} className="font-mono text-xs bg-neon-green/10 text-neon-green border border-neon-green/30 px-1.5 py-0.5 rounded font-bold mx-0.5">
                    {codeVal}
                </code>
            );
        }

        // Underline <u>text</u> or ~text~
        if ((token.startsWith("<u>") && token.endsWith("</u>")) || (token.startsWith("~") && token.endsWith("~"))) {
            const underlineVal = token.startsWith("<u>") ? token.slice(3, -4) : token.slice(1, -1);
            return (
                <u key={i} className="underline decoration-neon-green decoration-2 underline-offset-4 font-semibold text-white">
                    {underlineVal}
                </u>
            );
        }

        // Bold **text**
        if (token.startsWith("**") && token.endsWith("**")) {
            const boldVal = token.slice(2, -2);
            return (
                <strong key={i} className="font-bold text-white dark:text-white">
                    {boldVal}
                </strong>
            );
        }

        // Italic *text* or _text_
        if ((token.startsWith("*") && token.endsWith("*")) || (token.startsWith("_") && token.endsWith("_"))) {
            const italicVal = token.slice(1, -1);
            return (
                <em key={i} className="italic text-emerald-400 dark:text-neon-green font-medium">
                    {italicVal}
                </em>
            );
        }

        return token;
    });
}
