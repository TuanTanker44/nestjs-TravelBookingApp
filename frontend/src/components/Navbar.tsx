"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
    const onStorage = () => setLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  const navBg = scrolled
    ? "rgba(10,10,15,0.95)"
    : isHome ? "transparent" : "rgba(10,10,15,0.85)";

  const links = [
    { href: "/search", label: "Khách sạn" },
    { href: "/search?keyword=resort", label: "Resort" },
    { href: "/search?keyword=boutique", label: "Boutique" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: navBg,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "none",
      }}>
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-bold text-gold tracking-tight hover:opacity-80 transition-opacity">
          ✦ TravelBook
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="text-sm font-medium transition-colors hover:text-gold"
              style={{ color: pathname === l.href ? "var(--gold)" : "rgba(240,237,232,0.7)" }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link href="/profile"
                className="rounded-xl px-5 py-2 text-sm font-semibold transition hover:text-gold"
                style={{ color: "rgba(240,237,232,0.7)" }}>
                Tài khoản
              </Link>
            </>
          ) : (
            <>
              <Link href="/login"
                className="rounded-xl px-5 py-2 text-sm font-semibold transition hover:text-gold"
                style={{ color: "rgba(240,237,232,0.7)" }}>
                Đăng nhập
              </Link>
              <Link href="/register" className="btn-gold rounded-xl px-5 py-2 text-sm font-bold">
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="flex md:hidden flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "var(--text)" }}>
          <span className={`block h-0.5 w-6 rounded transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: "currentColor" }} />
          <span className={`block h-0.5 w-6 rounded transition-all ${menuOpen ? "opacity-0" : ""}`} style={{ background: "currentColor" }} />
          <span className={`block h-0.5 w-6 rounded transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "currentColor" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 space-y-3" style={{ background: "rgba(10,10,15,0.98)", borderTop: "1px solid var(--border)" }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium border-b"
              style={{ color: "rgba(240,237,232,0.75)", borderColor: "var(--border)" }}>
              {l.label}
            </Link>
          ))}
          {loggedIn ? (
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-semibold text-gold">
              Tài khoản của tôi
            </Link>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center rounded-xl py-3 text-sm font-semibold"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}>Đăng nhập</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center btn-gold rounded-xl py-3 text-sm font-bold">Đăng ký</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
