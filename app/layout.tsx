import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DENIM ARCHIVE | Curated Selection",
  description: "A digital vault of rare denim pieces, signature washes, and historical fits.",
  referrer: 'no-referrer',
  openGraph: {
    title: 'DENIM ARCHIVE',
    description: 'A digital vault of rare denim pieces, signature washes, and historical fits.',
    url: 'https://buy-jens.onrender.com',
    siteName: 'DENIM ARCHIVE',
    images: [
      {
        url: 'https://i.ibb.co/QwqRbG3/uma-musume-mambo.png', // Using the golden link as the default OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DENIM ARCHIVE',
    description: 'A digital vault of rare denim pieces, signature washes, and historical fits.',
    images: ['https://i.ibb.co/QwqRbG3/uma-musume-mambo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020202] text-white min-h-screen`}
      >
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)] pointer-events-none"></div>
        <div className="relative z-10">
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
