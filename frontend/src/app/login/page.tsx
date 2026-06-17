"use client";
import { authApi } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Vui lòng điền đầy đủ"); return; }
    setLoading(true);
    try {
      const res = await authApi.post("/auth/login", { email, password });
      const token = res.data?.access_token ?? res.data?.token;
      if (!token) throw new Error("No token");
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("storage"));
      toast.success("Chào mừng trở lại! ✦");
      router.push("/");
    } catch {
      toast.error("Email hoặc mật khẩu không đúng");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full rounded-xl px-4 py-3.5 text-sm transition-all outline-none";

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Left panel */}
      <div className="hidden relative overflow-hidden md:flex md:w-1/2 flex-col justify-end p-12">
        <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&q=80"
          alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.3) 60%)" }} />
        <div className="relative z-10">
          <p className="font-display italic text-3xl font-bold leading-snug mb-3" style={{ color: "var(--text)" }}>
            "Mỗi hành trình đều bắt đầu<br />bằng một bước nhỏ."
          </p>
          <p style={{ color: "var(--gold)" }} className="text-sm font-semibold">— TravelBook</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display mb-10 block text-2xl font-bold text-gold">✦ TravelBook</Link>
          <h1 className="font-display mb-2 text-4xl font-bold" style={{ color: "var(--text)" }}>Đăng nhập</h1>
          <p className="mb-8 text-sm" style={{ color: "var(--muted)" }}>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-gold hover:underline">Đăng ký ngay</Link>
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Email</label>
              <input type="email" placeholder="you@example.com" className={inputCls}
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mật khẩu</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pr-12`}
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading}
              className="btn-gold w-full rounded-xl py-4 text-sm font-bold disabled:opacity-50 mt-2">
              {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
            </button>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
            <Link href="/" className="hover:text-gold transition-colors">← Quay lại trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
