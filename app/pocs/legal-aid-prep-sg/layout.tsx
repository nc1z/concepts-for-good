import type { Metadata } from "next";

import { getPocBySlug } from "@/lib/pocs";

const poc = getPocBySlug("legal-aid-prep-sg");

export const metadata: Metadata = {
  title: poc?.title ?? "Legal Aid Prep",
  description:
    poc?.summary ?? "Answer a few questions to see which legal help routes may fit and what papers to bring.",
  keywords: poc?.tags ?? ["Legal aid", "Support", "Singapore"],
  openGraph: {
    title: poc?.title ?? "Legal Aid Prep",
    description:
      poc?.summary ?? "Answer a few questions to see which legal help routes may fit and what papers to bring.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: poc?.title ?? "Legal Aid Prep",
    description:
      poc?.summary ?? "Answer a few questions to see which legal help routes may fit and what papers to bring.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
