"use client";

import { Play, Loader2, Check, AlertTriangle } from "lucide-react";
import { useExecutionController } from "@/lib/execution/use-execution-controller";

interface RunButtonProps {
  code: string;
  language: string | null;
  /** Render the output panel below (the parent provides the container). */
  className?: string;
}

// Sandboxed "Run" control with an explicit state machine (idle → processing →
// success/fault). Executes JS in an isolated iframe (see sandbox-runner.ts);
// never uses new Function() in the page context.
export function RunButton({ code, language, className }: RunButtonProps) {
  const { state, output, run } = useExecutionController({ language });

  const onClick = () => run(code);

  return (
    <div className={className}>
      <button
        onClick={onClick}
        disabled={state === "processing"}
        aria-label="Run code"
        className="flex items-center gap-1 text-[10px] font-mono text-neon-green hover:text-neon-green/80 transition-colors disabled:opacity-60"
      >
        {state === "processing" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : state === "success" ? (
          <Check className="h-3 w-3" />
        ) : state === "fault" ? (
          <AlertTriangle className="h-3 w-3 text-amber-400" />
        ) : (
          <Play className="h-3 w-3" />
        )}
        {state === "processing" ? "RUNNING…" : "RUN"}
      </button>

      {output !== null && (
        <div className="mt-2 border-t border-white/[0.04] bg-black/70 p-4 rounded-b-xl">
          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-2">
            Output
          </span>
          <pre
            className={`text-xs font-mono whitespace-pre-wrap ${
              state === "fault" ? "text-amber-300" : "text-emerald-300"
            }`}
          >
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
