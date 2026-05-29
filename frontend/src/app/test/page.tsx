"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface Hotel {
  id: string | number;
  name: string;
  location: string;
}

export default function TestPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/hotels")
      .then((res) => {
        setHotels(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch hotels", err);
        setHotels([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="mb-5 text-4xl font-bold">
        Hotel List
      </h1>

      {isLoading ? (
        <p>Đang tải danh sách khách sạn...</p>
      ) : hotels.length === 0 ? (
        <p>Không có khách sạn nào.</p>
      ) : (
        hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="mb-4 rounded-xl border p-5"
          >
            <h2 className="text-2xl font-bold">
              {hotel.name}
            </h2>

            <p>{hotel.location}</p>
          </div>
        ))
      )}
    </div>
  );
}