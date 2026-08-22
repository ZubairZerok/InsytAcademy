"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { login, signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SectorSelection } from "@/components/auth/sector-selection";

interface AuthFormProps {
    view: "login" | "signup";
}

export function AuthForm({ view }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Use refs instead of direct DOM manipulation for sector values
    const sectorRef = useRef<HTMLInputElement>(null);
    const subSectorRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const action = view === "login" ? login : signup;

        const result = await action(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
        // If success, the server action redirects, so we don't need to do anything here
    }

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    {view === "login" ? "AGENCY ACCESS" : "INITIATE PROTOCOL"}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                    {view === "login"
                        ? "Enter your credentials to access the system."
                        : "Create your identity to join the network."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {view === "signup" && (
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="full_name"
                                    className="block text-xs font-mono font-medium text-neon-green mb-1"
                                >
                                    CODENAME / NAME
                                </label>
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/50 sm:text-sm"
                                    placeholder="Agent 007"
                                />
                            </div>

                            {/* Hidden inputs for sector — updated via useRef (React pattern, not DOM manipulation) */}
                            <input type="hidden" name="sector" ref={sectorRef} />
                            <input type="hidden" name="sub_sector" ref={subSectorRef} />
                            <SectorSelection onSelect={(sector, sub) => {
                                if (sectorRef.current) sectorRef.current.value = sector;
                                if (subSectorRef.current) subSectorRef.current.value = sub;
                            }} />

                        </div>
                    )}

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

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs font-mono font-medium text-neon-green mb-1"
                        >
                            ENCRYPTION KEY
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={view === "login" ? "current-password" : "new-password"}
                            required
                            minLength={6}
                            className="block w-full rounded-md border border-white/10 bg-white/5 p-3 text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/50 sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    {view === "login" && (
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-xs text-neon-green hover:text-neon-green/80 hover:underline"
                            >
                                FORGOT PASSWORD?
                            </Link>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="rounded-md bg-red-500/10 p-3 text-xs text-red-500 border border-red-500/20" role="alert">
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
                    {view === "login" ? "AUTHENTICATE" : "ESTABLISH IDENTITY"}
                </Button>
            </form>

            <div className="text-center text-sm">
                {view === "login" ? (
                    <p className="text-gray-400">
                        New to the system?{" "}
                        <Link href="/signup" className="font-medium text-neon-green hover:text-neon-green/80 hover:underline">
                            Initialize User
                        </Link>
                    </p>
                ) : (
                    <p className="text-gray-400">
                        Already active?{" "}
                        <Link href="/login" className="font-medium text-neon-green hover:text-neon-green/80 hover:underline">
                            Access Terminal
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
