import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getPaymentGateway } from "@/lib/payments/payment-gateway";
import type { VerifyParams } from "@/lib/payments/types";

// Shared verification + fulfilment. NEVER trusts a client-supplied "status":
// the gateway.verify() call re-confirms with the provider server-side.
async function processCallback(params: VerifyParams): Promise<
    { ok: true; status: "SUCCESS" | "FAILED"; orderId?: string } | { ok: false; code: number; message: string }
> {
    const gateway = getPaymentGateway();
    const result = await gateway.verify(params);

    const orderId =
        result.orderId ??
        (typeof params.orderId === "string" ? params.orderId : undefined) ??
        (typeof params.trxId === "string" ? params.trxId : undefined);

    if (!orderId) {
        return { ok: false, code: 400, message: "Missing order reference" };
    }

    const service = createServiceClient();
    const { data: trx, error: fetchErr } = await service
        .from("transactions")
        .select("*")
        .eq("trx_id", orderId)
        .single();

    if (fetchErr || !trx) {
        return { ok: false, code: 404, message: "Transaction not found" };
    }

    // Idempotency: never re-process a completed transaction.
    if (trx.status === "SUCCESS") {
        return { ok: true, status: "SUCCESS", orderId };
    }

    // Provider rejected / unverified -> mark FAILED.
    if (!result.verified || result.status !== "SUCCESS") {
        await service
            .from("transactions")
            .update({ status: "FAILED", updated_at: new Date().toISOString() })
            .eq("trx_id", orderId);
        return { ok: true, status: "FAILED", orderId };
    }

    // Tamper check: if the provider reported an amount, it must match what we charged.
    if (result.amount !== undefined && Math.abs(result.amount - Number(trx.amount)) > 0.001) {
        console.error(`[payment/callback] amount mismatch for ${orderId}: provider=${result.amount} db=${trx.amount}`);
        await service
            .from("transactions")
            .update({ status: "FAILED", updated_at: new Date().toISOString() })
            .eq("trx_id", orderId);
        return { ok: false, code: 400, message: "Amount mismatch" };
    }

    // Mark SUCCESS + grant enrollment.
    await service
        .from("transactions")
        .update({
            status: "SUCCESS",
            pg_tx_id: result.providerPaymentId ?? trx.pg_tx_id,
            updated_at: new Date().toISOString(),
        })
        .eq("trx_id", orderId);

    const { error: enrollErr } = await service
        .from("enrollments")
        .insert({ user_id: trx.user_id, course_id: trx.course_id });
    if (enrollErr && enrollErr.code !== "23505") {
        console.error("[payment/callback] enrollment failed:", enrollErr);
    }

    return { ok: true, status: "SUCCESS", orderId };
}

// POST — used by the mock checkout page and any server-to-server IPN.
export async function POST(req: Request) {
    try {
        const body = (await req.json()) as VerifyParams;
        const res = await processCallback(body);
        if (!res.ok) {
            return NextResponse.json({ error: res.message }, { status: res.code });
        }
        return NextResponse.json({ success: res.status === "SUCCESS", status: res.status });
    } catch (err) {
        console.error("[payment/callback POST]", err);
        return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
    }
}

// GET — used by the bKash redirect back to our site. Redirects the user onward.
export async function GET(req: Request) {
    const origin = new URL(req.url).origin;
    try {
        const params = Object.fromEntries(new URL(req.url).searchParams.entries());
        const res = await processCallback(params);
        const outcome = res.ok && res.status === "SUCCESS" ? "success" : "failed";
        return NextResponse.redirect(`${origin}/academy?payment=${outcome}`);
    } catch (err) {
        console.error("[payment/callback GET]", err);
        return NextResponse.redirect(`${origin}/academy?payment=failed`);
    }
}
