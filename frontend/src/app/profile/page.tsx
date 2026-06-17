"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, bookingApi } from "@/services/api";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

interface Booking {
  id: string; hotelName?: string; checkIn?: string; checkOut?: string;
  totalPrice?: number; status?: string; roomType?: string; createdAt?: string;
}

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: "Đã xác nhận", color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
  pending:   { label: "Chờ xử lý",   color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  cancelled: { label: "Đã hủy",      color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  completed: { label: "Hoàn thành",  color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
};

const MOCK_BOOKINGS: Booking[] = [
  { id: "bk-001", hotelName: "InterContinental Đà Nẵng", checkIn: "2025-08-10", checkOut: "2025-08-14", totalPrice: 1200, status: "confirmed", roomType: "SUITE" },
  { id: "bk-002", hotelName: "Vinpearl Nha Trang", checkIn: "2025-06-01", checkOut: "2025-06-05", totalPrice: 820, status: "completed", roomType: "SUPERIOR" },
  { id: "bk-003", hotelName: "Park Hyatt Sài Gòn", checkIn: "2025-05-12", checkOut: "2025-05-14", totalPrice: 572, status: "completed", roomType: "DELUXE" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"bookings" | "account">("bookings");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(""); const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    authApi.get("/auth/profile")
      .then(res => { setUser(res.data); setName(res.data?.name ?? ""); })
      .catch(() => { setUser({ name: "Người dùng", email: "user@example.com" }); setName("Người dùng"); });

    bookingApi.get("/bookings/my")
      .then(res => {
        const d = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        setBookings(d.length ? d : MOCK_BOOKINGS);
      })
      .catch(() => setBookings(MOCK_BOOKINGS))
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    toast.success("Đã đăng xuất");
    router.push("/");
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await authApi.patch("/auth/profile", { name });
      setUser(u => ({ ...u, name }));
      toast.success("Đã lưu thông tin");
    } catch { toast.success("Đã lưu (demo)"); setUser(u => ({ ...u, name })); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 py-12 pt-28">

        {/* Header */}
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold"
            style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.25),rgba(201,168,76,0.05))", border: "1.5px solid rgba(201,168,76,0.35)", color: "var(--gold)" }}>
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold" style={{ color: "var(--text)" }}>{user?.name ?? "..."}</h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{user?.email}</p>
          </div>
          <button onClick={logout} className="ml-auto rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:border-red-400"
            style={{ border: "1px solid var(--border)", color: "#f87171", background: "var(--surface)" }}>
            Đăng xuất
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl p-1" style={{ background: "var(--surface)", border: "1px solid var(--border)", width: "fit-content" }}>
          {(["bookings", "account"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
              style={tab === t
                ? { background: "var(--gold)", color: "#0a0a0f" }
                : { color: "var(--muted)" }}>
              {t === "bookings" ? "Lịch sử đặt phòng" : "Thông tin tài khoản"}
            </button>
          ))}
        </div>

        {/* Bookings tab */}
        {tab === "bookings" && (
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl" style={{ background: "var(--surface)" }} />)
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span className="text-5xl mb-4">🧳</span>
                <p className="font-bold text-lg mb-2" style={{ color: "var(--text)" }}>Chưa có đặt phòng nào</p>
                <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>Khám phá các khách sạn tuyệt vời và đặt ngay hôm nay</p>
                <button onClick={() => router.push("/search")} className="btn-gold rounded-xl px-6 py-3 text-sm font-bold">
                  Tìm khách sạn
                </button>
              </div>
            ) : bookings.map(b => {
              const st = STATUS_STYLE[b.status ?? "pending"] ?? STATUS_STYLE.pending;
              const nights = b.checkIn && b.checkOut
                ? Math.round((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000)
                : null;
              return (
                <div key={b.id} className="rounded-2xl p-6 transition hover:border-gold/30"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-base truncate" style={{ color: "var(--text)" }}>{b.hotelName ?? "Khách sạn"}</h3>
                        <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                          style={{ background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs" style={{ color: "var(--muted)" }}>
                        {b.checkIn && <span>📅 Check-in: {new Date(b.checkIn).toLocaleDateString("vi-VN")}</span>}
                        {b.checkOut && <span>📅 Check-out: {new Date(b.checkOut).toLocaleDateString("vi-VN")}</span>}
                        {nights && <span>🌙 {nights} đêm</span>}
                        {b.roomType && <span>🛏 {b.roomType}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-2xl font-bold text-gold">${b.totalPrice ?? 0}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>#{b.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Account tab */}
        {tab === "account" && (
          <div className="max-w-lg rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 className="font-display mb-5 text-2xl font-bold" style={{ color: "var(--text)" }}>Thông tin cá nhân</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Họ và tên</label>
                <input type="text" className={inputCls} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Email</label>
                <input type="email" className={`${inputCls} opacity-60 cursor-not-allowed`}
                  value={user?.email ?? ""} readOnly />
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Email không thể thay đổi</p>
              </div>
              <button onClick={saveProfile} disabled={saving}
                className="btn-gold rounded-xl px-8 py-3 text-sm font-bold disabled:opacity-50 mt-2">
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
