// lib/payments/types.ts
// Provider-agnostic payment abstraction. The rest of the app talks only to the
// PaymentProvider interface; the concrete implementation (live bKash vs. mock)
// is selected at runtime by lib/payments/payment-gateway.ts based on env vars.

export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface InitializeParams {
  /** Our internal order/transaction id (transactions.trx_id). */
  orderId: string;
  /** Amount to charge, major units (e.g. BDT). */
  amount: number;
  currency: string;
  userId: string;
  courseId: string;
  /** Absolute URL bKash should redirect the payer back to. */
  callbackUrl: string;
}

export interface InitializeResult {
  /** Where to send the user to complete payment (bKash URL or mock checkout). */
  checkoutUrl: string;
  /** Provider-side payment id (bKash paymentID / mock ref). Persisted for verify. */
  providerPaymentId: string;
}

/** Raw, untrusted payload received on the callback (query or body). */
export type VerifyParams = Record<string, unknown>;

export interface VerifyResult {
  /** True only when the provider itself confirms the payment server-side. */
  verified: boolean;
  status: PaymentStatus;
  /** Our order id, echoed back by the provider. */
  orderId?: string;
  providerPaymentId?: string;
  /** Authoritative amount from the provider (live only); used to detect tampering. */
  amount?: number;
  /** Human-readable reason on failure (for logs, not the user). */
  reason?: string;
}

export interface PaymentProvider {
  readonly mode: "live" | "mock";
  readonly name: string;
  initialize(params: InitializeParams): Promise<InitializeResult>;
  /**
   * Confirm a payment using ONLY provider-trusted data. Must never trust a
   * client-supplied "status" — live verifies via bKash's execute/query API;
   * mock confirms against its own dev-only state.
   */
  verify(params: VerifyParams): Promise<VerifyResult>;
}
