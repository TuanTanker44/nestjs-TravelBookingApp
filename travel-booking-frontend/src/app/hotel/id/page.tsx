"use client";

import { useParams, useRouter } from "next/navigation";

const hotels = [
  {
    id: 1,
    name: "Luxury Resort",
    location: "Bali",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    description:
      "Luxury resort with ocean view and premium services.",
  },

  {
    id: 2,
    name: "Ocean Hotel",
    location: "Paris",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    description:
      "Beautiful hotel in the center of Paris.",
  },
];

export default function HotelDetailPage() {
  const params = useParams();

  const router = useRouter();

  const hotel = hotels.find(
    (item) => item.id === Number(params.id)
  );

  if (!hotel) {
    return <div>Hotel not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <img
        src={hotel.image}
        className="h-[500px] w-full rounded-3xl object-cover"
      />

      <div className="mt-10 rounded-3xl bg-white p-10">
        <h1 className="text-5xl font-bold">
          {hotel.name}
        </h1>

        <p className="mt-4 text-xl text-gray-600">
          {hotel.location}
        </p>

        <p className="mt-6 text-gray-700">
          {hotel.description}
        </p>

        <p className="mt-6 text-4xl font-bold text-blue-600">
          ${hotel.price}
        </p>

        <button
          onClick={() => router.push(`/booking?hotelId=${hotel.id}`)}
          className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-white"
        >
          Continue Booking
        </button>
      </div>
    </div>
  );
}