"use client";

import { useRouter } from "next/navigation";

interface Hotel {
  id: string;
  name: string;
  city?: string;
  country?: string;
  address?: string;
  price_min?: number;
  price_max?: number;
  rating_avg?: number;
  rating_count?: number;
  image?: string;
  location?: string;
  price?: number;
}

const ratingColor = (r: number) =>
  r >= 4.5 ? "text-emerald-600" : r >= 4 ? "text-blue-600" : "text-yellow-600";

const placeholderImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
  "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
];

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const router = useRouter();

  const location = hotel.city
    ? `${hotel.city}${hotel.country ? ", " + hotel.country : ""}`
    : hotel.location ?? hotel.address ?? "Không rõ địa điểm";

  const priceDisplay = hotel.price_min
    ? hotel.price_min === hotel.price_max || !hotel.price_max
      ? `$${hotel.price_min}`
      : `$${hotel.price_min} – $${hotel.price_max}`
    : hotel.price
    ? `$${hotel.price}`
    : "Liên hệ";

  const rating = hotel.rating_avg ?? 0;

  // Dùng <img> thường — không cần cấu hình next.config
  const imgSrc =
    hotel.image ??
    placeholderImages[parseInt(hotel.id.slice(-1), 16) % placeholderImages.length];

  return (
    <div
      onClick={() => router.push(`/hotel/${hotel.id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image — dùng <img> thường, không dùng next/image */}
      <div className="relative h-52 overflow-hidden bg-gray-200">
        <img
          src={imgSrc}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderImages[0];
          }}
        />
        {rating > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold shadow backdrop-blur-sm">
            <span className="text-yellow-500">★</span>
            <span className={ratingColor(rating)}>{rating.toFixed(1)}</span>
            {hotel.rating_count ? (
              <span className="text-gray-400">({hotel.rating_count})</span>
            ) : null}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{hotel.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <span>📍</span>
          <span className="line-clamp-1">{location}</span>
        </p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-2xl font-black text-blue-600">{priceDisplay}</span>
            <span className="ml-1 text-xs text-gray-400">/ đêm</span>
          </div>
          <button className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            Xem →
          </button>
        </div>
      </div>
    </div>
  );
}
