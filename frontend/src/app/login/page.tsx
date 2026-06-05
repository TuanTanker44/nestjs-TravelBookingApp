"use client";

import api from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      // POST http://localhost:5000/api/auth/login
      const res = await api.post("/auth/login", { email, password });

      // Backend trả về { token, user }
      localStorage.setItem("token", res.data.token);
      // Trigger Navbar cập nhật
      window.dispatchEvent(new Event("storage"));

      toast.success(`Chào mừng trở lại! 👋`);
      router.push("/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Email hoặc mật khẩu không đúng";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — decorative */}
      <div
        className="hidden flex-col justify-end bg-cover bg-center p-12 md:flex md:w-1/2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&q=80')",
        }}
      >
        <div className="rounded-2xl bg-black/40 p-8 backdrop-blur-sm">
          <p className="text-3xl font-black text-white leading-snug">
            &ldquo;Mỗi hành trình đều bắt đầu bằng một bước nhỏ.&rdquo;
          </p>
          <p className="mt-3 text-blue-200">— TravelBook</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 block text-2xl font-black text-blue-600">
            ✈️ TravelBook
          </Link>

          <h1 className="mb-2 text-4xl font-black text-gray-900">Đăng nhập</h1>
          <p className="mb-8 text-gray-500">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-bold text-blue-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98] transition"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
