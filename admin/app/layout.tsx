import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Pet Care Admin Dashboard",
    template: "%s | Pet Care Admin"
  },
  description: "Administrative dashboard for Pet Care & Support platform management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}