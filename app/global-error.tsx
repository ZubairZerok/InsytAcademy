"use client";

import { useEffect } from "react";

// Catches errors thrown in the ROOT layout (which app/error.tsx cannot).
// Must render its own <html>/<body>.
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Root error boundary caught:", error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ background: "#070A08", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem", textAlign: "center" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Something went wrong</h1>
                    <p style={{ color: "#9ca3af", maxWidth: "28rem" }}>
                        We hit an unexpected error. Please try again.
                    </p>
                    {error.digest && (
                        <p style={{ color: "#6b7280", fontFamily: "monospace", fontSize: "0.8rem", marginTop: "1rem" }}>
                            Reference: {error.digest}
                        </p>
                    )}
                    <button
                        onClick={() => reset()}
                        style={{ marginTop: "1.5rem", background: "#00FF94", color: "#000", fontWeight: 700, border: 0, borderRadius: "0.5rem", padding: "0.6rem 1.2rem", cursor: "pointer" }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
