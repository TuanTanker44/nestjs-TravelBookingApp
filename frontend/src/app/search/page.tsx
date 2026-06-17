"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { hotelApi } from "@/services/api";
import HotelCard from "@/components/HotelCard";
import Navbar from "@/components/Navbar";
import SearchBox from "@/components/SearchBox";

interface Hotel {
  id: string; name: string; city?: string; country?: string;
  price_min?: number; rating_avg?: number; rating_count?: number;
  image?: string; tag?: string;
}

const MOCK: Hotel[] = [
  { id: "vn-1", name: "InterContinental Đà Nẵng", city: "Đà Nẵng", country: "Việt Nam", price_min: 280, rating_avg: 4.9, rating_count: 1240, tag: "Sang trọng", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" },
  { id: "vn-2", name: "Vinpearl Resort Nha Trang", city: "Nha Trang", country: "Việt Nam", price_min: 195, rating_avg: 4.8, rating_count: 2310, tag: "Được yêu thích", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80" },
  { id: "vn-3", name: "Sofitel Legend Metropole", city: "Hà Nội", country: "Việt Nam", price_min: 320, rating_avg: 4.9, rating_count: 987, tag: "5 Sao", image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80" },
  { id: "vn-4", name: "Park Hyatt Sài Gòn", city: "TP. Hồ Chí Minh", country: "Việt Nam", price_min: 260, rating_avg: 4.8, rating_count: 1654, tag: "Cao cấp", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80" },
  { id: "vn-5", name: "Anantara Hội An Resort", city: "Hội An", country: "Việt Nam", price_min: 175, rating_avg: 4.7, rating_count: 856, tag: "Boutique", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80" },
  { id: "vn-6", name: "Six Senses Côn Đảo", city: "Côn Đảo", country: "Việt Nam", price_min: 450, rating_avg: 5.0, rating_count: 432, tag: "Đỉnh cao", image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80" },
  { id: "vn-7", name: "Amanoi Resort Ninh Thuận", city: "Ninh Thuận", country: "Việt Nam", price_min: 550, rating_avg: 5.0, rating_count: 289, tag: "Ultra Luxury", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" },
  { id: "vn-8", name: "Nam Nghi Phú Quốc", city: "Phú Quốc", country: "Việt Nam", price_min: 220, rating_avg: 4.8, rating_count: 765, tag: "Resort", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?w=800&q=80" },
  { id: "vn-9", name: "La Siesta Premium Hà Nội", city: "Hà Nội", country: "Việt Nam", price_min: 120, rating_avg: 4.7, rating_count: 1120, tag: "Boutique", image: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800&q=80" },
];

function filterMock(keyword: string): Hotel[] {
  if (!keyword) return MOCK;
  const k = keyword.toLowerCase();
  const filtered = MOCK.filter(h =>
    h.name.toLowerCase().includes(k) || h.city?.toLowerCase().includes(k) || h.country?.toLowerCase().includes(k)
  );
  return filtered.length ? filtered : MOCK;
}

function SearchContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const keyword = sp.get("keyword") ?? "";
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("rating-DESC");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setApiError(false);
    hotelApi.get("/hotel/search", { params: { keyword: keyword || undefined, page: 1, limit: 20 } })
      .then(res => {
        const d = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
        setHotels(d.length ? d : filterMock(keyword));
        if (!d.length) setApiError(true);
      })
      .catch(() => { setHotels(filterMock(keyword)); setApiError(true); })
      .finally(() => setLoading(false));
  }, [keyword]);

  const sorted = [...hotels]
    .filter(h => (h.price_min ?? 0) <= maxPrice)
    .sort((a, b) =>
      sort === "price-ASC" ? (a.price_min ?? 0) - (b.price_min ?? 0) :
      sort === "price-DESC" ? (b.price_min ?? 0) - (a.price_min ?? 0) :
      (b.rating_avg ?? 0) - (a.rating_avg ?? 0)
    );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-28 pb-12" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gold">Kết quả tìm kiếm</p>
          <h1 className="font-display text-4xl font-bold" style={{ color: "var(--text)" }}>
            {keyword ? `"${keyword}"` : "Tất cả khách sạn"}
          </h1>
          {!loading && (
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Tìm thấy <span className="text-gold font-bold">{sorted.length}</span> khách sạn
              {apiError && <span className="ml-2 text-xs opacity-60">(dữ liệu mẫu — backend chưa kết nối)</span>}
            </p>
          )}
          {/* Inline search box */}
          <div className="mt-6 max-w-2xl">
            <SearchBox compact />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar filter */}
          <aside className="hidden w-60 shrink-0 md:block">
            <div className="sticky top-24 rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gold">Bộ lọc</h3>

              {/* Price range */}
              <div className="mb-6">
                <label className="mb-2 block text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Giá tối đa: <span className="text-gold font-bold">${maxPrice}</span>
                </label>
                <input type="range" min={50} max={1000} step={50} value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-yellow-500" />
                <div className="mt-1 flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                  <span>$50</span><span>$1000</span>
                </div>
              </div>

              {/* Sort mobile */}
              <div>
                <label className="mb-2 block text-xs font-semibold" style={{ color: "var(--muted)" }}>Sắp xếp theo</label>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-xs">
                  <option value="rating-DESC">⭐ Đánh giá cao nhất</option>
                  <option value="price-ASC">💰 Giá thấp → cao</option>
                  <option value="price-DESC">💎 Giá cao → thấp</option>
                </select>
              </div>

              <button onClick={() => { setMaxPrice(1000); setSort("rating-DESC"); }}
                className="mt-5 w-full rounded-xl py-2 text-xs font-semibold transition hover:border-gold"
                style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                Xóa bộ lọc
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Sort bar (desktop top) */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {!loading && <>{sorted.length} khách sạn</>}
              </p>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="rounded-xl px-4 py-2 text-sm hidden md:block">
                <option value="rating-DESC">⭐ Đánh giá cao nhất</option>
                <option value="price-ASC">💰 Giá thấp → cao</option>
                <option value="price-DESC">💎 Giá cao → thấp</option>
              </select>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-72 animate-pulse rounded-2xl" style={{ background: "var(--surface)" }} />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="font-display text-2xl font-bold" style={{ color: "var(--text)" }}>Không tìm thấy kết quả</h2>
                <p className="mt-2 mb-6 text-sm" style={{ color: "var(--muted)" }}>Thử từ khóa khác hoặc điều chỉnh bộ lọc</p>
                <button onClick={() => router.push("/search?keyword=")} className="btn-gold rounded-xl px-6 py-3 text-sm font-bold">
                  Xem tất cả khách sạn
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map(h => <HotelCard key={h.id} hotel={h} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--gold)" }} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
