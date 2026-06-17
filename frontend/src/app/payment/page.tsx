"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentApi } from "@/services/api";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

const METHODS = [
  { id: "card", label: "Thẻ tín dụng / ghi nợ", icon: "💳", sub: "Visa · Mastercard · JCB" },
  { id: "momo", label: "Ví MoMo", icon: "🟣", sub: "Thanh toán nhanh qua QR" },
  { id: "banking", label: "Chuyển khoản ngân hàng", icon: "🏦", sub: "Hơn 40 ngân hàng Việt" },
  { id: "zalopay", label: "ZaloPay", icon: "🔵", sub: "Ví điện tử ZaloPay" },
];

function PaymentContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const bookingId = sp.get("bookingId") ?? "demo-123";
  const total = Number(sp.get("total") ?? 0);

  const [method, setMethod] = useState("card");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handlePay = async () => {
    if (method === "card") {
      if (cardNum.replace(/\s/g, "").length < 16) { toast.error("Số thẻ không hợp lệ"); return; }
      if (!cardName.trim()) { toast.error("Nhập tên chủ thẻ"); return; }
      if (expiry.length < 5) { toast.error("Nhập ngày hết hạn"); return; }
      if (cvv.length < 3) { toast.error("CVV không hợp lệ"); return; }
    }
    setLoading(true);
    try {
      await paymentApi.post("/payments", { bookingId, method, amount: total });
    } catch { /* fallback for demo */ }
    finally {
      toast.success("Thanh toán thành công! 🎉");
      router.push(`/success?bookingId=${bookingId}&total=${total}`);
    }
  };

  const inputCls = "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-12 pt-28">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gold">Bước 2/2</p>
        <h1 className="font-display mb-8 text-4xl font-bold" style={{ color: "var(--text)" }}>Thanh toán</h1>

        <div className="grid gap-8 md:grid-cols-3">

          {/* Left – payment form */}
          <div className="space-y-5 md:col-span-2">

            {/* Method selector */}
            <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <h2 className="font-display mb-5 text-xl font-bold" style={{ color: "var(--text)" }}>Phương thức thanh toán</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {METHODS.map(m => {
                  const sel = method === m.id;
                  return (
                    <div key={m.id} onClick={() => setMethod(m.id)}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-4 transition-all"
                      style={{
                        background: sel ? "rgba(201,168,76,0.07)" : "var(--surface2)",
                        border: sel ? "1.5px solid rgba(201,168,76,0.45)" : "1px solid var(--border)",
                      }}>
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{m.label}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{m.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card form */}
            {method === "card" && (
              <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h2 className="font-display mb-5 text-xl font-bold" style={{ color: "var(--text)" }}>Thông tin thẻ</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Số thẻ</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className={inputCls}
                      value={cardNum} onChange={e => setCardNum(fmtCard(e.target.value))} inputMode="numeric" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Tên chủ thẻ</label>
                    <input type="text" placeholder="NGUYEN VAN A" className={inputCls}
                      value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Ngày hết hạn</label>
                      <input type="text" placeholder="MM/YY" className={inputCls}
                        value={expiry} onChange={e => setExpiry(fmtExp(e.target.value))} maxLength={5} inputMode="numeric" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>CVV</label>
                      <input type="password" placeholder="•••" className={inputCls}
                        value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" />
                    </div>
                  </div>
                </div>

                {/* Preview card */}
                {cardNum && (
                  <div className="mt-6 rounded-2xl p-5 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1a1508 0%, #3d2f00 50%, #1a1508 100%)", border: "1px solid rgba(201,168,76,0.35)" }}>
                    <div className="absolute top-3 right-4 text-gold opacity-20 text-6xl font-display">✦</div>
                    <p className="text-xs font-bold tracking-widest text-gold mb-4">TravelBook Card</p>
                    <p className="font-mono text-lg tracking-[0.22em] mb-3" style={{ color: "var(--text)" }}>
                      {cardNum || "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex justify-between text-xs" style={{ color: "rgba(240,237,232,0.5)" }}>
                      <span>{cardName || "TÊN CHỦ THẺ"}</span>
                      <span>{expiry || "MM/YY"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* QR for Momo/ZaloPay */}
            {(method === "momo" || method === "zalopay") && (
              <div className="rounded-2xl p-7 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-2xl text-6xl"
                  style={{ background: "var(--surface2)", border: "1px dashed var(--border)" }}>
                  {method === "momo" ? "🟣" : "🔵"}
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Quét mã QR để thanh toán</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Mở {method === "momo" ? "MoMo" : "ZaloPay"} → Quét mã → Xác nhận</p>
              </div>
            )}

            {/* Banking info */}
            {method === "banking" && (
              <div className="rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <h2 className="font-display mb-4 text-xl font-bold" style={{ color: "var(--text)" }}>Thông tin chuyển khoản</h2>
                {[
                  ["Ngân hàng", "Vietcombank"],
                  ["Số tài khoản", "0123 4567 8901"],
                  ["Chủ tài khoản", "TRAVELBOOK VIETNAM"],
                  ["Nội dung CK", bookingId],
                  ["Số tiền", `$${total} (theo tỷ giá ngân hàng)`],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>{l}</span>
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right summary */}
          <div>
            <div className="sticky top-24 rounded-2xl p-7" style={{ background: "var(--surface)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>Tóm tắt đơn hàng</p>
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>Mã đặt phòng</span>
                  <span className="font-mono text-xs" style={{ color: "var(--text)" }}>{bookingId.slice(0, 12)}...</span>
                </div>
                <div className="h-px" style={{ background: "var(--border)" }} />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold" style={{ color: "var(--text)" }}>Tổng thanh toán</span>
                  <span className="font-display text-3xl font-bold text-gold">${total}</span>
                </div>
              </div>
              <button onClick={handlePay} disabled={loading}
                className="btn-gold w-full rounded-xl py-4 text-sm font-bold disabled:opacity-50">
                {loading ? "Đang xử lý..." : `Thanh toán $${total} →`}
              </button>
              <div className="mt-4 space-y-1.5 text-xs text-center" style={{ color: "var(--muted)" }}>
                <p>🔒 Mã hóa SSL 256-bit</p>
                <p>✦ Xác nhận ngay sau thanh toán</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return <Suspense><PaymentContent /></Suspense>;
}
