"use client";

import { cn } from "@/lib/utils";
import { Tv } from "lucide-react";

interface VideoPlayerProps {
    url: string | null;
    poster?: string | null;
    className?: string;
}

export function VideoPlayer({ url, poster, className }: VideoPlayerProps) {
    if (!url) {
        return (
            <div
                className={cn(
                    "relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-md border border-neon-green/30 bg-black shadow-[0_0_30px_-10px_rgba(0,255,148,0.2)]",
                    className
                )}
            >
                <Tv className="mb-4 h-12 w-12 text-gray-700" />
                <h3 className="font-mono text-lg font-bold text-gray-500">
                    NO SIGNAL
                </h3>
                <p className="text-xs text-gray-700">VIDEO SOURCE MISSING</p>

                {/* Scanlines Effect */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] bg-repeat opacity-20" />
            </div>
        );
    }

    // Robust check and extraction for YouTube
    const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
    let embedUrl = url;

    if (isYoutube) {
        if (url.includes("youtu.be/")) {
            const id = url.split("youtu.be/")[1]?.split("?")[0];
            embedUrl = `https://www.youtube.com/embed/${id}`;
        } else if (url.includes("watch?v=")) {
            const id = url.split("watch?v=")[1]?.split("&")[0];
            embedUrl = `https://www.youtube.com/embed/${id}`;
        } else if (!url.includes("/embed/")) {
            embedUrl = url.replace("watch?v=", "embed/");
        }
    }

    return (
        <div
            className={cn(
                "relative aspect-video w-full overflow-hidden rounded-2xl border border-neon-green/30 bg-black shadow-[0_0_35px_-5px_rgba(0,255,148,0.25)]",
                className
            )}
        >
            {isYoutube ? (
                <iframe
                    src={embedUrl}
                    className="h-full w-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <video
                    src={url}
                    poster={poster || undefined}
                    controls
                    className="h-full w-full"
                />
            )}
        </div>
    );
}
