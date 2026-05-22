"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import HotelCard from "@/components/HotelCard";

interface Hotel {
  id: string;
  image: string;
  name: string;
  location: string;
  price: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();

  const location = searchParams?.get("location") ?? "";

  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    api
      .get(`/search?location=${location}`)
      .then((res) => {
        setHotels(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="mb-10 text-4xl font-bold">
        Search Results
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}