import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-agri-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-20 prose prose-invert">
                <h1>Privacy Policy</h1>
                <p className="text-gray-400">Last updated: {new Date().getFullYear()}</p>
                <p>
                    INSYT Academy collects the information needed to operate the platform: your
                    account details (name, email), your learning progress, and, for paid courses,
                    transaction records processed by our payment provider. We do not sell your
                    personal data.
                </p>
                <h2>What we collect</h2>
                <ul>
                    <li>Account information you provide at sign-up.</li>
                    <li>Learning activity (enrollments, lesson progress, quiz and problem attempts).</li>
                    <li>Payment metadata (amount, status, transaction id) — card/wallet credentials are handled solely by the payment gateway, never by us.</li>
                </ul>
                <h2>How we use it</h2>
                <p>To deliver courses, track progress, issue certificates, and improve the product.</p>
                <h2>Contact</h2>
                <p>Questions about your data? Reach us via <a href="mailto:support@insytacademy.com">support@insytacademy.com</a> or our <a href="/contact">contact page</a>.</p>
            </div>
        </div>
    );
}
