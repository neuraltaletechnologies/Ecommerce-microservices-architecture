import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neuraltale - Premium Tech Store",
  description: "Discover the future of technology with Neuraltale. Premium tech products, cutting-edge innovation, and exceptional quality.",
  keywords: "tech, electronics, smartphones, laptops, audio, gadgets, innovation",
  authors: [{ name: "Neuraltale" }],
  creator: "Neuraltale",
  publisher: "Neuraltale",
  metadataBase: new URL('https://neuraltale.com'),
  openGraph: {
    title: "Neuraltale - Premium Tech Store",
    description: "Discover the future of technology with Neuraltale",
    url: "https://neuraltale.com",
    siteName: "Neuraltale",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuraltale - Premium Tech Store",
    description: "Discover the future of technology with Neuraltale",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          {/* Main page layout: Navbar at top, content in the middle, Footer at bottom */}
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 ">
              {children}
            </main>
            <Footer />
          </div>
          <ToastContainer 
            position="bottom-right" 
            toastClassName="!bg-white !text-gray-900 !shadow-lg !border !border-gray-200"
            progressClassName="!bg-blue-600"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
