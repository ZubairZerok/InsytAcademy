"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log full detail server/console-side. (Wire a real reporter e.g. Sentry here.)
        console.error("Error boundary caught:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-agri-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center space-y-6">
                <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertTriangle className="h-10 w-10 text-red-500" />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
                    <p className="text-gray-400">
                        We hit an unexpected error. Please try again — if it keeps happening,
                        contact support with the reference below.
                    </p>
                </div>

                {error.digest && (
                    <div className="bg-black/50 p-3 rounded-lg w-full">
                        <p className="text-xs font-mono text-gray-400">
                            Reference: <span className="text-gray-300">{error.digest}</span>
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row w-full gap-4 pt-4">
                    <Button 
                        onClick={() => reset()} 
                        className="flex-1 bg-neon-green text-black hover:bg-neon-green/90 font-bold"
                    >
                        Try Again
                    </Button>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
