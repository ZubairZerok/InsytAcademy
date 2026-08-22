"use client";

import { useCallback, useRef, useState } from "react";
import { runInSandbox } from "./sandbox-runner";

export type ExecState = "idle" | "processing" | "success" | "fault";

export interface UseExecutionControllerOptions {
  language: string | null;
  timeoutMs?: number;
}

export interface ExecutionController {
  state: ExecState;
  output: string | null;
  /** Run the given code. Ignored while already processing (debounced). */
  run: (code: string) => void;
  reset: () => void;
  /** True for languages we can actually execute in-browser (JS only). */
  canExecute: boolean;
}

const JS_LANGS = new Set(["javascript", "js", "node", null as unknown as string]);

export function useExecutionController({
  language,
  timeoutMs = 10_000,
}: UseExecutionControllerOptions): ExecutionController {
  const [state, setState] = useState<ExecState>("idle");
  const [output, setOutput] = useState<string | null>(null);
  const lastRunRef = useRef<number>(0);
  const runningRef = useRef(false);

  const lang = (language ?? "").toLowerCase();
  const canExecute = JS_LANGS.has(lang) || lang === "";

  const run = useCallback(
    (code: string) => {
      // Debounce rapid clicks (300ms) and block re-entry while processing.
      const now = Date.now();
      if (runningRef.current) return;
      if (now - lastRunRef.current < 300) return;
      lastRunRef.current = now;

      if (!canExecute) {
        setState("fault");
        setOutput(
          `In-browser execution supports JavaScript only. For ${
            lang || "this language"
          }, use the Simulator/IDE.`
        );
        return;
      }

      runningRef.current = true;
      setState("processing");
      setOutput(null);

      runInSandbox(code, timeoutMs)
        .then((res) => {
          setOutput(res.output);
          setState(res.outcome === "success" ? "success" : "fault");
        })
        .finally(() => {
          runningRef.current = false;
        });
    },
    [canExecute, lang, timeoutMs]
  );

  const reset = useCallback(() => {
    setState("idle");
    setOutput(null);
  }, []);

  return { state, output, run, reset, canExecute };
}
