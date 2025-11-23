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
  title: {
    default: "Neuraltale - Premium Tech Store | Laptops, Smartphones & Electronics Online",
    template: "%s | Neuraltale - Premium Tech Store",
  },
  description: "Shop premium technology products at Neuraltale Tanzania. Discover laptops, smartphones, audio devices, gaming gear & electronics. Fast shipping across Tanzania & East Africa. Best prices guaranteed.",
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
    "online electronics shopping Tanzania",
    "tech products East Africa",
    "buy electronics Dar es Salaam",
    "laptop store Tanzania",
    "phone store Tanzania",
  ].join(", "),
  authors: [{ name: "Neuraltale", url: "https://neuraltale-client.vercel.app" }],
  creator: "Neuraltale",
  publisher: "Neuraltale Tech Store",
  category: "E-commerce",
  classification: "Electronics & Technology",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://eshop.neuraltale.com'),
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
    title: "Neuraltale - Premium Tech Store | Buy Electronics Online",
    description: "Shop premium laptops, smartphones, gaming gear & electronics in Tanzania. Fast shipping across Dar es Salaam & all regions. Best prices guaranteed.",
    url: "https://eshop.neuraltale.com",
    siteName: "Neuraltale Tech Store",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Neuraltale Premium Tech Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuraltale - Premium Tech Store | Electronics Online",
    description: "Shop premium tech products in Tanzania. Laptops, smartphones, gaming gear & more. Fast delivery across Tanzania.",
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
                url: 'https://neuraltale-client.vercel.app',
                logo: 'https://eshop.neuraltale.com/logo.png',
                description: 'Premium technology and electronics store in Tanzania offering laptops, smartphones, gaming gear and accessories across Dar es Salaam and East Africa.',
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
                name: 'Neuraltale',
                url: 'https://eshop.neuraltale.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://eshop.neuraltale.com/products?search={search_term_string}',
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
