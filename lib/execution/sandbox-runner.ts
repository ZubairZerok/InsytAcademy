// lib/execution/sandbox-runner.ts
// Runs untrusted JavaScript inside a cross-origin <iframe sandbox="allow-scripts">.
//
// Why this is safe (unlike the previous `new Function()` in the page):
//   - The iframe has `allow-scripts` but NOT `allow-same-origin`, so it executes
//     in an opaque origin. It cannot read cookies, localStorage, or the DOM of
//     our app, and cannot make same-origin/authenticated requests as the user.
//   - Communication is only via postMessage. A timeout tears the iframe down if
//     the code hangs or loops forever.
//
// Browser-only (uses document/window).

export type ExecOutcome = "success" | "fault" | "timeout";

export interface ExecResult {
  outcome: ExecOutcome;
  output: string;
}

// Static, trusted bootstrap. It receives the user code via postMessage and runs
// it in the isolated context, capturing console output.
const BOOTSTRAP = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
(function(){
  window.addEventListener('message', function(e){
    var data = e.data || {};
    if (typeof data.code !== 'string') return;
    var logs = [];
    var cap = function(prefix){ return function(){
      var parts = Array.prototype.slice.call(arguments).map(function(x){
        try { return typeof x === 'object' ? JSON.stringify(x) : String(x); } catch(_) { return String(x); }
      });
      logs.push(prefix + parts.join(' '));
    }; };
    var sandboxConsole = { log: cap(''), info: cap(''), error: cap('[ERROR] '), warn: cap('[WARN] ') };
    var status = 'success';
    try {
      var fn = new Function('console', '"use strict";' + data.code);
      fn(sandboxConsole);
    } catch (err) {
      logs.push('Error: ' + ((err && err.message) ? err.message : String(err)));
      status = 'fault';
    }
    parent.postMessage({ __sandbox: data.nonce, status: status, output: logs.join('\\n') || '(No output)' }, '*');
  });
  parent.postMessage({ __sandboxReady: true }, '*');
})();
<\/script></body></html>`;

export function runInSandbox(code: string, timeoutMs = 10_000): Promise<ExecResult> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve({ outcome: "fault", output: "Sandbox unavailable." });
      return;
    }

    const nonce = Math.random().toString(36).slice(2);
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.display = "none";
    iframe.srcdoc = BOOTSTRAP;

    let settled = false;
    const timerRef: { id: ReturnType<typeof setTimeout> | null } = { id: null };

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      if (timerRef.id) clearTimeout(timerRef.id);
      iframe.remove();
    };

    const finish = (result: ExecResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const onMessage = (e: MessageEvent) => {
      // Only accept messages from our own iframe's content window.
      if (e.source !== iframe.contentWindow) return;
      const data = e.data || {};
      if (data.__sandboxReady) {
        iframe.contentWindow?.postMessage({ code, nonce }, "*");
        return;
      }
      if (data.__sandbox === nonce) {
        finish({
          outcome: data.status === "fault" ? "fault" : "success",
          output: typeof data.output === "string" ? data.output : "(No output)",
        });
      }
    };

    window.addEventListener("message", onMessage);
    timerRef.id = setTimeout(() => {
      finish({ outcome: "timeout", output: `Execution timed out after ${timeoutMs / 1000}s.` });
    }, timeoutMs);

    document.body.appendChild(iframe);
  });
}
