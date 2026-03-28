import type { Metadata } from "next";
import { JetBrains_Mono, Public_Sans } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const publicSans = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://conceptsforgood.sg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Concepts for Good",
    template: "%s | Concepts for Good",
  },
  description:
    "A gallery of Singapore-focused proof-of-concept apps for access, care, resilience, and community — built as fast, browser-based experiments.",
  keywords: [
    "Singapore",
    "public good",
    "social impact",
    "civic tech",
    "accessibility",
    "community",
    "volunteering",
    "caregiving",
    "proof of concept",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Concepts for Good",
    title: "Concepts for Good",
    description:
      "A gallery of Singapore-focused proof-of-concept apps for access, care, resilience, and community — built as fast, browser-based experiments.",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concepts for Good",
    description:
      "A gallery of Singapore-focused proof-of-concept apps for access, care, resilience, and community.",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${jetBrainsMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
