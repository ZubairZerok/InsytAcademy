"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, ChevronRight } from "lucide-react";
import { completeLesson } from "@/actions/progress";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface LessonCompleteButtonProps {
    lessonId: string;
    courseSlug: string;
    isCompleted?: boolean;
    nextLessonUrl?: string;
    className?: string;
}

export function LessonCompleteButton({
    lessonId,
    courseSlug,
    isCompleted = false,
    nextLessonUrl,
    className,
}: LessonCompleteButtonProps) {
    const router = useRouter();
    const [completed, setCompleted] = useState(isCompleted);
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        if (completed) return;

        setLoading(true);
        const result = await completeLesson(lessonId, courseSlug);

        if (result?.success) {
            setCompleted(true);
            // Simple alert for MVP feedback, ideally replace with Toast
            // alert(`+${result.xpGained} XP! System Updated.`);
            if (nextLessonUrl) {
                router.push(nextLessonUrl);
                router.refresh();
            }
        } else {
            console.error(result?.error);
        }
        setLoading(false);
    };

    if (completed) {
        return (
            <Button
                variant="outline"
                className={cn("cursor-default border-neon-green/50 text-neon-green hover:bg-transparent", className)}
            >
                <CheckCircle className="mr-2 h-4 w-4" />
                MODULE COMPLETE
            </Button>
        );
    }

    return (
        <Button
            onClick={handleComplete}
            disabled={loading}
            variant="primary"
            isLoading={loading}
            className={cn("group relative overflow-hidden w-full justify-between", className)}
        >
            <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4 fill-current group-hover:animate-pulse" />
                {nextLessonUrl ? "COMPLETE & CONTINUE (+50 XP)" : "COMPLETE MODULE (+50 XP)"}
            </div>
            {nextLessonUrl && <ChevronRight className="ml-2 h-4 w-4" />}

            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 bg-neon-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
    );
}
