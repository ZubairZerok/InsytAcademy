// lib/payments/bkash-provider.ts
// Live bKash Tokenized Checkout integration.
//
// Flow:
//   1. initialize() -> grant token -> /checkout/create -> returns {bkashURL, paymentID}
//   2. user pays on bKash, is redirected back to our callbackUrl with paymentID + status
//   3. verify() -> /checkout/execute (or /payment/status) -> confirms 'Completed' + amount
//
// We NEVER trust a client-supplied success flag — verification always re-queries
// bKash server-to-server using the paymentID.

import type {
  PaymentProvider,
  InitializeParams,
  InitializeResult,
  VerifyParams,
  VerifyResult,
} from "./types";

interface BkashConfig {
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  baseUrl: string; // e.g. https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export class BkashProvider implements PaymentProvider {
  readonly mode = "live" as const;
  readonly name = "bkash";
  private cfg: BkashConfig;

  constructor(cfg: BkashConfig) {
    this.cfg = cfg;
  }

  private async getToken(): Promise<string> {
    const now = Date.now();
    if (cachedToken && cachedToken.expiresAt > now + 60_000) {
      return cachedToken.token;
    }
    const res = await fetch(`${this.cfg.baseUrl}/checkout/token/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: this.cfg.username,
        password: this.cfg.password,
      },
      body: JSON.stringify({
        app_key: this.cfg.appKey,
        app_secret: this.cfg.appSecret,
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`bKash token grant failed: ${res.status}`);
    const data = (await res.json()) as { id_token?: string; expires_in?: number };
    if (!data.id_token) throw new Error("bKash token grant: no id_token");
    cachedToken = {
      token: data.id_token,
      expiresAt: now + (data.expires_in ?? 3600) * 1000,
    };
    return data.id_token;
  }

  private async authHeaders() {
    const token = await this.getToken();
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
      "X-APP-Key": this.cfg.appKey,
    };
  }

  async initialize(params: InitializeParams): Promise<InitializeResult> {
    const res = await fetch(`${this.cfg.baseUrl}/checkout/create`, {
      method: "POST",
      headers: await this.authHeaders(),
      body: JSON.stringify({
        mode: "0011",
        payerReference: params.userId.slice(0, 16),
        callbackURL: params.callbackUrl,
        amount: params.amount.toFixed(2),
        currency: params.currency,
        intent: "sale",
        merchantInvoiceNumber: params.orderId,
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`bKash create failed: ${res.status}`);
    const data = (await res.json()) as { paymentID?: string; bkashURL?: string };
    if (!data.paymentID || !data.bkashURL) {
      throw new Error("bKash create: missing paymentID/bkashURL");
    }
    return { checkoutUrl: data.bkashURL, providerPaymentId: data.paymentID };
  }

  async verify(params: VerifyParams): Promise<VerifyResult> {
    const paymentID =
      typeof params.paymentID === "string" ? params.paymentID : undefined;
    const redirectStatus =
      typeof params.status === "string" ? params.status.toLowerCase() : undefined;

    if (!paymentID) {
      return { verified: false, status: "FAILED", reason: "missing paymentID" };
    }
    // User cancelled / failed on bKash's side.
    if (redirectStatus && redirectStatus !== "success") {
      return { verified: false, status: "FAILED", reason: `redirect status ${redirectStatus}` };
    }

    // Execute the payment to finalize and obtain authoritative result.
    const res = await fetch(`${this.cfg.baseUrl}/checkout/execute`, {
      method: "POST",
      headers: await this.authHeaders(),
      body: JSON.stringify({ paymentID }),
      cache: "no-store",
    });
    if (!res.ok) {
      return { verified: false, status: "FAILED", reason: `execute http ${res.status}` };
    }
    const data = (await res.json()) as {
      transactionStatus?: string;
      amount?: string;
      merchantInvoiceNumber?: string;
      trxID?: string;
    };

    const completed = data.transactionStatus === "Completed";
    return {
      verified: completed,
      status: completed ? "SUCCESS" : "FAILED",
      orderId: data.merchantInvoiceNumber,
      providerPaymentId: data.trxID ?? paymentID,
      amount: data.amount ? Number(data.amount) : undefined,
      reason: completed ? undefined : `transactionStatus=${data.transactionStatus}`,
    };
  }
}
