import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: {
    default: "Neuraltale Admin Dashboard - Manage Products, Users & Orders",
    template: "%s | Neuraltale Admin",
  },
  description: "Admin dashboard for Neuraltale Tanzania tech store. Manage products, categories, users, orders, and inventory. Track sales analytics and user data.",
  keywords: "admin dashboard, e-commerce management, product management, inventory system, order management, user management, sales analytics, neuraltale admin",
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo.png', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: '/logo.png',
  },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://admin.neuraltale.com'),
  alternates: {
    canonical: '/',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
