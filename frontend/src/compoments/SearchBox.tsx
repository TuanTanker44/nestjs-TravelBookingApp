"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = () => {
    const params = new URLSearchParams({
      keyword,
      checkIn,
      checkOut,
      guests,
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-2xl md:flex-row md:items-center">
      {/* Destination */}
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
        <span className="text-xl">🔍</span>
        <input
          type="text"
          placeholder="Điểm đến, tên khách sạn..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      {/* Check-in */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
        <span>📅</span>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400">Check-in</p>
          <input
            type="date"
            className="bg-transparent text-sm outline-none"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
      </div>

      {/* Check-out */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
        <span>📅</span>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400">Check-out</p>
          <input
            type="date"
            className="bg-transparent text-sm outline-none"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-blue-500 transition">
        <span>👥</span>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400">Khách</p>
          <select
            className="bg-transparent text-sm outline-none"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} khách
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSearch}
        className="rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white hover:bg-blue-700 active:scale-95 transition"
      >
        Tìm kiếm
      </button>
    </div>
  );
}
