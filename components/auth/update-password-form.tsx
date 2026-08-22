"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function UpdatePasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);

        // Use the browser client — the session is stored in the browser
        // after the PKCE code exchange in the /auth/callback route.
        const supabase = createClient();
        const { error: updateError } = await supabase.auth.updateUser({
            password,
        });

        if (updateError) {
            setError(updateError.message);
            setIsLoading(false);
            return;
        }

        // Sign out fully so the user must log in fresh with the new password
        await supabase.auth.signOut();
        router.push("/login?message=Password+updated+successfully");
    }

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    RESET CREDENTIALS
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                    Enter your new encryption key to secure your identity.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs font-mono font-medium text-neon-green mb-1"
                        >
                            NEW ENCRYPTION KEY
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/50 sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="block text-xs font-mono font-medium text-neon-green mb-1"
                        >
                            CONFIRM ENCRYPTION KEY
                        </label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/50 sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-500/10 p-3 text-xs text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-6 text-base"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    SECURE & UPDATE
                </Button>
            </form>
        </div>
    );
}
