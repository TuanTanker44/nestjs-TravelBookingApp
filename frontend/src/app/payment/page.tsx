"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const router = useRouter();

  const handlePayment = () => {
    toast.success("Payment Success");

    router.push("/success");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-lg">
        <h1 className="mb-8 text-4xl font-bold">
          Payment
        </h1>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Card Number"
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="Card Holder"
            className="w-full rounded-xl border p-4"
          />

          <button
            onClick={handlePayment}
            className="w-full rounded-xl bg-green-600 p-4 text-white"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}