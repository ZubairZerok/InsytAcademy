import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-agri-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-20 prose prose-invert">
                <h1>Terms of Service</h1>
                <p className="text-gray-400">Last updated: July 2026</p>
                <p>
                    By using INSYT Academy you agree to use the platform lawfully and not to attempt to disrupt or abuse the service.
                </p>
                <h2>Accounts</h2>
                <p>You are responsible for activity under your account and for keeping your credentials secure.</p>
                <h2>Content</h2>
                <p>Course materials are for your personal learning and professional development.</p>
                <h2>Payments</h2>
                <p>Paid courses are billed through our payment provider in BDT. See the <a href="/refund">refund policy</a>.</p>
                <h2>Contact</h2>
                <p>For any questions regarding these Terms, please contact us at <a href="mailto:support@insytacademy.com">support@insytacademy.com</a>.</p>
            </div>
        </div>
    );
}

