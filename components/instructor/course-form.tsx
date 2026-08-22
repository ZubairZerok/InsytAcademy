"use client";
 
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { createCourse, updateCourse } from "@/actions/instructor";
import { useRouter } from "next/navigation";

interface CourseData {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    thumbnail_url?: string | null;
    is_published: boolean;
}

interface CourseFormProps {
    initialData?: CourseData;
}

export function CourseForm({ initialData }: CourseFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        thumbnail_url: initialData?.thumbnail_url || "",
        is_published: initialData?.is_published || false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = initialData 
            ? await updateCourse(initialData.id, formData)
            : await createCourse(formData);

        if (result.success) {
            router.push("/instructor/courses");
            router.refresh();
        } else {
            alert(result.error || "Failed to save course");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <GlassCard className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-mono uppercase tracking-widest text-gray-400">Protocol Title</Label>
                        <Input 
                            id="title" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Advanced Crop Analysis"
                            className="bg-black/40 border-white/10"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-xs font-mono uppercase tracking-widest text-gray-400">Identifier (Slug)</Label>
                        <Input 
                            id="slug" 
                            value={formData.slug} 
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            placeholder="e.g. crop-analysis-adv"
                            className="bg-black/40 border-white/10"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs font-mono uppercase tracking-widest text-gray-400">Mission Description</Label>
                    <textarea 
                        id="description" 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Detail the training objectives..."
                        className="w-full h-32 rounded-lg bg-black/40 border border-white/10 p-4 text-white focus:border-neon-green/50 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="thumbnail" className="text-xs font-mono uppercase tracking-widest text-gray-400">Thumbnail URL</Label>
                    <Input 
                        id="thumbnail" 
                        value={formData.thumbnail_url} 
                        onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                        className="bg-black/40 border-white/10"
                    />
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
                    <input 
                        type="checkbox" 
                        id="published" 
                        checked={formData.is_published}
                        onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                        className="h-4 w-4 rounded border-white/20 bg-black/40 text-neon-green accent-neon-green"
                    />
                    <Label htmlFor="published" className="text-sm font-medium text-white">PUBLISH TO MAIN DIRECTORY</Label>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 bg-neon-green text-black hover:bg-neon-green/90 font-bold h-12"
                    >
                        {isLoading ? "SYNCHRONIZING..." : initialData ? "UPDATE PROTOCOL" : "INITIALIZE PROTOCOL"}
                    </Button>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => router.back()}
                        className="px-8 border border-white/10"
                    >
                        ABORT
                    </Button>
                </div>
            </GlassCard>
        </form>
    );
}
