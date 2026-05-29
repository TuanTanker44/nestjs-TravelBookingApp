"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const handleSearch = () => {
    router.push(
      `/search?location=${location}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  return (
    <div className="grid gap-4 rounded-3xl bg-white p-6 shadow-2xl md:grid-cols-5">
      <input
        type="text"
        placeholder="Destination"
        className="rounded-xl border p-3"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="date"
        className="rounded-xl border p-3"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
      />

      <input
        type="date"
        className="rounded-xl border p-3"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
      />

      <select
        className="rounded-xl border p-3"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
      >
        <option value="1">1 Guest</option>
        <option value="2">2 Guests</option>
        <option value="3">3 Guests</option>
      </select>

      <button
        onClick={handleSearch}
        className="rounded-xl bg-blue-600 text-white"
      >
        Search
      </button>
    </div>
  );
}