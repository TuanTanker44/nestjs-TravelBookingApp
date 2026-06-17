"use client";
import Link from "next/link";

interface Hotel {
  id: string; name: string; city?: string; country?: string;
  price_min?: number; rating_avg?: number; rating_count?: number;
  image?: string; img?: string; tag?: string;
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const img = hotel.image ?? hotel.img ?? "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80";
  const price = hotel.price_min ?? 0;
  const rating = hotel.rating_avg ?? 0;
  const reviews = hotel.rating_count ?? 0;

  return (
    <Link href={`/hotel/${hotel.id}`}
      className="group block overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img src={img} alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,15,0.6) 0%, transparent 60%)" }} />

        {/* Tag */}
        {hotel.tag && (
          <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: "rgba(201,168,76,0.9)", color: "#0a0a0f" }}>
            {hotel.tag}
          </span>
        )}

        {/* Rating */}
        {rating > 0 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ background: "rgba(10,10,15,0.75)", color: "var(--gold)", backdropFilter: "blur(8px)", border: "1px solid rgba(201,168,76,0.25)" }}>
            ★ {rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display mb-1 truncate text-base font-bold transition-colors group-hover:text-gold"
          style={{ color: "var(--text)" }}>
          {hotel.name}
        </h3>

        {(hotel.city || hotel.country) && (
          <p className="mb-3 text-xs" style={{ color: "var(--muted)" }}>
            📍 {[hotel.city, hotel.country].filter(Boolean).join(", ")}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            {price > 0 && (
              <>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Từ</p>
                <p className="font-display text-2xl font-bold text-gold">
                  ${price}
                  <span className="ml-1 text-xs font-normal" style={{ color: "var(--muted)" }}>/đêm</span>
                </p>
              </>
            )}
          </div>
          {reviews > 0 && (
            <p className="text-xs" style={{ color: "var(--muted)" }}>{reviews.toLocaleString()} đánh giá</p>
          )}
        </div>
      </div>
    </Link>
  );
}
