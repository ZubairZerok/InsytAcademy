import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getPaymentGateway } from "@/lib/payments/payment-gateway";

export async function POST(req: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { courseId } = await req.json();
        if (!courseId || typeof courseId !== "string") {
            return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
        }

        // Price comes from the DB — never from the client.
        const { data: pricing } = await supabase
            .from("course_pricing")
            .select("price_bdt, is_free")
            .eq("course_id", courseId)
            .single();

        const isFree = !pricing || pricing.is_free;

        // Free courses enroll directly — no payment flow.
        if (isFree) {
            const service = createServiceClient();
            const { error: enrollErr } = await service
                .from("enrollments")
                .insert({ user_id: user.id, course_id: courseId });
            if (enrollErr && enrollErr.code !== "23505") {
                console.error("[payment/initialize] free enroll failed:", enrollErr);
                return NextResponse.json({ error: "Could not enroll." }, { status: 500 });
            }
            return NextResponse.json({ enrolled: true });
        }

        const amount = Number(pricing.price_bdt);

        const trxId = `INSYT_TRX_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        // Record the PENDING transaction with the service client (transactions has
        // no client INSERT policy by design).
        const service = createServiceClient();
        const { error: txErr } = await service.from("transactions").insert({
            user_id: user.id,
            course_id: courseId,
            amount,
            currency: "BDT",
            gateway: "BKASH",
            trx_id: trxId,
            status: "PENDING",
        });
        if (txErr) {
            console.error("[payment/initialize] tx insert failed:", txErr);
            return NextResponse.json({ error: "Could not start the transaction." }, { status: 500 });
        }

        // Build an absolute callback URL for the gateway redirect.
        const origin = new URL(req.url).origin;
        const callbackUrl = `${origin}/api/payment/callback`;

        const gateway = getPaymentGateway();
        const { checkoutUrl, providerPaymentId } = await gateway.initialize({
            orderId: trxId,
            amount,
            currency: "BDT",
            userId: user.id,
            courseId,
            callbackUrl,
        });

        // Persist the provider payment id for later verification.
        await service
            .from("transactions")
            .update({ pg_tx_id: providerPaymentId })
            .eq("trx_id", trxId);

        return NextResponse.json({ checkoutUrl, trxId });
    } catch (err: unknown) {
        console.error("[payment/initialize]", err);
        return NextResponse.json({ error: "Payment could not be initialized." }, { status: 500 });
    }
}
