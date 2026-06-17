"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingApi, hotelApi } from "@/services/api";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

const MOCK = {
  "vn-1": { name: "InterContinental Đà Nẵng", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", price: 280 },
  "vn-2": { name: "Vinpearl Resort Nha Trang", img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80", price: 195 },
  "vn-3": { name: "Sofitel Legend Metropole", img: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80", price: 320 },
  "vn-4": { name: "Park Hyatt Sài Gòn", img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80", price: 260 },
  "vn-5": { name: "Anantara Hội An", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80", price: 175 },
  "vn-6": { name: "Six Senses Côn Đảo", img: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80", price: 450 },
} as Record<string, { name: string; img: string; price: number }>;

const ROOM_LABELS: Record<string, string> = { DELUXE: "Phòng Deluxe", SUPERIOR: "Ocean View", SUITE: "Suite Premium" };
const ROOM_EXTRAS: Record<string, number> = { DELUXE: 0, SUPERIOR: 50, SUITE: 150 };

function BookingContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const hotelId = sp.get("hotelId") ?? "";
  const roomType = sp.get("roomType") ?? "DELUXE";

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [hotel, setHotel] = useState<{ name: string; img: string; price: number } | null>(null);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState("2");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const pricePerNight = (hotel?.price ?? 280) + (ROOM_EXTRAS[roomType] ?? 0);
  const taxes = Math.round(pricePerNight * nights * 0.1);
  const total = pricePerNight * nights + taxes;

  useEffect(() => {
    if (!hotelId) return;
    hotelApi.get(`/hotel/${hotelId}`)
      .then(res => {
        const d = res.data;
        setHotel({ name: d.name, img: d.image ?? d.img ?? "", price: d.price_min ?? d.price ?? 280 });
      })
      .catch(() => setHotel(MOCK[hotelId] ?? MOCK["vn-1"]));
  }, [hotelId]);

  const handleBook = async () => {
    if (!checkIn || !checkOut) { toast.error("Chọn ngày check-in và check-out"); return; }
    if (checkOut <= checkIn) { toast.error("Ngày check-out phải sau check-in"); return; }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Vui lòng đăng nhập để đặt phòng"); router.push("/login"); return; }

    setLoading(true);
    try {
      const res = await bookingApi.post("/bookings", {
        hotelId, roomType, checkIn, checkOut,
        guests: Number(guests), note, totalPrice: total,
      });
      const bookingId = res.data?.id ?? res.data?.bookingId ?? "demo-123";
      toast.success("Đặt phòng thành công! 🎉");
      router.push(`/payment?bookingId=${bookingId}&total=${total}`);
    } catch {
      // fallback for demo
      toast.success("Đặt phòng thành công! (demo) 🎉");
      router.push(`/payment?bookingId=demo-${Date.now()}&total=${total}`);
    } finally { setLoading(false); }
  };

  const inputCls = "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 py-12 pt-28">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gold">Bước 1/2</p>
        <h1 className="font-display mb-8 text-4xl font-bold" style={{ color: "var(--text)" }}>Xác nhận đặt phòng</h1>

        <div className="grid gap-8 md:grid-cols-3">

          {/* Form */}
          <div className="space-y-5 md:col-span-2">

            {/* Dates & guests */}
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-display mb-5 text-xl font-bold" style={{ color: "var(--text)" }}>Thời gian lưu trú</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Check-in", val: checkIn, set: setCheckIn, min: today, type: "date" },
                  { label: "Check-out", val: checkOut, set: setCheckOut, min: checkIn || today, type: "date" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{f.label}</label>
                    <input type={f.type} min={f.min} value={f.val}
                      onChange={e => f.set(e.target.value)} className={inputCls} />
                  </div>
                ))}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Số khách</label>
                  <select value={guests} onChange={e => setGuests(e.target.value)} className={inputCls}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} khách</option>)}
                  </select>
                </div>
              </div>

              {/* Nights badge */}
              {checkIn && checkOut && checkOut > checkIn && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                  style={{ background: "rgba(201,168,76,0.08)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" }}>
                  ✦ {nights} đêm · Check-out {new Date(checkOut).toLocaleDateString("vi-VN")}
                </div>
              )}
            </div>

            {/* Room type summary */}
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-display mb-4 text-xl font-bold" style={{ color: "var(--text)" }}>Loại phòng đã chọn</h2>
              <div className="flex items-center justify-between rounded-xl px-5 py-4"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <div>
                  <p className="font-bold" style={{ color: "var(--text)" }}>{ROOM_LABELS[roomType] ?? roomType}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {roomType === "SUITE" ? "70m² · 2 phòng ngủ · Jacuzzi" : roomType === "SUPERIOR" ? "45m² · View biển · Ban công" : "40m² · View vườn · Bồn tắm"}
                  </p>
                </div>
                <p className="font-bold text-xl text-gold">${pricePerNight}<span className="text-xs font-normal ml-1" style={{ color: "var(--muted)" }}>/đêm</span></p>
              </div>
            </div>

            {/* Special request */}
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-display mb-4 text-xl font-bold" style={{ color: "var(--text)" }}>Yêu cầu đặc biệt</h2>
              <textarea
                rows={3} placeholder="Phòng tầng cao, bữa sáng, sinh nhật, ..."
                className={`${inputCls} resize-none`}
                value={note} onChange={e => setNote(e.target.value)} />
              <p className="mt-1.5 text-xs" style={{ color: "var(--muted)" }}>Không đảm bảo nhưng chúng tôi sẽ cố hết sức</p>
            </div>
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="sticky top-24 rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid rgba(201,168,76,0.25)" }}>
              {hotel && (
                <div className="mb-5">
                  <div className="relative h-36 overflow-hidden rounded-xl mb-3">
                    <img src={hotel.img} alt={hotel.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,15,0.5) 0%, transparent 60%)" }} />
                  </div>
                  <p className="font-bold text-sm leading-tight" style={{ color: "var(--text)" }}>{hotel.name}</p>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>${pricePerNight} × {nights} đêm</span>
                  <span style={{ color: "var(--text)" }}>${pricePerNight * nights}</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>Thuế & phí (10%)</span>
                  <span style={{ color: "var(--text)" }}>${taxes}</span>
                </div>
                <div className="h-px" style={{ background: "var(--border)" }} />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold" style={{ color: "var(--text)" }}>Tổng cộng</span>
                  <div className="text-right">
                    <span className="font-display text-3xl font-bold text-gold">${total}</span>
                    <span className="block text-xs" style={{ color: "var(--muted)" }}>USD · bao gồm thuế</span>
                  </div>
                </div>
              </div>

              <button onClick={handleBook} disabled={loading}
                className="btn-gold mt-6 w-full rounded-xl py-4 text-sm font-bold disabled:opacity-50">
                {loading ? "Đang xử lý..." : "Tiếp tục thanh toán →"}
              </button>

              <div className="mt-4 space-y-1.5 text-xs" style={{ color: "var(--muted)" }}>
                <p>🔒 Thanh toán bảo mật SSL 256-bit</p>
                <p>✦ Miễn phí hủy trong 24h đầu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return <Suspense><BookingContent /></Suspense>;
}
