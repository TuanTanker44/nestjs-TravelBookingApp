"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hotelApi } from "@/services/api";
import Navbar from "@/components/Navbar";
import SearchBox from "@/components/SearchBox";
import HotelCard from "@/components/HotelCard";

const FEATURED = [
  { id: "vn-1", name: "InterContinental Đà Nẵng", city: "Đà Nẵng", country: "Việt Nam", price_min: 280, rating_avg: 4.9, rating_count: 1240, tag: "Sang trọng", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" },
  { id: "vn-2", name: "Vinpearl Resort Nha Trang", city: "Nha Trang", country: "Việt Nam", price_min: 195, rating_avg: 4.8, rating_count: 2310, tag: "Được yêu thích", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80" },
  { id: "vn-3", name: "Sofitel Legend Metropole", city: "Hà Nội", country: "Việt Nam", price_min: 320, rating_avg: 4.9, rating_count: 987, tag: "5 Sao", image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80" },
  { id: "vn-4", name: "Park Hyatt Sài Gòn", city: "TP. Hồ Chí Minh", country: "Việt Nam", price_min: 260, rating_avg: 4.8, rating_count: 1654, tag: "Cao cấp", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80" },
  { id: "vn-5", name: "Anantara Hội An Resort", city: "Hội An", country: "Việt Nam", price_min: 175, rating_avg: 4.7, rating_count: 856, tag: "Boutique", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80" },
  { id: "vn-6", name: "Six Senses Côn Đảo", city: "Côn Đảo", country: "Việt Nam", price_min: 450, rating_avg: 5.0, rating_count: 432, tag: "Đỉnh cao", image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80" },
];

const DESTINATIONS = [
  { name: "Đà Nẵng", count: "128 khách sạn", img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80" },
  { name: "Nha Trang", count: "89 khách sạn", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80" },
  { name: "Hội An", count: "64 khách sạn", img: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=600&q=80" },
  { name: "Phú Quốc", count: "102 khách sạn", img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?w=600&q=80" },
];

const STATS = [
  { val: "50K+", label: "Khách hàng hài lòng" },
  { val: "1,200+", label: "Khách sạn đối tác" },
  { val: "4.9★", label: "Điểm đánh giá" },
  { val: "24/7", label: "Hỗ trợ khách hàng" },
];

export default function HomePage() {
  const router = useRouter();
  const [hotels, setHotels] = useState(FEATURED);

  useEffect(() => {
    hotelApi.get("/hotel", { params: { page: 1, limit: 6 } })
      .then(res => {
        const d = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        if (d.length >= 3) setHotels(d);
      })
      .catch(() => { /* keep featured mock */ });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center">
        <img src="https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1800&q=80"
          alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.75) 60%, rgba(10,10,15,1) 100%)" }} />

        <div className="relative z-10 max-w-4xl w-full">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gold">✦ Khám phá · Trải nghiệm · Thư giãn</p>
          <h1 className="font-display mb-6 font-bold" style={{ fontSize: "clamp(2.8rem,8vw,6rem)", color: "var(--text)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Kỳ nghỉ hoàn hảo<br />
            <span className="text-gold italic">bắt đầu từ đây</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg" style={{ color: "rgba(240,237,232,0.65)" }}>
            Khám phá hơn 1,200 khách sạn và resort cao cấp trên toàn Việt Nam — đặt phòng dễ dàng, trải nghiệm tuyệt vời.
          </p>
          <SearchBox />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map(s => (
            <div key={s.val} className="text-center">
              <p className="font-display text-3xl font-bold text-gold">{s.val}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gold">Nổi bật</p>
            <h2 className="font-display text-4xl font-bold" style={{ color: "var(--text)" }}>Khách sạn được yêu thích</h2>
          </div>
          <button onClick={() => router.push("/search")}
            className="hidden md:block rounded-xl px-6 py-3 text-sm font-semibold transition hover:border-gold"
            style={{ border: "1px solid var(--border)", color: "var(--muted)", background: "var(--surface)" }}>
            Xem tất cả →
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
        </div>
        <div className="mt-8 text-center md:hidden">
          <button onClick={() => router.push("/search")} className="btn-gold rounded-xl px-8 py-3.5 text-sm font-bold">
            Xem tất cả khách sạn →
          </button>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="px-6 py-20" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gold">Điểm đến</p>
            <h2 className="font-display text-4xl font-bold" style={{ color: "var(--text)" }}>Điểm đến hot nhất</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map(d => (
              <button key={d.name} onClick={() => router.push(`/search?keyword=${encodeURIComponent(d.name)}`)}
                className="group relative overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl text-left"
                style={{ height: 220 }}>
                <img src={d.img} alt={d.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.1) 60%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-display text-xl font-bold" style={{ color: "var(--text)" }}>{d.name}</p>
                  <p className="text-xs mt-0.5 text-gold">{d.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-gold">Đặt phòng ngay hôm nay</p>
          <h2 className="font-display mb-5 text-5xl font-bold" style={{ color: "var(--text)", lineHeight: 1.1 }}>
            Kỳ nghỉ trong mơ<br />chỉ một cú click
          </h2>
          <p className="mb-8 text-base" style={{ color: "var(--muted)" }}>
            Giá tốt nhất đảm bảo · Miễn phí hủy · Xác nhận tức thì
          </p>
          <button onClick={() => router.push("/search")} className="btn-gold rounded-2xl px-10 py-4 text-base font-bold">
            Tìm khách sạn ngay →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg font-bold text-gold">✦ TravelBook</span>
          <p className="text-xs" style={{ color: "var(--muted)" }}>© 2025 TravelBook. Đặt phòng khách sạn cao cấp toàn Việt Nam.</p>
          <div className="flex gap-6 text-xs" style={{ color: "var(--muted)" }}>
            <span className="hover:text-gold cursor-pointer transition-colors">Điều khoản</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Bảo mật</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Liên hệ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
