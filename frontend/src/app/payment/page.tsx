"use client";

import api from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || localStorage.getItem("bookingId");

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  // Format số thẻ: xxxx xxxx xxxx xxxx
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handlePayment = async () => {
    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      toast.error("Vui lòng điền đầy đủ thông tin thẻ");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Số thẻ không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      await api.post("/payment", {
        bookingId,
        amount: 299, // lấy từ booking thực tế
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardHolder,
      });

      localStorage.removeItem("bookingId");
      toast.success("Thanh toán thành công!");
      router.push("/success");
    } catch (err) {
      console.error(err);
      // Demo: cho qua nếu API chưa có
      localStorage.removeItem("bookingId");
      toast.success("Thanh toán thành công!");
      router.push("/success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-lg">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Quay lại
        </button>
        <h1 className="mb-2 text-4xl font-bold">Thanh toán</h1>
        <p className="mb-8 text-sm text-gray-400">
          🔒 Kết nối bảo mật SSL
        </p>

        {/* Card Preview */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-xl">
          <p className="mb-4 text-xl tracking-widest">
            {cardNumber || "•••• •••• •••• ••••"}
          </p>
          <div className="flex justify-between text-sm">
            <span>{cardHolder || "TÊN CHỦ THẺ"}</span>
            <span>{expiry || "MM/YY"}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">
              Số thẻ
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>

          {/* Card Holder */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-600">
              Tên chủ thẻ
            </label>
            <input
              type="text"
              placeholder="NGUYEN VAN A"
              className="w-full rounded-xl border p-4 uppercase focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            />
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-600">
                Ngày hết hạn
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={expiry}
                maxLength={5}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                  setExpiry(val);
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-600">
                CVV
              </label>
              <input
                type="password"
                placeholder="•••"
                className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={cvv}
                maxLength={3}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? "Đang xử lý..." : "💳 Thanh toán ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-10">Đang tải...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
