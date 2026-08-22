"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { enrollCourse } from "@/actions/enrollment";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface EnrollButtonProps {
    courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleEnroll = async () => {
        setIsLoading(true);
        const result = await enrollCourse(courseId);

        if (result?.success) {
            router.refresh();
            // Optional: Add toast notification here
        } else {
            console.error(result?.error);
        }
        setIsLoading(false);
    };

    return (
        <Button
            onClick={handleEnroll}
            disabled={isLoading}
            className="w-full md:w-auto animate-pulse hover:animate-none"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
            )}
            ENROLL IN PROTOCOL
        </Button>
    );
}
