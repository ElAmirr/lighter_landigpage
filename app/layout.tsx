import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAVAY — The Streets Are Alive",
  description:
    "The ultimate real-world collectible game. Find custom QR-code lighters in the wild, scan them to claim ownership, steal them from other players, and track their journey across the country.",
  keywords: ["DAVAY", "streetwear", "collectible", "QR code", "lighter", "game", "mobile app"],
  openGraph: {
    title: "DAVAY — The Streets Are Alive",
    description: "Find. Scan. Survive. The ultimate real-world collectible game.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
