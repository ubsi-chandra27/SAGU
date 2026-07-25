import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAGU - Sistem Administrasi Guru",
  description: "Aplikasi administrasi sekolah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
