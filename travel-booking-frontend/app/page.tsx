export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-blue-600 px-8 py-4 text-white">
        <h1 className="text-2xl font-bold">
          Travel Booking
        </h1>

        <div className="flex gap-6">
          <a href="#">Home</a>
          <a href="#">Hotels</a>
          <a href="#">Tours</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="mb-4 text-5xl font-bold text-gray-800">
          Discover Your Next Adventure
        </h2>

        <p className="mb-8 text-lg text-gray-600">
          Find hotels, tours and travel experiences easily.
        </p>

        <button className="rounded-xl bg-blue-600 px-8 py-4 text-white transition hover:bg-blue-700">
          Explore Now
        </button>
      </section>

      {/* Popular Destinations */}
      <section className="px-10 pb-20">
        <h3 className="mb-8 text-3xl font-bold text-gray-800">
          Popular Destinations
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h4 className="text-2xl font-semibold">
              Paris
            </h4>

            <p className="mt-2 text-gray-600">
              Romantic city in France
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h4 className="text-2xl font-semibold">
              Tokyo
            </h4>

            <p className="mt-2 text-gray-600">
              Modern culture and technology
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h4 className="text-2xl font-semibold">
              Bali
            </h4>

            <p className="mt-2 text-gray-600">
              Tropical paradise destination
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}