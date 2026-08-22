"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(event.currentTarget);
        const result = await forgotPassword(formData);

        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setSuccess(result.success);
        }

        setIsLoading(false);
    }

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    RECOVERY PROTOCOL
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                    Enter your verified email to receive encryption key reset instructions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-xs font-mono font-medium text-neon-green mb-1"
                    >
                        EMAIL IDENTIFIER
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/50 sm:text-sm"
                        placeholder="agent@insyt.io"
                    />
                </div>

                {error && (
                    <div className="rounded-md bg-red-500/10 p-3 text-xs text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-md bg-green-500/10 p-3 text-xs text-green-500 border border-green-500/20">
                        {success}
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-6 text-base"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    INITIATE RECOVERY
                </Button>
            </form>

            <div className="text-center text-sm">
                <Link href="/login" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Terminal access
                </Link>
            </div>
        </div>
    );
}
