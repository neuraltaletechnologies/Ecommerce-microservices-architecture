import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/homepage/BackToTopButton";
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
    default: "Neurashop by Neuraltale - #1 Tech Store in Tanzania | Buy Laptops, Phones & Electronics Online",
    template: "%s | Neurashop by Neuraltale - Tanzania Tech Store",
  },
  description: "Neurashop by Neuraltale is Tanzania's leading online tech store. Buy laptops, smartphones, tablets, gaming PCs, wireless earbuds, smartwatches & electronics. Free delivery in Dar es Salaam. Best prices in Tanzania & East Africa. Shop now!",
  keywords: [
    // Brand keywords
    "neuraltale",
    "neurashop",
    "neuraltale Tanzania",
    "neurashop Tanzania",
    "neurashop.neuraltale.com",
    "neuraltale online store",
    "neurashop e-commerce",
    // Product keywords
    "buy laptop Tanzania",
    "buy smartphone Tanzania", 
    "buy iPhone Tanzania",
    "buy Samsung Tanzania",
    "buy MacBook Tanzania",
    "gaming laptop Tanzania",
    "buy computer Tanzania",
    "buy tablet Tanzania",
    "buy electronics Tanzania",
    "buy tech Tanzania",
    "buy IT devices Tanzania",
    "buy IT equipment Tanzania",
    // Location keywords
    "tech store Dar es Salaam",
    "electronics store Tanzania",
    "computer shop Dar es Salaam",
    "laptop store Dar es Salaam",
    "phone store Dar es Salaam",
    "online shopping Tanzania",
    "e-commerce Tanzania",
    // Category keywords
    "laptops Tanzania",
    "smartphones Tanzania",
    "wireless earbuds Tanzania",
    "smartwatches Tanzania",
    "gaming gear Tanzania",
    "computer accessories Tanzania",
    "audio equipment Tanzania",
    "tablets Tanzania",
    "monitors Tanzania",
    // Intent keywords
    "best tech deals Tanzania",
    "cheap laptops Tanzania",
    "affordable electronics Tanzania",
    "premium tech Tanzania",
    "quality electronics Tanzania",
    "original electronics Tanzania",
    "genuine products Tanzania",
    // Regional keywords
    "tech products East Africa",
    "electronics East Africa",
    "online tech store Africa",
  ].join(", "),
  authors: [{ name: "Neuraltale", url: "https://neuraltale.com" }],
  creator: "Neuraltale Tanzania",
  publisher: "Neurashop by Neuraltale",
  category: "E-commerce, Electronics, Technology",
  classification: "Electronics & Technology Store",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://neurashop.neuraltale.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': 'https://neurashop.neuraltale.com',
      'sw': 'https://neurashop.neuraltale.com',
    },
  },
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
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
    title: "Neurashop by Neuraltale - Buy Laptops, Phones & Electronics in Tanzania",
    description: "Tanzania's #1 online tech store. Shop laptops, smartphones, gaming gear, tablets & electronics at best prices. Powered by Neuraltale. Free delivery in Dar es Salaam!",
    url: "https://neurashop.neuraltale.com",
    siteName: "Neurashop by Neuraltale",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 611,
        height: 611,
        alt: "Neurashop by Neuraltale - Tanzania Tech Store Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neurashop by Neuraltale - Tanzania's #1 Tech Store",
    description: "Buy laptops, smartphones, gaming gear & electronics online in Tanzania. Best prices, free delivery in Dar es Salaam. Shop now!",
    site: "@neuraltale",
    creator: "@neuraltale",
    images: ["/logo.png"],
  },
  other: {
    'geo.region': 'TZ',
    'geo.placename': 'Dar es Salaam, Tanzania',
    'geo.position': '-6.7924;39.2083',
    'ICBM': '-6.7924, 39.2083',
    'language': 'English, Swahili',
    'target-audience': 'all',
    'audience': 'all',
    'coverage': 'Tanzania, East Africa, Africa',
    'distribution': 'Global',
    'rating': 'General',
    'revisit-after': '3 days',
    'msapplication-TileColor': '#001E3C',
    'theme-color': '#001E3C',
  },
  applicationName: 'Neurashop',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = 'https://neurashop.neuraltale.com';
  
  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Neuraltale',
    alternateName: ['Neurashop', 'Neuraltale Tanzania', 'Neurashop Tanzania'],
    url: 'https://neuraltale.com',
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 611,
      height: 611,
    },
    image: `${baseUrl}/logo.png`,
    description: 'Neuraltale is a leading technology company in Tanzania, operating Neurashop - the premier online electronics and tech store serving East Africa.',
    foundingDate: '2024',
    foundingLocation: 'Dar es Salaam, Tanzania',
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: -6.7924,
        longitude: 39.2083,
      },
      geoRadius: '2000 km',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dar es Salaam',
      addressLocality: 'Dar es Salaam',
      addressRegion: 'Dar es Salaam',
      addressCountry: 'TZ',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English', 'Swahili'],
        areaServed: 'TZ',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        availableLanguage: ['English', 'Swahili'],
        areaServed: 'TZ',
      },
    ],
    sameAs: [
      'https://twitter.com/neuraltale',
      'https://facebook.com/neuraltale',
      'https://instagram.com/neuraltale',
      'https://linkedin.com/company/neuraltale',
    ],
  };

  // Online Store Schema
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${baseUrl}/#store`,
    name: 'Neurashop by Neuraltale',
    alternateName: ['Neurashop', 'Neurashop Tanzania', 'Neuraltale Shop'],
    description: 'Neurashop is Tanzania\'s #1 online tech store. Buy laptops, smartphones, tablets, gaming PCs, wireless earbuds, smartwatches and electronics at best prices. Free delivery in Dar es Salaam.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/logo.png`,
    telephone: '+255',
    priceRange: 'TZS 50,000 - TZS 10,000,000',
    currenciesAccepted: 'TZS',
    paymentAccepted: 'Credit Card, Debit Card, Mobile Money',
    openingHours: 'Mo-Su 00:00-24:00',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dar es Salaam',
      addressLocality: 'Dar es Salaam',
      addressRegion: 'Dar es Salaam',
      postalCode: '00000',
      addressCountry: 'TZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -6.7924,
      longitude: 39.2083,
    },
    areaServed: [
      { '@type': 'Country', name: 'Tanzania' },
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Country', name: 'Uganda' },
    ],
    brand: {
      '@type': 'Brand',
      name: 'Neuraltale',
    },
    parentOrganization: {
      '@id': `${baseUrl}/#organization`,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Electronics & Technology Products',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Laptops' },
        { '@type': 'OfferCatalog', name: 'Smartphones' },
        { '@type': 'OfferCatalog', name: 'Tablets' },
        { '@type': 'OfferCatalog', name: 'Gaming Gear' },
        { '@type': 'OfferCatalog', name: 'Audio Devices' },
        { '@type': 'OfferCatalog', name: 'Smartwatches' },
        { '@type': 'OfferCatalog', name: 'Accessories' },
      ],
    },
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'Neurashop by Neuraltale',
    alternateName: 'Neurashop',
    url: baseUrl,
    description: 'Buy laptops, smartphones, tablets, gaming gear and electronics online in Tanzania. Best prices, fast delivery.',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en', 'sw'],
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${baseUrl}/products`,
      },
    ],
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          {/* Store Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(storeSchema),
            }}
          />
          {/* WebSite Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
          {/* Breadcrumb Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbSchema),
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
          <BackToTopButton />
          <ToastContainer 
            position="bottom-right" 
            toastClassName="!bg-white !text-gray-900 !shadow-lg !border !border-gray-200"
            progressClassName="!bg-[#FDB913]"
          />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
