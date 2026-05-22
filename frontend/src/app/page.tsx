import Navbar from "@/components/Navbar";
import SearchBox from "@/components/SearchBox";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <section
        className="flex h-screen flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        }}
      >
        <div className="rounded-3xl bg-black/40 p-10 text-center backdrop-blur-sm">
          <h1 className="mb-6 text-6xl font-bold text-white">
            Discover Your Next Adventure
          </h1>

          <p className="mb-10 text-xl text-gray-200">
            Book hotels and tours easily.
          </p>

          <SearchBox />
        </div>
      </section>
    </div>
  );
}