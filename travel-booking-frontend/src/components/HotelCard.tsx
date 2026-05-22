"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface HotelCardProps {
  hotel: {
    id: string;
    image: string;
    name: string;
    location: string;
    price: number;
  };
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/hotel/${hotel.id}`)}
      className="cursor-pointer rounded-3xl bg-white p-5 shadow-lg transition hover:scale-105"
    >
      <div className="relative h-56 w-full overflow-hidden rounded-2xl">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className="object-cover"
        />
      </div>

      <h2 className="mt-4 text-2xl font-bold">
        {hotel.name}
      </h2>

      <p className="mt-2 text-gray-600">
        {hotel.location}
      </p>

      <p className="mt-3 text-2xl font-bold text-blue-600">
        ${hotel.price}
      </p>
    </div>
  );
}