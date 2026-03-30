import type { Metadata } from "next";

import { getPocBySlug } from "@/lib/pocs";

const poc = getPocBySlug("trusted-helper-list-sg");

export const metadata: Metadata = {
  title: poc?.title ?? "Trusted Helper List",
  description:
    poc?.summary ?? "Keep your care helpers and their notes in one place, ready whenever someone needs to step in.",
  keywords: poc?.tags ?? ["Caregiving", "Family", "Contacts", "Singapore"],
  openGraph: {
    title: poc?.title ?? "Trusted Helper List",
    description:
      poc?.summary ?? "Keep your care helpers and their notes in one place, ready whenever someone needs to step in.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: poc?.title ?? "Trusted Helper List",
    description:
      poc?.summary ?? "Keep your care helpers and their notes in one place, ready whenever someone needs to step in.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
