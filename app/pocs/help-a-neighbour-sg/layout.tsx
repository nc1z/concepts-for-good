import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help a Neighbour",
  description:
    "Post and answer small local help requests with anonymous community cards.",
};

export default function HelpANeighbourLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
