import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the INSYT Academy team for support, feedback, or business inquiries.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-agri-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-neon-green/60 mb-3">Get In Touch</p>
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Have a question about a course, need technical support, or want to discuss a partnership?
                        We&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 mb-12">
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-2">
                        <p className="text-xs font-mono uppercase tracking-widest text-neon-green/60">Support</p>
                        <h2 className="text-lg font-bold">Technical Help</h2>
                        <p className="text-sm text-gray-400">For course access, platform issues, or account questions.</p>
                        <a
                            href="mailto:support@insytacademy.com"
                            className="inline-block text-sm text-neon-green hover:underline mt-2"
                        >
                            support@insytacademy.com
                        </a>
                    </div>
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-2">
                        <p className="text-xs font-mono uppercase tracking-widest text-neon-green/60">Business</p>
                        <h2 className="text-lg font-bold">Partnerships & Licensing</h2>
                        <p className="text-sm text-gray-400">For institutional licensing, content partnerships, or B2B inquiries.</p>
                        <a
                            href="mailto:partnerships@insytacademy.com"
                            className="inline-block text-sm text-neon-green hover:underline mt-2"
                        >
                            partnerships@insytacademy.com
                        </a>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                    <h2 className="text-xl font-bold mb-6">Send a Message</h2>
                    <form className="space-y-4" action="mailto:support@insytacademy.com" method="get">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="contact-name" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Name</label>
                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green/40 transition-colors"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-email" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Email</label>
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green/40 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="contact-subject" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Subject</label>
                            <input
                                id="contact-subject"
                                name="subject"
                                type="text"
                                required
                                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green/40 transition-colors"
                                placeholder="How can we help?"
                            />
                        </div>
                        <div>
                            <label htmlFor="contact-message" className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Message</label>
                            <textarea
                                id="contact-message"
                                name="body"
                                rows={5}
                                required
                                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green/40 transition-colors resize-none"
                                placeholder="Tell us more about your question or issue..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-neon-green text-black font-bold py-3 rounded-xl hover:bg-neon-green/90 transition-colors text-sm"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
