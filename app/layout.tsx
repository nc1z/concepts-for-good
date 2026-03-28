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

export const metadata: Metadata = {
  title: "Concepts for Good",
  description:
    "A gallery of Singapore-for-good proof-of-concept apps built as focused browser-based experiments.",
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
