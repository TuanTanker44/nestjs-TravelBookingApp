"use client";

import api from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập họ tên"); return; }
    if (!email.includes("@")) { toast.error("Email không hợp lệ"); return; }
    if (password.length < 6) { toast.error("Mật khẩu tối thiểu 6 ký tự"); return; }
    if (password !== confirm) { toast.error("Mật khẩu xác nhận không khớp"); return; }

    setLoading(true);
    try {
      // POST http://localhost:5000/api/auth/register
      await api.post("/auth/register", { name, email, password });
      toast.success("Đăng ký thành công! Hãy đăng nhập 🎉");
      router.push("/login");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Đăng ký thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Yếu", "Trung bình", "Mạnh"];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"];

  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div
        className="hidden flex-col justify-end bg-cover bg-center p-12 md:flex md:w-1/2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&q=80')",
        }}
      >
        <div className="rounded-2xl bg-black/40 p-8 backdrop-blur-sm">
          <p className="text-3xl font-black text-white leading-snug">
            Tham gia cộng đồng du lịch của chúng tôi
          </p>
          <p className="mt-3 text-blue-200">Hơn 10,000 người dùng tin tưởng TravelBook</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 block text-2xl font-black text-blue-600">
            ✈️ TravelBook
          </Link>

          <h1 className="mb-2 text-4xl font-black text-gray-900">Đăng ký</h1>
          <p className="mb-8 text-gray-500">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Họ và tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= pwStrength ? strengthColor[pwStrength] : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{strengthLabel[pwStrength]}</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none focus:ring-2 transition ${
                  confirm && confirm !== password
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              />
              {confirm && confirm !== password && (
                <p className="mt-1 text-xs text-red-500">Mật khẩu không khớp</p>
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full rounded-xl bg-green-600 py-4 text-sm font-black text-white hover:bg-green-700 disabled:opacity-50 active:scale-[0.98] transition"
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
