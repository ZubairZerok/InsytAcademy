"use client";

import { Button } from "@/components/ui/button";
import { Terminal, Play } from "lucide-react";
import Link from "next/link";

interface TryItButtonProps {
    code: string;
}

export function TryItButton({ code }: TryItButtonProps) {
    // Clean the code for URL encoding
    const encodedCmd = encodeURIComponent(code.trim());

    return (
        <div className="my-4">
            <Link href={`/academy/simulator?cmd=${encodedCmd}`}>
                <Button variant="outline" size="sm" className="gap-2 border-neon-green/50 text-neon-green hover:bg-neon-green hover:text-black">
                    <Terminal className="h-4 w-4" />
                    RUN IN SIMULATOR
                    <Play className="h-3 w-3 ml-1 fill-current" />
                </Button>
            </Link>
        </div>
    );
}
