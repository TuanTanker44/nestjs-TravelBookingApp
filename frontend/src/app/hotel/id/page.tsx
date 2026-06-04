"use client";

import Navbar from "@/compoments/Navbar";
import api from "@/services/api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Hotel {
  id: string;
  name: string;
  city?: string;
  country?: string;
  address?: string;
  description?: string;
  price_min?: number;
  price_max?: number;
  rating_avg?: number;
  rating_count?: number;
}

interface Room {
  id: string;
  name?: string;
  type: string;
  price: number;
  capacity: number;
  status: string;
  description?: string;
}

const MOCK_AMENITIES = ["🏊 Hồ bơi vô cực", "🍽️ Nhà hàng 5 sao", "🅿️ Bãi đỗ xe miễn phí", "📶 WiFi tốc độ cao", "🏋️ Phòng gym", "🧖 Spa & Sauna", "🚐 Đưa đón sân bay", "☀️ Ban công riêng"];

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80",
];

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // GET http://localhost:5000/api/hotel/:id
    api
      .get(`/hotel/${id}`)
      .then((res) => setHotel(res.data))
      .catch(() => {
        setHotel({
          id,
          name: "Luxury Resort & Spa",
          city: "Bali",
          country: "Indonesia",
          description: "Resort sang trọng bậc nhất với tầm nhìn hướng biển tuyệt đẹp, hồ bơi vô cực, nhà hàng đạt chuẩn 5 sao và dịch vụ spa cao cấp. Được thiết kế theo phong cách Bali truyền thống kết hợp tiện nghi hiện đại, mỗi phòng đều là một trải nghiệm đặc biệt.",
          price_min: 299,
          price_max: 599,
          rating_avg: 4.8,
          rating_count: 342,
        });
      });

    // GET rooms của hotel (hotel-service có /room endpoint)
    api
      .get(`/hotel/${id}/rooms`)
      .then((res) => setRooms(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setRooms([
          { id: `${id}-r1`, type: "STANDARD", name: "Phòng Standard", price: 299, capacity: 2, status: "available", description: "Phòng tiêu chuẩn view vườn, 35m²" },
          { id: `${id}-r2`, type: "DELUXE",   name: "Phòng Deluxe",   price: 399, capacity: 2, status: "available", description: "Phòng Deluxe view biển, 45m², bồn tắm jacuzzi" },
          { id: `${id}-r3`, type: "SUITE",    name: "Suite phòng đôi", price: 599, capacity: 4, status: "available", description: "Suite sang trọng, 70m², 2 phòng ngủ, ban công riêng" },
        ]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!selectedRoom) {
      const params = new URLSearchParams({ hotelId: id });
      router.push(`/booking?${params}`);
    } else {
      const params = new URLSearchParams({ hotelId: id, roomId: selectedRoom });
      router.push(`/booking?${params}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-gray-600">Không tìm thấy khách sạn</p>
        <button onClick={() => router.push("/search?keyword=")} className="rounded-xl bg-blue-600 px-6 py-3 text-white">
          Quay lại tìm kiếm
        </button>
      </div>
    );
  }

  const imgSrc = FALLBACK_IMGS[parseInt(id.slice(-1), 16) % FALLBACK_IMGS.length];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image src={imgSrc} alt={hotel.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-24 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold shadow-lg backdrop-blur-sm hover:bg-white transition"
        >
          ← Quay lại
        </button>

        {/* Hotel name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="mx-auto max-w-6xl">
            {hotel.rating_avg ? (
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-black text-yellow-900">
                  ★ {hotel.rating_avg.toFixed(1)}
                </span>
                {hotel.rating_count && (
                  <span className="text-sm text-gray-300">{hotel.rating_count} đánh giá</span>
                )}
              </div>
            ) : null}
            <h1 className="text-4xl font-black text-white md:text-6xl">{hotel.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-lg text-gray-300">
              📍 {[hotel.city, hotel.country].filter(Boolean).join(", ")}
              {hotel.address ? ` · ${hotel.address}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-black">Về khách sạn</h2>
              <p className="leading-relaxed text-gray-600">
                {hotel.description ?? "Khách sạn cao cấp với đầy đủ tiện nghi, phục vụ 24/7."}
              </p>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-black">Tiện ích</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {MOCK_AMENITIES.map((a) => (
                  <div key={a} className="rounded-xl bg-blue-50 px-3 py-2 text-center text-sm font-medium text-blue-800">
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            {rooms.length > 0 && (
              <div className="rounded-2xl bg-white p-8 shadow-md">
                <h2 className="mb-4 text-2xl font-black">Chọn loại phòng</h2>
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => room.status === "available" && setSelectedRoom(room.id === selectedRoom ? null : room.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition ${
                        selectedRoom === room.id
                          ? "border-blue-500 bg-blue-50"
                          : room.status !== "available"
                          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-gray-100 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{room.name ?? room.type}</p>
                          {room.status !== "available" && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">Hết phòng</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{room.description ?? `Sức chứa: ${room.capacity} người`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-blue-600">${room.price}</p>
                        <p className="text-xs text-gray-400">/ đêm</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Sticky booking card */}
          <div className="md:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
              <div className="mb-4">
                <p className="text-sm text-gray-500">Giá từ</p>
                <p className="text-4xl font-black text-blue-600">
                  ${selectedRoom
                    ? rooms.find((r) => r.id === selectedRoom)?.price ?? hotel.price_min ?? 0
                    : hotel.price_min ?? 0}
                </p>
                <p className="text-sm text-gray-400">/ đêm</p>
              </div>

              {selectedRoom && (
                <div className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 font-medium">
                  ✅ Đã chọn: {rooms.find((r) => r.id === selectedRoom)?.name ?? "Phòng"}
                </div>
              )}

              <button
                onClick={handleBook}
                className="w-full rounded-xl bg-blue-600 py-4 text-base font-black text-white hover:bg-blue-700 active:scale-95 transition"
              >
                Đặt phòng ngay →
              </button>

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2">✅ Miễn phí hủy trong 24h</p>
                <p className="flex items-center gap-2">💳 Thanh toán an toàn SSL</p>
                <p className="flex items-center gap-2">🔔 Xác nhận ngay lập tức</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
