import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table } from "../src/components/Table";
import { Tabs } from "../src/components/Tabs";
import { Avatar, AvatarGroup } from "../src/components/Avatar";
import { Badge } from "../src/components/Badge";
import { Chip } from "../src/components/Chip";
import { Divider } from "../src/components/Divider";
import { Skeleton } from "../src/components/Skeleton";
import { Kbd } from "../src/components/Kbd";
import { StatCard } from "../src/components/StatCard";
import { Timeline } from "../src/components/Timeline";
import { ResponsiveProvider } from "../src/components/Responsive";

const hasVariant = (el: Element, prefix: string) => el.className.split(/\s+/).some((c) => c.startsWith(prefix));
const anyVariant = (el: Element) => /\b(mobile|tablet|laptop|desktop):/.test(el.className);

describe("responsive — data display", () => {
  it("Table: tighter, non-wrapping cells only on requested breakpoints", () => {
    const props = { "aria-label": "T", columns: [{ key: "a", label: "A" }], rows: [{ id: "1", a: "x" }], keyField: "id" };
    const { rerender } = render(<Table {...props} />);
    expect(anyVariant(screen.getByRole("cell"))).toBe(false);
    rerender(<Table {...props} responsive={["m"]} />);
    const cell = screen.getByRole("cell");
    expect(cell).toHaveClass("mobile:whitespace-nowrap");
    expect(hasVariant(cell, "desktop:")).toBe(false);
    rerender(<Table {...props} responsive />);
    expect(screen.getByRole("cell")).toHaveClass("desktop:px-4", "desktop:h-14");
    expect(screen.getByRole("columnheader")).toHaveClass("mobile:px-2.5", "desktop:px-4");
  });

  it("Tabs: touch-sized tabs and a sideways scroller on mobile", () => {
    const tabs = [{ key: "a", title: "A" }, { key: "b", title: "B" }];
    const { rerender } = render(<Tabs tabs={tabs} />);
    expect(anyVariant(screen.getAllByRole("tab")[0])).toBe(false);
    expect(screen.getByRole("tablist").parentElement).not.toHaveClass("mobile:overflow-x-auto");
    rerender(<Tabs tabs={tabs} responsive={["t"]} />);
    expect(screen.getAllByRole("tab")[0]).toHaveClass("tablet:h-10");
    expect(hasVariant(screen.getAllByRole("tab")[0], "mobile:")).toBe(false);
    rerender(<Tabs tabs={tabs} responsive />);
    expect(screen.getAllByRole("tab")[0]).toHaveClass("mobile:h-10", "tablet:h-10");
    expect(screen.getByRole("tablist").parentElement).toHaveClass("mobile:overflow-x-auto");
  });

  it("Avatar / AvatarGroup: large sizes step, the group trims to 3 on mobile", () => {
    const names = ["A B", "C D", "E F", "G H", "I J"];
    render(
      <AvatarGroup max={4} responsive>
        {names.map((n) => (
          <Avatar key={n} name={n} size="lg" />
        ))}
      </AvatarGroup>
    );
    const avatars = screen.getAllByRole("img");
    expect(avatars).toHaveLength(4);
    expect(avatars[0]).toHaveClass("mobile:w-10", "desktop:w-14");
    expect(avatars[2]).not.toHaveClass("mobile:hidden");
    expect(avatars[3]).toHaveClass("mobile:hidden");
    expect(screen.getByText("+1")).toHaveClass("mobile:hidden");
    expect(screen.getByText("+2")).toHaveClass("hidden", "mobile:inline-flex");
  });

  it("AvatarGroup without responsive renders a single count", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="A B" />
        <Avatar name="C D" />
        <Avatar name="E F" />
      </AvatarGroup>
    );
    expect(screen.getByText("+1")).not.toHaveClass("mobile:hidden");
    expect(screen.queryByText("+2")).not.toBeInTheDocument();
  });

  it("Kbd hides on touch breakpoints; Divider flips on mobile", () => {
    render(
      <>
        <Kbd responsive={["m"]}>K</Kbd>
        <Kbd>J</Kbd>
        <Divider orientation="vertical" responsive />
      </>
    );
    expect(screen.getByText("K").closest("kbd")).toHaveClass("mobile:hidden");
    expect(screen.getByText("K").closest("kbd")).not.toHaveClass("tablet:hidden");
    expect(anyVariant(screen.getByText("J").closest("kbd")!)).toBe(false);
    expect(screen.getByRole("separator")).toHaveClass("mobile:h-px", "mobile:w-full");
  });

  it("Chip, Badge, Skeleton, StatCard, Timeline follow the prop and the provider", () => {
    const { container } = render(
      <ResponsiveProvider responsive={["m"]}>
        <Chip onClose={() => {}}>Tag</Chip>
        <Badge content="5" size="xs">
          <span>x</span>
        </Badge>
        <Skeleton data-testid="sk" className="h-4 w-10" />
        <StatCard title="Revenue" value="$1" />
        <Timeline items={[{ id: "1", title: "Step", time: "09:00" }]} />
      </ResponsiveProvider>
    );
    expect(screen.getByText("Tag").parentElement).toHaveClass("mobile:h-7");
    expect(screen.getByRole("button")).toHaveClass("mobile:before:-inset-2.5");
    expect(screen.getByRole("button")).not.toHaveClass("tablet:before:-inset-2.5");
    expect(screen.getByText("5")).toHaveClass("mobile:text-[10px]");
    expect(screen.getByTestId("sk")).toHaveClass("mobile:rounded-lg");
    expect(screen.getByText("$1")).toHaveClass("mobile:text-2xl");
    expect(screen.getByText("$1")).not.toHaveClass("desktop:text-4xl");
    expect(container.querySelector("li")).toHaveClass("mobile:pb-5", "mobile:last:pb-0");
  });
});
