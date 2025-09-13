import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Pet Care & Support | UK's Premier Pet Care Platform",
    template: "%s | Pet Care & Support"
  },
  description: "Comprehensive pet care platform for UK pet owners. Manage pets, book services, connect with community, emergency vet finder, and more.",
  keywords: [
    "pet care",
    "UK pets",
    "dog walker",
    "pet sitter",
    "veterinary",
    "pet health",
    "pet community",
    "pet adoption",
    "emergency vet",
    "pet services"
  ],
  authors: [{ name: "Pet Care & Support" }],
  creator: "Pet Care & Support",
  publisher: "Pet Care & Support",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pet Care & Support | UK's Premier Pet Care Platform",
    description: "Comprehensive pet care platform for UK pet owners. Manage pets, book services, connect with community.",
    url: "/",
    siteName: "Pet Care & Support",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pet Care & Support - UK's Premier Pet Care Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Care & Support | UK's Premier Pet Care Platform",
    description: "Comprehensive pet care platform for UK pet owners.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-verification-code",
  },
  category: "lifestyle",
  classification: "Pet Care Services",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#667eea" },
    { media: "(prefers-color-scheme: dark)", color: "#4c51bf" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pet Care" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        <AuthProvider>
          <div id="root">
            {children}
            <Navigation />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
