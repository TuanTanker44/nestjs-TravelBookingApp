"use client";

import api from "@/services/api";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelId = searchParams.get("hotelId") ?? "";
  const roomId  = searchParams.get("roomId")  ?? "";

  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests,   setGuests]   = useState(2);
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Prefill từ token
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt phòng");
      router.push("/login");
      return;
    }
    setEmail(user.email);
    setFullName(user.name ?? "");
  }, [router]);

  // Tính số đêm
  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;

  const handleBooking = async () => {
    if (!checkIn || !checkOut)  { toast.error("Chọn ngày check-in và check-out"); return; }
    if (nights <= 0)            { toast.error("Check-out phải sau check-in"); return; }
    if (!fullName.trim())       { toast.error("Nhập họ tên"); return; }
    if (!email.includes("@"))   { toast.error("Email không hợp lệ"); return; }
    if (!phone.trim())          { toast.error("Nhập số điện thoại"); return; }

    setLoading(true);
    try {
      // POST http://localhost:5000/api/booking
      // → gateway → booking-service POST /bookings/temporary
      const res = await api.post("/booking", {
        searchSessionId: `session-${Date.now()}`,
        room: {
          hotelId,
          hotelName: "Khách sạn",   // sẽ có khi lấy từ hotel detail
          roomId:    roomId || hotelId,
          roomType:  "STANDARD",
          amenities: [],
          checkIn,
          checkOut,
          guests,
          totalAmount: 0,
        },
        customer: {
          fullName,
          email,
          phoneNumber: phone,
          nationalId:  "000000000",
        },
      });

      const bookingId: string = res.data?.id ?? `booking-${Date.now()}`;
      localStorage.setItem("bookingId", bookingId);
      toast.success("Đặt phòng thành công!");
      router.push(`/payment?bookingId=${bookingId}&nights=${nights}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Lỗi khi đặt phòng. Thử lại sau.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-6">
        {/* Back */}
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
          ← Quay lại
        </button>

        <h1 className="mb-8 text-4xl font-black text-gray-900">Thông tin đặt phòng</h1>

        <div className="space-y-6">
          {/* Dates */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-black">📅 Chọn ngày</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-600">Check-in</label>
                <input
                  type="date"
                  min={today}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-600">Check-out</label>
                <input
                  type="date"
                  min={checkIn || today}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-semibold text-gray-600">Số khách</label>
              <select
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 transition"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} khách</option>
                ))}
              </select>
            </div>

            {nights > 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3">
                <span className="text-blue-600">✅</span>
                <span className="text-sm font-semibold text-blue-800">
                  {nights} đêm · {guests} khách
                </span>
              </div>
            )}
          </div>

          {/* Customer info */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-black">👤 Thông tin liên hệ</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-600">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-600">Email xác nhận</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-600">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0901 234 567"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-5 text-lg font-black text-white hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98] transition"
          >
            {loading ? "Đang xử lý..." : "Tiếp tục thanh toán →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>}>
      <BookingContent />
    </Suspense>
  );
}
