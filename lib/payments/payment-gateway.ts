// lib/payments/payment-gateway.ts
// Dynamic, zero-config provider selection.
//
//   - All bKash credentials present & non-placeholder -> live BkashProvider.
//   - Otherwise -> MockPaymentProvider (DEV ONLY).
//
// In production we REFUSE to fall back to mock: if credentials are missing the
// gateway throws, so we can never silently ship a fake payment flow to users.

import type { PaymentProvider } from "./types";
import { BkashProvider } from "./bkash-provider";
import { MockPaymentProvider } from "./mock-payment-provider";

function isPlaceholder(v: string | undefined): boolean {
  if (!v) return true;
  const t = v.trim().toLowerCase();
  return (
    t === "" ||
    t.includes("your_") ||
    t.includes("placeholder") ||
    t.includes("changeme") ||
    t === "xxx"
  );
}

function buildProvider(): PaymentProvider {
  const appKey = process.env.BKASH_APP_KEY;
  const appSecret = process.env.BKASH_APP_SECRET;
  const username = process.env.BKASH_USERNAME;
  const password = process.env.BKASH_PASSWORD;
  const baseUrl =
    process.env.BKASH_BASE_URL ||
    "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized";

  const haveAll =
    !isPlaceholder(appKey) &&
    !isPlaceholder(appSecret) &&
    !isPlaceholder(username) &&
    !isPlaceholder(password);

  if (haveAll) {
    // eslint-disable-next-line no-console
    console.log("[PaymentGateway] Initialized in LIVE mode (bKash)");
    return new BkashProvider({
      appKey: appKey!,
      appSecret: appSecret!,
      username: username!,
      password: password!,
      baseUrl,
    });
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[PaymentGateway] Refusing to start: bKash credentials are missing in production. " +
        "Set BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, BKASH_PASSWORD."
    );
  }

  // eslint-disable-next-line no-console
  console.log("[PaymentGateway] Initialized in MOCK mode");
  return new MockPaymentProvider();
}

// Lazily instantiate so a missing-cred throw happens at first use, not import.
let _gateway: PaymentProvider | null = null;
export function getPaymentGateway(): PaymentProvider {
  if (!_gateway) _gateway = buildProvider();
  return _gateway;
}
