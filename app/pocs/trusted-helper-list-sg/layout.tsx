import type { Metadata } from "next";

import { getPocBySlug } from "@/lib/pocs";

const poc = getPocBySlug("trusted-helper-list-sg");

export const metadata: Metadata = {
  title: poc?.title ?? "Trusted Helper List",
  description:
    poc?.summary ?? "Keep the right helper one tap away with routines, handoff notes, and quick contact.",
  keywords: poc?.tags ?? ["Caregiving", "Family", "Contacts", "Singapore"],
  openGraph: {
    title: poc?.title ?? "Trusted Helper List",
    description:
      poc?.summary ?? "Keep the right helper one tap away with routines, handoff notes, and quick contact.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: poc?.title ?? "Trusted Helper List",
    description:
      poc?.summary ?? "Keep the right helper one tap away with routines, handoff notes, and quick contact.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
