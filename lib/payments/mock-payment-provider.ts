// lib/payments/mock-payment-provider.ts
// Drop-in replacement for the live bKash provider used whenever bKash credentials
// are absent/placeholder. It mirrors the production response shapes so the rest
// of the app behaves identically, but performs NO real money movement.
//
// Safety: this provider is only ever instantiated by payment-gateway.ts when
// NODE_ENV !== 'production' (or keys are missing in a non-prod env). It must
// never run in production — the gateway throws instead of falling back to mock
// in production.

import type {
  PaymentProvider,
  InitializeParams,
  InitializeResult,
  VerifyParams,
  VerifyResult,
} from "./types";

async function fakeLatency() {
  // 500–1500ms to mimic real gateway round-trips.
  await new Promise((r) => setTimeout(r, 500 + Math.floor(Math.random() * 1000)));
}

export class MockPaymentProvider implements PaymentProvider {
  readonly mode = "mock" as const;
  readonly name = "mock-bkash";

  async initialize(params: InitializeParams): Promise<InitializeResult> {
    await fakeLatency();
    const providerPaymentId = `MOCK_${params.orderId}`;
    // Reuse the existing dev checkout page as the "hosted" mock checkout.
    const checkoutUrl = `/academy/checkout/sandbox?trx=${encodeURIComponent(
      params.orderId
    )}&gateway=BKASH&mock=1`;
    return { checkoutUrl, providerPaymentId };
  }

  async verify(params: VerifyParams): Promise<VerifyResult> {
    await fakeLatency();
    const orderId = typeof params.orderId === "string" ? params.orderId : undefined;
    // The mock checkout page sends the outcome the dev chose. This is only
    // trusted because this provider cannot exist in production.
    const outcome = params.outcome === "FAILED" ? "FAILED" : "SUCCESS";
    if (!orderId) {
      return { verified: false, status: "FAILED", reason: "missing orderId" };
    }
    return {
      verified: true,
      status: outcome,
      orderId,
      providerPaymentId: `MOCK_${orderId}`,
      // amount intentionally omitted — callback uses the DB amount as source of truth.
    };
  }
}
