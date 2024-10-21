import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PHProvider } from "./providers";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
const PostHogPageView = dynamic(() => import("./PosthogPageView"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Castmoney: The alpha is in your social graph",
  description: "The alpha is in your social graph",
  openGraph: {
    title: "Castmoney: The alpha is in your social graph",
    description: "The alpha is in your social graph",
    url: "https://castmoney.xyz",
    siteName: "Castmoney ",
    images: [
      {
        url: "https://castmoney.xyz/og-image.jpg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Castmoney: The alpha is in your social graph",
    description: "The alpha is in your social graph",
    images: ["https://castmoney.xyz/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />
          <PostHogPageView />

          {children}
        </body>
      </PHProvider>
    </html>
  );
}
