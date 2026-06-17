"use client";
import { authApi } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false); const [showPw, setShowPw] = useState(false);
  const pwStr = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strColors = ["", "#ef4444", "#f59e0b", "#22c55e"];

  const handle = async () => {
    if (!name.trim()) { toast.error("Nhập họ tên"); return; }
    if (!email.includes("@")) { toast.error("Email không hợp lệ"); return; }
    if (password.length < 6) { toast.error("Mật khẩu tối thiểu 6 ký tự"); return; }
    if (password !== confirm) { toast.error("Mật khẩu không khớp"); return; }
    setLoading(true);
    try {
      await authApi.post("/auth/register", { name, email, password });
      toast.success("Đăng ký thành công! 🎉");
      router.push("/login");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Đăng ký thất bại");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full rounded-xl px-4 py-3.5 text-sm transition-all outline-none";

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="hidden relative overflow-hidden md:flex md:w-1/2 flex-col justify-end p-12">
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80"
          alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.3) 60%)" }} />
        <div className="relative z-10">
          <p className="font-display italic text-3xl font-bold leading-snug mb-3" style={{ color: "var(--text)" }}>
            Tham gia cộng đồng<br />du lịch của chúng tôi
          </p>
          <p style={{ color: "var(--gold)" }} className="text-sm font-semibold">Hơn 50,000 người dùng tin tưởng TravelBook</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display mb-10 block text-2xl font-bold text-gold">✦ TravelBook</Link>
          <h1 className="font-display mb-2 text-4xl font-bold" style={{ color: "var(--text)" }}>Đăng ký</h1>
          <p className="mb-8 text-sm" style={{ color: "var(--muted)" }}>
            Đã có tài khoản? <Link href="/login" className="font-semibold text-gold hover:underline">Đăng nhập</Link>
          </p>

          <div className="space-y-4">
            {[{ label: "Họ và tên", val: name, set: setName, type: "text", ph: "Nguyễn Văn A" },
              { label: "Email", val: email, set: setEmail, type: "email", ph: "you@example.com" }].map(f => (
              <div key={f.label}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} className={inputCls}
                  value={f.val} onChange={e => f.set(e.target.value)} />
              </div>
            ))}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mật khẩu</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Tối thiểu 6 ký tự"
                  className={`${inputCls} pr-12`}
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-colors"
                        style={{ background: i <= pwStr ? strColors[pwStr] : "var(--border)" }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{["", "Yếu", "Trung bình", "Mạnh"][pwStr]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Xác nhận mật khẩu</label>
              <input type="password" placeholder="Nhập lại mật khẩu" className={inputCls}
                style={{ borderColor: confirm && confirm !== password ? "#ef4444" : undefined }}
                value={confirm} onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handle()} />
              {confirm && confirm !== password && (
                <p className="mt-1 text-xs" style={{ color: "#f87171" }}>Mật khẩu không khớp</p>
              )}
            </div>

            <button onClick={handle} disabled={loading}
              className="btn-gold w-full rounded-xl py-4 text-sm font-bold disabled:opacity-50 mt-2">
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản →"}
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
