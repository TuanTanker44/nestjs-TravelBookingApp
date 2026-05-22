export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-black/30 px-10 py-5 text-white backdrop-blur-md">
      <h1 className="text-3xl font-bold">
        Travel Booking
      </h1>

      <div className="flex gap-8 text-lg">
        <a href="#">Home</a>
        <a href="#">Hotels</a>
        <a href="#">Tours</a>
        <a href="#">Booking</a>
      </div>
    </nav>
  );
}