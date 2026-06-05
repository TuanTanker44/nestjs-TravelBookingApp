import Navbar from "@/compoments/Navbar";
import SearchBox from "@/compoments/SearchBox";
import Link from "next/link";

const FEATURED = [
  { name: "Bali", country: "Indonesia", emoji: "🌴", keyword: "bali" },
  { name: "Paris", country: "Pháp",     emoji: "🗼", keyword: "paris" },
  { name: "Tokyo", country: "Nhật Bản", emoji: "🏯", keyword: "tokyo" },
  { name: "Đà Nẵng", country: "Việt Nam", emoji: "🏖️", keyword: "danang" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 w-full max-w-5xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
            Khám phá thế giới cùng TravelBook
          </p>
          <h1 className="mb-6 text-5xl font-black leading-tight text-white md:text-7xl">
            Hành trình của bạn
            <br />
            <span className="text-blue-400">bắt đầu từ đây</span>
          </h1>
          <p className="mb-12 text-lg text-gray-300">
            Đặt khách sạn tốt nhất tại hàng ngàn điểm đến trên toàn cầu
          </p>
          <SearchBox />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60 text-sm">
          ↓ Khám phá thêm
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-center text-4xl font-black text-gray-900">
            Điểm đến nổi bật
          </h2>
          <p className="mb-12 text-center text-gray-500">
            Những địa điểm được yêu thích nhất
          </p>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {FEATURED.map((dest) => (
              <Link
                key={dest.name}
                href={`/search?keyword=${dest.keyword}`}
                className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 to-indigo-100 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-5xl mb-3">{dest.emoji}</div>
                <h3 className="text-xl font-black text-gray-900">{dest.name}</h3>
                <p className="text-sm text-gray-500">{dest.country}</p>
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-black text-gray-900">
            Tại sao chọn TravelBook?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: "💰", title: "Giá tốt nhất", desc: "Cam kết giá thấp nhất, hoàn tiền nếu tìm được giá rẻ hơn" },
              { icon: "⚡", title: "Đặt phòng nhanh", desc: "Chỉ cần 3 bước, xác nhận ngay lập tức trong vài giây" },
              { icon: "🛡️", title: "Thanh toán an toàn", desc: "Bảo mật SSL 256-bit, hỗ trợ nhiều phương thức thanh toán" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-8 shadow-md text-center">
                <div className="mb-4 text-5xl">{item.icon}</div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 px-6 text-center text-white">
        <h2 className="mb-4 text-4xl font-black">Sẵn sàng khám phá?</h2>
        <p className="mb-8 text-blue-100">Hàng nghìn khách sạn đang chờ bạn</p>
        <Link
          href="/search?keyword="
          className="inline-block rounded-2xl bg-white px-10 py-4 text-lg font-black text-blue-600 hover:bg-blue-50 transition"
        >
          Tìm khách sạn ngay →
        </Link>
      </section>
    </div>
  );
}
