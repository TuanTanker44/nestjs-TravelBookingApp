"use client";
import { hotelApi } from "@/services/api";
import Navbar from "@/components/Navbar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const MOCK_HOTELS: Record<string, { name: string; city: string; price: number; rating: number; reviews: number; desc: string; img: string }> = {
  "vn-1": { name: "InterContinental Đà Nẵng Sun Peninsula", city: "Sơn Trà, Đà Nẵng", price: 280, rating: 4.9, reviews: 1240, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80", desc: "Nằm cheo leo trên vách núi Sơn Trà, nhìn ra vịnh Đà Nẵng xanh ngắt, InterContinental Sun Peninsula được tạp chí Travel + Leisure bình chọn là một trong những resort đẹp nhất châu Á. Thiết kế lấy cảm hứng từ kiến trúc Đông Dương thập niên 1930, hòa quyện cùng thiên nhiên hoang sơ." },
  "vn-2": { name: "Vinpearl Resort & Spa Nha Trang", city: "Hòn Tre, Nha Trang", price: 195, rating: 4.8, reviews: 2310, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80", desc: "Tọa lạc trên hòn đảo riêng biệt với bãi biển cát trắng mịn, Vinpearl Nha Trang là thiên đường nghỉ dưỡng all-inclusive hàng đầu Việt Nam. Khu vui chơi, bể bơi vô cực, nhà hàng hải sản cao cấp — tất cả trong một resort." },
  "vn-3": { name: "Sofitel Legend Metropole Hà Nội", city: "Hoàn Kiếm, Hà Nội", price: 320, rating: 4.9, reviews: 987, img: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&q=80", desc: "Biểu tượng lịch sử của Hà Nội từ năm 1901, Sofitel Legend Metropole là khách sạn sang trọng nhất thủ đô. Nơi từng đón tiếp Charlie Chaplin, Graham Greene và nhiều nhân vật nổi tiếng thế giới. Mỗi góc của khách sạn là một trang sử sống động." },
  "vn-4": { name: "Park Hyatt Sài Gòn", city: "Quận 1, TP. Hồ Chí Minh", price: 260, rating: 4.8, reviews: 1654, img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=80", desc: "Đỉnh cao của sự sang trọng giữa trung tâm Sài Gòn sôi động. Park Hyatt mang đến trải nghiệm lưu trú 5 sao đích thực với phong cách kiến trúc thuộc địa Pháp, nhà hàng Square One nổi tiếng và bể bơi ngoài trời trên sân thượng." },
  "vn-5": { name: "Anantara Hội An Resort", city: "Hội An, Quảng Nam", price: 175, rating: 4.7, reviews: 856, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80", desc: "Nằm bên dòng sông Thu Bồn thơ mộng, Anantara Hội An là resort boutique độc đáo với kiến trúc nhà cổ Hội An được phục dựng hoàn hảo. Lớp học nấu ăn, spa truyền thống và tour đạp xe làng quê tạo nên những trải nghiệm không thể quên." },
  "vn-6": { name: "Six Senses Côn Đảo", city: "Côn Đảo, Bà Rịa-Vũng Tàu", price: 450, rating: 5.0, reviews: 432, img: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1600&q=80", desc: "Ẩn mình trong rừng nhiệt đới nguyên sinh của Côn Đảo, Six Senses là nơi thiên nhiên và xa xỉ hòa quyện tuyệt vời nhất. 50 villa riêng biệt, spa đẳng cấp quốc tế và bãi biển hoang sơ hoàn toàn riêng tư." },
};

const AMENITIES = ["🏊 Hồ bơi vô cực", "🍽️ Nhà hàng 5★", "🏖️ Bãi biển riêng", "🧖 Spa cao cấp", "📶 WiFi miễn phí", "🏋️ Phòng gym", "🚐 Đưa đón sân bay", "☀️ Ban công view biển"];

const ROOMS = [
  { id: "r1", name: "Phòng Deluxe", type: "DELUXE", extra: 0, cap: 2, desc: "View vườn · 40m² · Bồn tắm" },
  { id: "r2", name: "Phòng Ocean View", type: "SUPERIOR", extra: 50, cap: 2, desc: "View biển · 45m² · Ban công riêng" },
  { id: "r3", name: "Suite Premium", type: "SUITE", extra: 150, cap: 4, desc: "70m² · 2 phòng ngủ · Jacuzzi" },
];

function HotelDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [hotel, setHotel] = useState<typeof MOCK_HOTELS[string] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState("r1");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    hotelApi.get(`/hotel/${id}`)
      .then(res => {
        const d = res.data;
        // Normalize API response → local shape
        setHotel({
          name: d.name ?? "",
          city: d.city ?? d.address ?? "",
          price: d.price_min ?? d.price ?? 0,
          rating: d.rating_avg ?? d.rating ?? 0,
          reviews: d.rating_count ?? d.reviews ?? 0,
          img: d.image ?? d.img ?? "",
          desc: d.description ?? d.desc ?? "",
        });
      })
      .catch(() => setHotel(MOCK_HOTELS[id] ?? MOCK_HOTELS["vn-1"]))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="text-center">
        <div className="h-12 w-12 mx-auto animate-spin rounded-full border-2 border-t-transparent mb-4" style={{ borderColor: "var(--gold)" }} />
        <p className="text-sm" style={{ color: "var(--muted)" }}>Đang tải thông tin khách sạn...</p>
      </div>
    </div>
  );

  if (!hotel) return null;

  const basePrice = hotel.price || 280;
  const roomExtra = ROOMS.find(r => r.id === selectedRoom)?.extra ?? 0;
  const totalPrice = basePrice + roomExtra;

  // Gallery images (use hotel img + fallbacks)
  const galleryImgs = [
    hotel.img || "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* Hero image + gallery */}
      <div className="relative h-[65vh] overflow-hidden">
        <img src={galleryImgs[activeImg]} alt={hotel.name}
          className="h-full w-full object-cover transition-all duration-500" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,15,0.9) 0%, rgba(10,10,15,0.15) 60%)" }} />

        {/* Back */}
        <button onClick={() => router.back()}
          className="absolute left-6 top-24 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:opacity-90"
          style={{ background: "rgba(10,10,15,0.7)", color: "var(--text)", border: "1px solid var(--border)", backdropFilter: "blur(12px)" }}>
          ← Quay lại
        </button>

        {/* Gallery thumbs */}
        <div className="absolute right-6 bottom-24 flex flex-col gap-2">
          {galleryImgs.slice(1).map((img, i) => (
            <button key={i} onClick={() => setActiveImg(i + 1)}
              className="h-14 w-20 overflow-hidden rounded-lg transition-all"
              style={{ border: activeImg === i + 1 ? "2px solid var(--gold)" : "2px solid transparent", opacity: activeImg === i + 1 ? 1 : 0.6 }}>
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          <button onClick={() => setActiveImg(0)}
            className="h-14 w-20 overflow-hidden rounded-lg transition-all"
            style={{ border: activeImg === 0 ? "2px solid var(--gold)" : "2px solid transparent", opacity: activeImg === 0 ? 1 : 0.6 }}>
            <img src={galleryImgs[0]} alt="" className="h-full w-full object-cover" />
          </button>
        </div>

        {/* Hotel info overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-3 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold"
                style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.35)" }}>
                ★ {hotel.rating.toFixed(1)}
              </span>
              {hotel.reviews > 0 && (
                <span className="text-sm" style={{ color: "rgba(240,237,232,0.65)" }}>{hotel.reviews.toLocaleString()} đánh giá</span>
              )}
            </div>
            <h1 className="font-display font-bold" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--text)", lineHeight: 1.1 }}>
              {hotel.name}
            </h1>
            {hotel.city && <p className="mt-2 text-base" style={{ color: "rgba(240,237,232,0.6)" }}>📍 {hotel.city}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">

          {/* Left column */}
          <div className="space-y-6 md:col-span-2">

            {/* About */}
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-display mb-4 text-2xl font-bold" style={{ color: "var(--text)" }}>Về khách sạn</h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(240,237,232,0.72)" }}>
                {hotel.desc || "Khách sạn sang trọng với nhiều tiện nghi đẳng cấp quốc tế, mang đến trải nghiệm lưu trú hoàn hảo."}
              </p>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-display mb-5 text-2xl font-bold" style={{ color: "var(--text)" }}>Tiện ích nổi bật</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {AMENITIES.map(a => (
                  <div key={a} className="flex flex-col items-center gap-1.5 rounded-xl px-3 py-4 text-center transition"
                    style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                    <span className="text-2xl">{a.split(" ")[0]}</span>
                    <span className="text-xs font-medium leading-tight" style={{ color: "var(--muted)" }}>
                      {a.split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room selection */}
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-display mb-5 text-2xl font-bold" style={{ color: "var(--text)" }}>Chọn loại phòng</h2>
              <div className="space-y-3">
                {ROOMS.map(room => {
                  const isSelected = selectedRoom === room.id;
                  return (
                    <div key={room.id} onClick={() => setSelectedRoom(room.id)}
                      className="flex cursor-pointer items-center justify-between rounded-xl p-5 transition-all"
                      style={{
                        background: isSelected ? "rgba(201,168,76,0.06)" : "var(--surface2)",
                        border: isSelected ? "1.5px solid rgba(201,168,76,0.45)" : "1px solid var(--border)",
                      }}>
                      <div className="flex items-center gap-4">
                        {/* Radio dot */}
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{ border: isSelected ? "2px solid var(--gold)" : "2px solid var(--muted)" }}>
                          {isSelected && <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--gold)" }} />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{room.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{room.desc}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-bold text-gold">${basePrice + room.extra}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>/ đêm</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — sticky booking card */}
          <div>
            <div className="sticky top-24 rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>Giá từ</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-5xl font-bold text-gold">${totalPrice}</span>
                <span className="text-sm" style={{ color: "var(--muted)" }}>/đêm</span>
              </div>

              {/* Selected room badge */}
              <div className="mb-5 rounded-xl px-4 py-2.5 text-xs font-medium"
                style={{ background: "rgba(201,168,76,0.08)", color: "var(--gold2)", border: "1px solid rgba(201,168,76,0.2)" }}>
                ✦ {ROOMS.find(r => r.id === selectedRoom)?.name}
              </div>

              <button
                onClick={() => router.push(`/booking?hotelId=${id}&roomId=${selectedRoom}&roomType=${ROOMS.find(r => r.id === selectedRoom)?.type}`)}
                className="btn-gold w-full rounded-xl py-4 text-sm font-bold mb-4">
                Đặt phòng ngay →
              </button>

              <div className="space-y-2.5 text-xs" style={{ color: "var(--muted)" }}>
                <p className="flex items-center gap-2"><span style={{ color: "var(--gold)" }}>✦</span> Miễn phí hủy trong 24h</p>
                <p className="flex items-center gap-2"><span style={{ color: "var(--gold)" }}>✦</span> Thanh toán bảo mật SSL 256-bit</p>
                <p className="flex items-center gap-2"><span style={{ color: "var(--gold)" }}>✦</span> Xác nhận đặt phòng tức thì</p>
                <p className="flex items-center gap-2"><span style={{ color: "var(--gold)" }}>✦</span> Hỗ trợ 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--gold)" }} />
      </div>
    }>
      <HotelDetail />
    </Suspense>
  );
}
