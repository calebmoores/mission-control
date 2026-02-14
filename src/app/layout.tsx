import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🦉 CALEB | Mission Control",
  description: "AI Chief of Staff Dashboard - Mission Control Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0c0c12] grid-bg">
        {/* CRT Overlay Effects */}
        <div className="crt-overlay" />
        <div className="scanline" />
        
        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
