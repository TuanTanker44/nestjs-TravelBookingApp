import SearchBox from "./SearchBox";

export default function Hero() {
  return (
    <section
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
      }}
    >
      <div className="rounded-3xl bg-black/40 p-10 text-center">
        <h1 className="text-6xl font-bold text-white">
          Discover Your Next Adventure
        </h1>

        <p className="mt-6 text-xl text-gray-200">
          Book hotels and tours around the world
        </p>

        <div className="mt-10">
          <SearchBox />
        </div>
      </div>
    </section>
  );
}