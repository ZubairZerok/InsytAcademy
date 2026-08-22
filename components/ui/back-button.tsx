"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ label = "BACK", href }: { label?: string; href?: string }) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            className="text-gray-400 hover:text-white pl-0 gap-1 mb-4"
        >
            <ChevronLeft className="h-4 w-4" />
            {label}
        </Button>
    );
}
