import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    default: "Neurashop - Premium Tech Store by Neuraltale | Laptops, Smartphones & Electronics",
    template: "%s | Neurashop by Neuraltale",
  },
  description: "Shop premium technology products at Neurashop, powered by Neuraltale Tanzania. Discover laptops, smartphones, audio devices, gaming gear & electronics. Fast shipping across Tanzania & East Africa. Best prices guaranteed.",
  keywords: [
    "tech store Tanzania",
    "electronics online Tanzania",
    "buy laptops Tanzania",
    "smartphones Tanzania",
    "gaming laptops Tanzania",
    "wireless earbuds Tanzania",
    "smartwatches Tanzania",
    "tech gadgets Dar es Salaam",
    "computer accessories Tanzania",
    "audio equipment Tanzania",
    "best tech deals Tanzania",
    "premium electronics Tanzania",
    "neuraltale Tanzania",
    "neurashop Tanzania",
    "neurashop e-commerce",
    "online electronics shopping Tanzania",
    "tech products East Africa",
    "buy electronics Dar es Salaam",
    "laptop store Tanzania",
    "phone store Tanzania",
  ].join(", "),
  authors: [{ name: "Neuraltale", url: "https://neuraltale-client.vercel.app" }],
  creator: "Neuraltale",
  publisher: "Neurashop by Neuraltale",
  category: "E-commerce",
  classification: "Electronics & Technology",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://neurashop.neuraltale.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  openGraph: {
    title: "Neurashop - Premium Tech Store by Neuraltale | Buy Electronics Online",
    description: "Shop premium laptops, smartphones, gaming gear & electronics in Tanzania. Powered by Neuraltale. Fast shipping across Dar es Salaam & all regions. Best prices guaranteed.",
    url: "https://neurashop.neuraltale.com",
    siteName: "Neurashop by Neuraltale",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Neurashop - Premium Tech Store by Neuraltale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neurashop - Premium Tech Store by Neuraltale | Electronics Online",
    description: "Shop premium tech products in Tanzania. Powered by Neuraltale. Laptops, smartphones, gaming gear & more. Fast delivery across Tanzania.",
    site: "@neuraltale",
    creator: "@neuraltale",
    images: ["/logo.png"],
  },
  other: {
    'geo.region': 'TZ',
    'geo.placename': 'Tanzania',
    'geo.position': '-6.7924;39.2083',
    'ICBM': '-6.7924, 39.2083',
    'language': 'English, Swahili',
    'target-audience': 'all',
    'audience': 'all',
    'coverage': 'Tanzania, East Africa',
    'distribution': 'Regional',
    'rating': 'General',
    'revisit-after': '7 days',
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
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Neuraltale',
                alternateName: 'Neurashop',
                url: 'https://neuraltale-client.vercel.app',
                logo: 'https://neurashop.neuraltale.com/logo.png',
                description: 'Neurashop is the premium e-commerce platform by Neuraltale, offering technology and electronics in Tanzania including laptops, smartphones, gaming gear and accessories across Dar es Salaam and East Africa.',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'TZ',
                  addressRegion: 'Dar es Salaam',
                  addressLocality: 'Dar es Salaam',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Service',
                  availableLanguage: ['English'],
                },
                sameAs: [
                  'https://twitter.com/neuraltale',
                  'https://facebook.com/neuraltale',
                  'https://instagram.com/neuraltale',
                ],
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Neurashop by Neuraltale',
                url: 'https://neurashop.neuraltale.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://neurashop.neuraltale.com/products?search={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              }),
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          {/* Main page layout: Navbar at top, content in the middle, Footer at bottom */}
          <div className="min-h-screen flex flex-col overflow-x-hidden">
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
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
