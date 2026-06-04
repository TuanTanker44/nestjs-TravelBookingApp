"use client";

import Navbar from "@/compoments/Navbar";
import api from "@/services/api";
import { getCurrentUser, logout } from "@/app/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  status: "CREATED" | "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "PAYMENT_FAILED" | "EXPIRED";
  room?: {
    hotelName?: string;
    roomType?:  string;
    checkIn?:   string;
    checkOut?:  string;
    guests?:    number;
    totalAmount?: number;
  };
  customer?: { email?: string; fullName?: string };
  createdAt?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  CONFIRMED:       { label: "✅ Đã xác nhận",     color: "bg-green-100 text-green-700" },
  PENDING_PAYMENT: { label: "⏳ Chờ thanh toán",  color: "bg-yellow-100 text-yellow-700" },
  CANCELLED:       { label: "❌ Đã hủy",          color: "bg-red-100 text-red-700" },
  PAYMENT_FAILED:  { label: "💳 TT thất bại",     color: "bg-red-100 text-red-700" },
  EXPIRED:         { label: "⌛ Hết hạn",         color: "bg-gray-100 text-gray-500" },
  CREATED:         { label: "🆕 Mới tạo",         color: "bg-blue-100 text-blue-700" },
};

export default function ProfilePage() {
  const router = useRouter();
  const [user,     setUser]     = useState<ReturnType<typeof getCurrentUser>>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/login"); return; }
    
    const fetchBookings = async () => {
      try {
        setUser(u);
        const res = await api.get("/bookings", { params: { customerEmail: u.email } });
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    router.push("/");
  };

  const handleCancel = async (id: string) => {
    try {
      await api.post(`/bookings/${id}/cancel`, { reason: "Khách hủy" });
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: "CANCELLED" } : b)
      );
      toast.success("Đã hủy đặt phòng");
    } catch {
      toast.error("Không thể hủy lúc này");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 pt-24 pb-12">
        {/* User card */}
        {user && (
          <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                👤
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{user.name ?? "Người dùng"}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-50 px-5 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition"
            >
              Đăng xuất
            </button>
          </div>
        )}

        {/* Bookings */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Lịch sử đặt phòng</h2>
          <Link
            href="/search?keyword="
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 transition"
          >
            + Đặt phòng mới
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <div className="text-6xl mb-4">🏨</div>
            <p className="text-xl font-bold text-gray-600 mb-2">Chưa có đặt phòng nào</p>
            <p className="text-gray-400 mb-6">Tìm và đặt khách sạn ngay hôm nay!</p>
            <Link
              href="/search?keyword="
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition"
            >
              Tìm khách sạn
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const cfg = STATUS_CONFIG[b.status] ?? { label: b.status, color: "bg-gray-100 text-gray-700" };
              const canCancel = b.status === "PENDING_PAYMENT" || b.status === "CREATED";

              return (
                <div key={b.id} className="rounded-2xl bg-white p-6 shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-lg font-black text-gray-900">
                          {b.room?.hotelName ?? "Khách sạn"}
                        </p>
                        <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {b.room?.roomType && `${b.room.roomType} · `}
                        {b.room?.checkIn && b.room?.checkOut
                          ? `${b.room.checkIn} → ${b.room.checkOut}`
                          : ""}
                        {b.room?.guests ? ` · ${b.room.guests} khách` : ""}
                      </p>

                      <p className="mt-1 text-xs text-gray-400 font-mono">
                        #{b.id}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {b.room?.totalAmount ? (
                        <p className="text-xl font-black text-blue-600">${b.room.totalAmount}</p>
                      ) : null}
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="mt-2 text-xs font-semibold text-red-500 hover:underline"
                        >
                          Hủy đặt phòng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
