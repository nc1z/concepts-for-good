import type { Metadata } from "next";

import { getPocBySlug } from "@/lib/pocs";

const poc = getPocBySlug("healthy-hawker-budget-sg");

export const metadata: Metadata = {
  title: poc?.title ?? "Healthy Hawker Budget",
  description: poc?.summary ?? "Build a healthier hawker day without overspending.",
  keywords: poc?.tags ?? ["Wellness", "Food", "Budget", "Singapore"],
  openGraph: {
    title: poc?.title ?? "Healthy Hawker Budget",
    description: poc?.summary ?? "Build a healthier hawker day without overspending.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: poc?.title ?? "Healthy Hawker Budget",
    description: poc?.summary ?? "Build a healthier hawker day without overspending.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
