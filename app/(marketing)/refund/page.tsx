import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-agri-black text-white">
            <div className="max-w-3xl mx-auto px-6 py-20 prose prose-invert">
                <h1>Refund Policy</h1>
                <p className="text-gray-400">Last updated: {new Date().getFullYear()}</p>
                <p>
                    If a paid course does not meet your expectations, you may request a refund within
                    7 days of purchase, provided you have completed less than 20% of the course.
                </p>
                <h2>How to request</h2>
                <p>Contact us via <a href="mailto:support@insytacademy.com">support@insytacademy.com</a> or our <a href="/contact">contact page</a> with your transaction id. Approved refunds are returned through the original payment method.</p>
            </div>
        </div>
    );
}
