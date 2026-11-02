import type { Metadata } from "next";
import { CheckoutResult } from "@/components/client/CheckoutResult";

export const metadata: Metadata = { title: "Payment" };

// Paystack's callback_url. The client layout already wraps this in <Suspense> for useSearchParams.
export default function CheckoutCallbackPage() {
  return <CheckoutResult />;
}
