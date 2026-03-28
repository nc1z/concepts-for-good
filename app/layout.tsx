import type { Metadata } from "next";
import { JetBrains_Mono, Public_Sans } from "next/font/google";
import Script from "next/script";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://goodideas.sg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Good Ideas SG",
    template: "%s | Good Ideas SG",
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
    siteName: "Good Ideas SG",
    title: "Good Ideas SG",
    description:
      "A gallery of Singapore-focused proof-of-concept apps for access, care, resilience, and community — built as fast, browser-based experiments.",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Good Ideas SG",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-822XHZJVRE"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-822XHZJVRE');
          `}
        </Script>
      </body>
    </html>
  );
}
