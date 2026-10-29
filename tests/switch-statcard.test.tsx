import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Switch } from "../src/components/Switch";
import { StatCard } from "../src/components/StatCard";

describe("Switch", () => {
  it("animates the thumb's translate property", () => {
    const { container } = render(<Switch aria-label="Wi-Fi" />);
    const thumb = container.querySelector("span.z-10");
    // translate-x-* sets the CSS translate property, which a transform-only transition would skip
    expect(thumb?.getAttribute("class")).toContain("transition-[translate,width]");
  });
});

describe("StatCard", () => {
  it("scales with size", () => {
    const { rerender } = render(<StatCard title="Revenue" value="$1" size="sm" />);
    expect(screen.getByText("$1").getAttribute("class")).toContain("text-2xl");
    rerender(<StatCard title="Revenue" value="$1" size="lg" />);
    expect(screen.getByText("$1").getAttribute("class")).toContain("text-4xl");
    expect(screen.getByText("Revenue").getAttribute("class")).toContain("text-base");
  });
});
