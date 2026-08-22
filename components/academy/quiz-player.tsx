"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitQuizAnswer } from "@/actions/quiz";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface Question {
    id: string;
    question: string;
    options: string[];
}

interface QuizPlayerProps {
    questions: Question[];
    courseSlug: string;
    lessonSlug: string;
}

export function QuizPlayer({ questions, courseSlug, lessonSlug }: QuizPlayerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleSubmit = async () => {
        if (selectedOption === null) return;

        setIsSubmitting(true);
        const result = await submitQuizAnswer(
            currentQuestion.id,
            selectedOption,
            courseSlug,
            lessonSlug
        );

        setFeedback({
            success: result.isCorrect || false,
            message: result.message || (result.isCorrect ? "Correct!" : "Incorrect."),
        });

        setIsSubmitting(false);
    };

    const handleNext = () => {
        setFeedback(null);
        setSelectedOption(null);
        if (!isLastQuestion) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="rounded-xl border border-white/5 bg-white/5 p-6 text-center text-gray-500">
                <HelpCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No training simulation available for this module.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-cyber-gray/50 bg-black/40 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-lg font-bold text-neon-green">
                    TRAINING SIMULATION
                </h3>
                <span className="text-xs font-mono text-gray-400">
                    Q{currentQuestionIndex + 1} / {questions.length}
                </span>
            </div>

            <div className="mb-6">
                <p className="text-lg text-white font-medium">{currentQuestion.question}</p>
            </div>

            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => !feedback && setSelectedOption(index)}
                        disabled={!!feedback}
                        className={cn(
                            "flex w-full items-center rounded-lg border px-4 py-3 text-left transition-all",
                            selectedOption === index
                                ? "border-neon-green bg-neon-green/10 text-white"
                                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10",
                            feedback && selectedOption === index && feedback.success && "border-neon-green bg-neon-green/20 text-neon-green",
                            feedback && selectedOption === index && !feedback.success && "border-red-500 bg-red-500/20 text-red-500"
                        )}
                    >
                        <span className="mr-3 font-mono text-xs opacity-50">
                            {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                    </button>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
                {feedback && (
                    <div className={cn(
                        "flex items-center gap-2 text-sm font-bold",
                        feedback.success ? "text-neon-green" : "text-red-500"
                    )}>
                        {feedback.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {feedback.message}
                    </div>
                )}

                <div className="ml-auto">
                    {!feedback ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedOption === null || isSubmitting}
                            isLoading={isSubmitting}
                        >
                            SUBMIT ANSWER
                        </Button>
                    ) : (
                        <Button onClick={handleNext} variant="outline">
                            {isLastQuestion ? "COMPLETE SIMULATION" : "NEXT QUESTION"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
