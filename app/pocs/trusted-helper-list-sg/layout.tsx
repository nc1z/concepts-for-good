import type { Metadata } from "next";

import { getPocBySlug } from "@/lib/pocs";

const poc = getPocBySlug("trusted-helper-list-sg");

export const metadata: Metadata = {
  title: poc?.title ?? "Trusted Helper List",
  description:
    poc?.summary ?? "Keep family support contacts, routines, and handoff notes close when care shifts change.",
  keywords: poc?.tags ?? ["Caregiving", "Family", "Contacts", "Singapore"],
  openGraph: {
    title: poc?.title ?? "Trusted Helper List",
    description:
      poc?.summary ?? "Keep family support contacts, routines, and handoff notes close when care shifts change.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: poc?.title ?? "Trusted Helper List",
    description:
      poc?.summary ?? "Keep family support contacts, routines, and handoff notes close when care shifts change.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
