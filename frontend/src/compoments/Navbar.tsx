"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, isLoggedIn, logout } from "../app/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const check = () => {
      if (isLoggedIn()) {
        setLoggedIn(true);
        const user = getCurrentUser();
        setUserName(user?.name ?? user?.email ?? "");
      } else {
        setLoggedIn(false);
        setUserName("");
      }
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    router.push("/");
  };

  const isHome = pathname === "/";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white/95 shadow-md backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-black tracking-tight transition ${
            scrolled || !isHome ? "text-gray-900" : "text-white"
          }`}
        >
          ✈️ TravelBook
        </Link>

        {/* Links */}
        <div
          className={`flex items-center gap-8 text-sm font-semibold transition ${
            scrolled || !isHome ? "text-gray-700" : "text-white"
          }`}
        >
          <Link href="/" className="hover:text-blue-600 transition">
            Trang chủ
          </Link>
          <Link href="/search?keyword=" className="hover:text-blue-600 transition">
            Khách sạn
          </Link>

          {loggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-current px-4 py-1.5 text-sm hover:bg-blue-600 hover:border-blue-600 hover:text-white transition"
              >
                👤 {userName.split(" ").slice(-1)[0] || "Tôi"}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-4 py-1.5 text-sm text-white hover:bg-red-600 transition"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-current px-4 py-1.5 hover:bg-white/10 transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700 transition"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
