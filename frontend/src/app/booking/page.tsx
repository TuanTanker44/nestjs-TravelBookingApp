"use client";

import api from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BookingPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const hotelId = searchParams.get("hotelId");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleBooking = async () => {
    try {
      await api.post("/booking", {
        hotelId,
        checkIn,
        checkOut,
      });

      toast.success("Booking created");

      router.push("/payment");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-lg">
        <h1 className="mb-8 text-4xl font-bold">
          Booking
        </h1>

        <div className="flex flex-col gap-5">
          <input
            type="date"
            className="rounded-xl border p-4"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border p-4"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <button
            onClick={handleBooking}
            className="rounded-xl bg-blue-600 p-4 text-white"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
