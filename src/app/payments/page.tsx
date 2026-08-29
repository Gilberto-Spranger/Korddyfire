"use client";

import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { Suspense } from "react";

const stripePromise = loadStripe("pk_test_...");

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  if (!searchParams) return null;

  const amount = Number(searchParams.get("amount") || 0);
  const buyerId = searchParams.get("buyer_id") || "";
  const sellerId = searchParams.get("seller_id") || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={amount} buyerId={buyerId} sellerId={sellerId} />
      </Elements>
    </div>
  );
}