import type { Metadata } from "next";
import { getPocBySlug } from "@/lib/pocs";

const poc = getPocBySlug("elder-social-outing-sg")!;

export const metadata: Metadata = {
  title: poc.title,
  description: poc.summary,
  keywords: poc.tags,
  openGraph: {
    title: poc.title,
    description: poc.summary,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: poc.title,
    description: poc.summary,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

