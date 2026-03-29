import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Mock next/navigation — provides App Router context for hooks
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link — renders a plain anchor in tests
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock next/font/google — each font export returns a stub with className + variable
vi.mock("next/font/google", () =>
  new Proxy(
    {},
    {
      get: () => () => ({ className: "", variable: "--font-mock", style: {} }),
    },
  ),
);

import Home from "../app/page";

describe("Gallery page", () => {
  it("renders without crashing", () => {
    render(<Home />);
  });

  it("shows the site name in the hero", () => {
    render(<Home />);
    const matches = screen.getAllByText(/Good Ideas SG/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders at least one gallery card", () => {
    render(<Home />);
    // Every card has a 'View' link — check at least one exists
    const viewLinks = screen.getAllByRole("link", { name: /view/i });
    expect(viewLinks.length).toBeGreaterThan(0);
  });

  it("renders the search input", () => {
    render(<Home />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("defaults sort to the randomized mode", () => {
    render(<Home />);
    expect(screen.getByRole("combobox", { name: /sort ideas/i })).toHaveValue("random");
    const defaultOption = screen.getByRole("option", { name: /^\(none\)$/ }) as HTMLOptionElement;
    expect(defaultOption.selected).toBe(true);
  });
});
