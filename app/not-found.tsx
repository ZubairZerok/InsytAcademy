"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchX, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    const [searchValue, setSearchValue] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchValue.trim()) {
            router.push(`/academy?search=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-agri-black text-white flex flex-col items-center justify-center p-4 bg-grid-pattern">
            <div className="max-w-lg w-full bg-agri-dark/50 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-10 text-center flex flex-col items-center space-y-6 shadow-glass-lg">
                <div className="h-24 w-24 bg-neon-green/10 rounded-2xl flex items-center justify-center border border-neon-green/20 relative">
                    <SearchX className="h-12 w-12 text-neon-green" />
                    <div className="absolute -top-2 -right-2 bg-agri-black text-neon-green text-xs font-bold px-2 py-1 rounded-lg border border-neon-green/30 font-mono">
                        404
                    </div>
                </div>
                
                <div>
                    <h1 className="text-4xl font-bold mb-4">Page not found</h1>
                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                        The page or resource you are looking for has been moved, deleted, or never existed in our database.
                    </p>
                </div>

                <div className="w-full max-w-sm space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-neon-green transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search courses..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleSearch}
                            aria-label="Search courses"
                            className="w-full bg-black/40 border border-white/[0.06] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-green/30 transition-all font-mono text-sm"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link href="/academy" className="flex-1">
                            <Button variant="outline" className="w-full font-mono text-xs">
                                BROWSE COURSES
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button className="w-full font-bold font-mono text-xs">
                                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                                GO HOME
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
