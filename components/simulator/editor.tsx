"use client";

interface EditorProps {
    code: string;
    onChange: (val: string) => void;
    language: "r" | "python";
}

export function Editor({ code, onChange, language }: EditorProps) {
    return (
        <div className="flex flex-col h-full rounded-xl border border-white/10 bg-black/60 overflow-hidden relative group">
            {/* Editor Label */}
            <div className="absolute top-3 right-4 z-10 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-white/5 text-gray-500 border border-white/5 group-hover:text-neon-green group-hover:border-neon-green/30 transition-colors pointer-events-none">
                {language === 'r' ? 'R_Source.R' : 'Script.py'}
            </div>

            {/* Line Numbers + Textarea Area */}
            {/* Note: Implementing a full Monaco editor is complex without external libs. 
                We will simulate a clean coding environment using a styled textarea. */}

            <div className="flex-1 w-full relative font-mono text-sm">
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-full bg-transparent text-gray-200 p-4 pt-8 resize-none focus:outline-none focus:ring-0 leading-relaxed font-mono selection:bg-neon-green/30"
                    spellCheck={false}
                    placeholder={`Type your ${language} code here...`}
                />
            </div>

            <div className="bg-white/5 h-8 flex items-center px-4 gap-4 text-xs font-mono text-gray-500 border-t border-white/5">
                <span>Ln {code.split('\n').length}, Col 1</span>
                <span>UTF-8</span>
                <span className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                    READY
                </span>
            </div>
        </div>
    );
}
