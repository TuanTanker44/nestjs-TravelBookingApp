"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import HotelCard from "@/compoments/HotelCard";
import Navbar from "@/compoments/Navbar";

interface Hotel {
  id: string;
  image: string;
  name: string;
  location: string;
  price: number;
}

// Dữ liệu mẫu khi API chưa sẵn sàng
const MOCK_HOTELS: Hotel[] = [
  {
    id: "1",
    name: "Luxury Resort Bali",
    location: "Bali, Indonesia",
    price: 299,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  },
  {
    id: "2",
    name: "Paris Grand Hotel",
    location: "Paris, France",
    price: 199,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
  },
  {
    id: "3",
    name: "Tokyo Skyline Hotel",
    location: "Tokyo, Japan",
    price: 249,
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800",
  },
  {
    id: "4",
    name: "New York Downtown",
    location: "New York, USA",
    price: 349,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
  },
  {
    id: "5",
    name: "Singapore Marina View",
    location: "Singapore",
    price: 279,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
  },
  {
    id: "6",
    name: "Đà Nẵng Beach Resort",
    location: "Đà Nẵng, Việt Nam",
    price: 89,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const location = searchParams?.get("location") ?? "";
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api
      .get(`/search?location=${location}`)
      .then((res) => {
        setHotels(res.data);
      })
      .catch(() => {
        // Dùng dữ liệu mẫu nếu API lỗi
        const filtered = location
          ? MOCK_HOTELS.filter((h) =>
              h.location.toLowerCase().includes(location.toLowerCase()) ||
              h.name.toLowerCase().includes(location.toLowerCase())
            )
          : MOCK_HOTELS;
        setHotels(filtered.length > 0 ? filtered : MOCK_HOTELS);
      })
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-10 pt-28">
        <div className="mb-4 text-sm text-gray-500">
          {location ? `Kết quả cho "${location}"` : "Tất cả khách sạn"}
        </div>
        <h1 className="mb-10 text-4xl font-bold">
          Kết quả tìm kiếm{" "}
          {!loading && (
            <span className="text-2xl font-normal text-gray-400">
              ({hotels.length} khách sạn)
            </span>
          )}
        </h1>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-3xl bg-gray-200"
              />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl text-gray-500">
              Không tìm thấy khách sạn nào.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}
