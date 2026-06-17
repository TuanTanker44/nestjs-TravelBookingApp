import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "TravelBook – Đặt phòng khách sạn cao cấp",
  description: "Khám phá và đặt phòng hơn 1,200 khách sạn resort cao cấp trên toàn Việt Nam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111118",
              color: "#f0ede8",
              border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: "12px",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#c9a84c", secondary: "#0a0a0f" } },
          }}
        />
      </body>
    </html>
  );
}
