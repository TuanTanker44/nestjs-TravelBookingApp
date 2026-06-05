"use client";

import api from "@/services/api";
import { getCurrentUser } from "@/app/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import toast from "react-hot-toast";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId") ?? localStorage.getItem("bookingId") ?? "";
  const nights    = Number(searchParams.get("nights") ?? 1);

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry,     setExpiry]     = useState("");
  const [cvv,        setCvv]        = useState("");
  const [loading,    setLoading]    = useState(false);
  const timestampRef = useRef<number | null>(null);

  // Format: xxxx xxxx xxxx xxxx
  const fmtCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  // Detect card brand
  const brand = (() => {
    const n = cardNumber.replace(/\s/g, "");
    if (n.startsWith("4")) return "💳 Visa";
    if (/^5[1-5]/.test(n)) return "💳 Mastercard";
    if (n.startsWith("34") || n.startsWith("37")) return "💳 AmEx";
    return "💳";
  })();

  const handlePayment = async () => {
    if (cardNumber.replace(/\s/g, "").length < 16) { toast.error("Số thẻ không hợp lệ"); return; }
    if (!cardHolder.trim()) { toast.error("Nhập tên chủ thẻ"); return; }
    if (expiry.length < 5)  { toast.error("Nhập ngày hết hạn"); return; }
    if (cvv.length < 3)     { toast.error("Nhập CVV"); return; }

    const user = getCurrentUser();

    setLoading(true);
    try {
      // POST http://localhost:5000/api/payment
      // → gateway → payment-service POST /payments/session
      const res = await api.post("/payment", {
        bookingId,
        amount:        299 * nights,   // price * nights (thực tế lấy từ booking)
        currency:      "USD",
        customerEmail: user?.email ?? "guest@example.com",
        returnUrl:     "http://localhost:3000/success",
      });

      const timestamp = timestampRef.current!;
      const paymentId: string = res.data?.payment?.id ?? `pay-${timestamp}`;

      // Xác nhận thanh toán thành công (simulate)
      await api.post(`/payment/${paymentId}/confirm`, {
        transactionId: `txn-${timestamp}`,
      }).catch(() => {}); // bỏ qua lỗi nếu chưa có endpoint

      localStorage.removeItem("bookingId");
      toast.success("Thanh toán thành công! 🎉");
      router.push("/success");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Lỗi thanh toán. Thử lại sau.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-lg px-6">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
          ← Quay lại
        </button>

        <h1 className="mb-2 text-4xl font-black text-gray-900">Thanh toán</h1>
        <p className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <span>🔒</span> Kết nối bảo mật SSL 256-bit
        </p>

        {/* Card preview */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 text-white shadow-2xl">
          <div className="mb-6 flex items-start justify-between">
            <span className="text-2xl font-black tracking-widest">✈️</span>
            <span className="text-sm font-semibold opacity-80">{brand}</span>
          </div>
          <p className="mb-6 font-mono text-2xl tracking-[0.25em]">
            {cardNumber || "•••• •••• •••• ••••"}
          </p>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-[10px] uppercase opacity-70 mb-0.5">Chủ thẻ</p>
              <p className="font-bold uppercase">{cardHolder || "HỌ TÊN CHỦ THẺ"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase opacity-70 mb-0.5">Hết hạn</p>
              <p className="font-bold">{expiry || "MM/YY"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md space-y-4">
          {/* Card number */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-600">Số thẻ</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              value={cardNumber}
              onChange={(e) => setCardNumber(fmtCard(e.target.value))}
              maxLength={19}
            />
          </div>

          {/* Card holder */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-600">Tên chủ thẻ</label>
            <input
              type="text"
              placeholder="NGUYEN VAN A"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-600">Hết hạn</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={expiry}
                maxLength={5}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                  setExpiry(v);
                }}
              />
            </div>

            {/* CVV */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-600">CVV</label>
              <input
                type="password"
                placeholder="•••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={cvv}
                maxLength={4}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          {/* Amount summary */}
          <div className="rounded-xl bg-gray-50 px-5 py-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Mã đặt phòng</span>
              <span className="font-mono font-semibold">{bookingId.slice(0, 12)}...</span>
            </div>
            {nights > 0 && (
              <div className="mt-1 flex justify-between text-sm text-gray-600">
                <span>Số đêm</span>
                <span className="font-semibold">{nights} đêm</span>
              </div>
            )}
            <div className="mt-3 flex justify-between border-t border-gray-200 pt-3">
              <span className="font-bold text-gray-900">Tổng thanh toán</span>
              <span className="text-xl font-black text-blue-600">${299 * nights}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-4 text-base font-black text-white hover:bg-green-700 disabled:opacity-50 active:scale-[0.98] transition"
          >
            {loading ? "Đang xử lý..." : `💳 Thanh toán $${299 * nights}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
