"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [visible, setVisible] = useState(false);
  const [bookingCode] = useState(() =>
    `TB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  );

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-green-50 via-blue-50 to-indigo-50 p-6">
      <div
        className={`w-full max-w-lg text-center transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-green-500 shadow-2xl shadow-green-200 text-6xl">
          ✅
        </div>

        <h1 className="mb-3 text-5xl font-black text-gray-900">
          Đặt phòng thành công!
        </h1>
        <p className="mb-8 text-lg text-gray-500">
          Cảm ơn bạn! Email xác nhận đã được gửi.
        </p>

        {/* Booking code */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <p className="mb-1 text-sm font-semibold text-gray-400 uppercase tracking-wider">Mã đặt phòng</p>
          <p className="font-mono text-3xl font-black text-blue-600">{bookingCode}</p>
        </div>

        {/* Info */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { icon: "📧", label: "Email xác nhận", desc: "Đã gửi" },
            { icon: "🏨", label: "Phòng", desc: "Đã xác nhận" },
            { icon: "💳", label: "Thanh toán", desc: "Thành công" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 shadow-md">
              <div className="text-3xl mb-1">{item.icon}</div>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-sm font-bold text-green-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-8 py-4 font-black text-white hover:bg-blue-700 transition"
          >
            🏠 Về trang chủ
          </Link>
          <Link
            href="/profile"
            className="rounded-xl border-2 border-gray-200 bg-white px-8 py-4 font-black text-gray-700 hover:bg-gray-50 transition"
          >
            Xem lịch sử đặt phòng
          </Link>
        </div>
      </div>
    </div>
  );
}
