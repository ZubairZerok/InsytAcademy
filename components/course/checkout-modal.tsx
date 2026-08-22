"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Zap, Sparkles, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    courseTitle: string;
}

export function CheckoutModal({ isOpen, onClose, courseId, courseTitle }: CheckoutModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async (gateway: "BKASH" | "NAGAD" | "CARD_SSLCOMMERZ") => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/payment/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId, gateway })
            });

            const data = await res.json();
            if (data.error) {
                setError(data.error);
                return;
            }

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch {
            setError("Communication failure. Please retry.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-[#070A08] border border-white/10 text-white rounded-2xl p-6">
                <DialogHeader className="space-y-2">
                    <div className="flex items-center gap-2 text-neon-green">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-[10px] font-bold font-mono tracking-widest uppercase">SECURE PORTAL CHECKOUT</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-mono text-white leading-tight">
                        UNLOCK: {courseTitle.toUpperCase()}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-gray-400 font-mono">
                        Instant credential alignment and Cyber-Lab compile pipelines.
                    </DialogDescription>
                </DialogHeader>

                {/* Cognitive Commitment Trigger details */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3 pt-3">
                    <h4 className="text-xs font-mono font-bold text-neon-green uppercase tracking-wide">Included in this Protocol:</h4>
                    <ul className="text-xs space-y-2 text-gray-400 font-mono">
                        <li className="flex items-center gap-2">
                            <Zap className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                            <span>Full Access to Video & Lessons Modules</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <ShieldCheck className="h-3.5 w-3.5 text-neon-green shrink-0" />
                            <span>In-Browser WebAssembly Coding Environments</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span>Verifiable Dynamic Ivy-League Digital Credential</span>
                        </li>
                    </ul>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2 font-mono">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-3 pt-4">
                    <Button
                        variant="primary"
                        onClick={() => handleCheckout("BKASH")}
                        disabled={isLoading}
                        className="w-full bg-[#E51E56] hover:bg-[#E51E56]/90 text-white font-bold gap-2 py-6 rounded-xl border-none font-mono tracking-wider"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        PAY WITH bKash
                    </Button>

                    <Button
                        variant="primary"
                        onClick={() => handleCheckout("NAGAD")}
                        disabled={isLoading}
                        className="w-full bg-[#F06222] hover:bg-[#F06222]/90 text-white font-bold gap-2 py-6 rounded-xl border-none font-mono tracking-wider"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        PAY WITH Nagad
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => handleCheckout("CARD_SSLCOMMERZ")}
                        disabled={isLoading}
                        className="w-full border-white/10 hover:bg-white/[0.04] text-white font-bold gap-2 py-6 rounded-xl font-mono tracking-wider"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        CARD / MOBILE BANKING
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
