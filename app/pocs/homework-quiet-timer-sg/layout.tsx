import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homework Quiet Timer",
  description:
    "Create short, calm homework sessions for children in noisy homes.",
};

export default function HomeworkQuietTimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
