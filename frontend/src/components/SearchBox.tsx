"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props { compact?: boolean; }

export default function SearchBox({ compact = false }: Props) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const today = new Date().toISOString().split("T")[0];

  const handleSearch = () => {
    router.push(`/search?keyword=${encodeURIComponent(keyword)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  if (compact) {
    return (
      <div className="glass rounded-xl p-1.5" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: "var(--surface2)" }}>
            <span style={{ color: "var(--gold)" }}>⌖</span>
            <input
              type="text"
              placeholder="Điểm đến hoặc tên khách sạn..."
              className="flex-1 bg-transparent text-sm outline-none border-none"
              style={{ color: "var(--text)" }}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className="btn-gold rounded-lg px-5 py-2.5 text-sm font-bold whitespace-nowrap">
            Tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-2 shadow-2xl" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">

        {/* Destination */}
        <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: "var(--surface2)" }}>
          <span style={{ color: "var(--gold)" }}>⌖</span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--muted)" }}>Điểm đến</p>
            <input
              type="text"
              placeholder="Hà Nội, Đà Nẵng, Nha Trang..."
              className="w-full bg-transparent text-sm outline-none border-none"
              style={{ color: "var(--text)" }}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch my-1" style={{ background: "var(--border)" }} />

        {/* Check-in */}
        <div className="flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: "var(--surface2)" }}>
          <span style={{ color: "var(--gold)" }}>◈</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--muted)" }}>Check-in</p>
            <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}
              className="text-sm bg-transparent border-none outline-none cursor-pointer" />
          </div>
        </div>

        <div className="hidden md:block w-px self-stretch my-1" style={{ background: "var(--border)" }} />

        {/* Check-out */}
        <div className="flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: "var(--surface2)" }}>
          <span style={{ color: "var(--gold)" }}>◈</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--muted)" }}>Check-out</p>
            <input type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)}
              className="text-sm bg-transparent border-none outline-none cursor-pointer" />
          </div>
        </div>

        <div className="hidden md:block w-px self-stretch my-1" style={{ background: "var(--border)" }} />

        {/* Guests */}
        <div className="flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ background: "var(--surface2)" }}>
          <span style={{ color: "var(--gold)" }}>◎</span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--muted)" }}>Số khách</p>
            <select value={guests} onChange={e => setGuests(e.target.value)}
              className="text-sm bg-transparent border-none outline-none cursor-pointer">
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} khách</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSearch} className="btn-gold rounded-xl px-8 py-3 text-sm font-bold tracking-wide">
          🔍 Tìm kiếm
        </button>
      </div>
    </div>
  );
}
