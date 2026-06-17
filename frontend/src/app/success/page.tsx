"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

function SuccessContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const bookingId = sp.get("bookingId") ?? "demo-123";
  const total = sp.get("total") ?? "0";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">

          {/* Animated checkmark */}
          <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full"
            style={{ background: "rgba(201,168,76,0.1)", border: "2px solid rgba(201,168,76,0.35)" }}>
            <span className="text-6xl">✦</span>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-3">Đặt phòng thành công</p>
          <h1 className="font-display mb-4 text-4xl font-bold" style={{ color: "var(--text)" }}>
            Chúc mừng bạn! 🎉
          </h1>
          <p className="mb-8 text-base" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Đặt phòng của bạn đã được xác nhận. Chúng tôi đã gửi email xác nhận với đầy đủ thông tin.
          </p>

          {/* Booking info card */}
          <div className="mb-8 rounded-2xl p-6 text-left" style={{ background: "var(--surface)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <div className="space-y-3">
              {[
                ["Mã đặt phòng", bookingId],
                ["Tổng thanh toán", `$${total} USD`],
                ["Trạng thái", "✅ Đã xác nhận"],
              ].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>{l}</span>
                  <span className={`font-semibold text-sm ${l === "Trạng thái" ? "text-green-400" : ""}`}
                    style={l !== "Trạng thái" ? { color: "var(--text)" } : undefined}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/profile" className="btn-gold rounded-xl px-8 py-3.5 text-sm font-bold">
              Xem lịch sử đặt phòng
            </Link>
            <button onClick={() => router.push("/")}
              className="rounded-xl px-8 py-3.5 text-sm font-semibold transition hover:border-gold"
              style={{ border: "1px solid var(--border)", color: "var(--muted)", background: "var(--surface)" }}>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>;
}
