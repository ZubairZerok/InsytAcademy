import Link from "next/link";
import { Globe } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="border-t border-white/10 bg-agri-black pt-12 pb-8 text-sm text-gray-400">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5 mb-12">
                    {/* Platform */}
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-1">Platform</p>
                        <Link href="/academy" className="hover:text-white transition-colors">Browse Courses</Link>
                        <Link href="/research" className="hover:text-white transition-colors">Research Tools</Link>
                        <Link href="/academy/simulator" className="hover:text-white transition-colors">Code Lab</Link>
                    </div>
                    {/* Company */}
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-1">Company</p>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Help & Support</Link>
                    </div>
                    {/* Legal */}
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-1">Legal</p>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                    {/* Language selector */}
                    <div className="md:col-span-1 lg:col-span-2 flex md:justify-end">
                        <button className="flex items-center gap-2 border border-white/20 px-4 py-2 text-white hover:border-white transition-colors h-fit rounded-md">
                            <Globe className="h-4 w-4" />
                            <span>English</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold tracking-tighter text-white">
                            INSYT<span className="text-neon-green">.</span>
                        </span>
                        <span className="text-xs text-gray-600">Academy</span>
                    </div>
                    <div className="text-xs">
                        © {new Date().getFullYear()} INSYT, Inc. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
