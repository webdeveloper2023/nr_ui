import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, type TabItem } from "../src/components/Tabs";

const tabs: TabItem[] = [
  { key: "photos", title: "Photos" },
  { key: "music", title: "Music", isDisabled: true },
  { key: "videos", title: "Videos" },
];

const panel = (key: string) => <p>{key} content</p>;

describe("Tabs", () => {
  it("moves with arrow keys, Home and End, skipping disabled tabs", async () => {
    const onSelectionChange = vi.fn();
    render(
      <Tabs aria-label="Media" tabs={tabs} onSelectionChange={onSelectionChange}>
        {panel}
      </Tabs>
    );
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Photos" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Videos" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Videos" })).toHaveAttribute("aria-selected", "true");
    expect(onSelectionChange).toHaveBeenLastCalledWith("videos");

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Photos" })).toHaveFocus(); // wraps

    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Videos" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Photos" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("photos content");
  });

  it("uses Up/Down in vertical tabs", async () => {
    render(
      <Tabs tabs={tabs} isVertical>
        {panel}
      </Tabs>
    );
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Videos" })).toHaveFocus();
  });

  // Regression: tabs and the panel were not linked with ids
  it("links each tab to its panel", () => {
    render(<Tabs tabs={tabs}>{panel}</Tabs>);
    const selected = screen.getByRole("tab", { name: "Photos" });
    const tabpanel = screen.getByRole("tabpanel", { name: "Photos" });
    expect(selected).toHaveAttribute("aria-controls", tabpanel.id);
    expect(tabpanel).toHaveAttribute("aria-labelledby", selected.id);
    const ids = screen.getAllByRole("tab").map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives separate Tabs instances unique ids", () => {
    render(
      <>
        <Tabs tabs={tabs}>{panel}</Tabs>
        <Tabs tabs={tabs}>{panel}</Tabs>
      </>
    );
    const ids = screen.getAllByRole("tab").map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Regression: a disabled initial tab left the tablist with no Tab stop
  it("stays keyboard-reachable when the initially selected tab is disabled", async () => {
    render(
      <Tabs tabs={tabs} defaultSelectedKey="music">
        {panel}
      </Tabs>
    );
    await userEvent.tab();
    const photos = screen.getByRole("tab", { name: "Photos" });
    expect(photos).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Videos" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("videos content");
  });

  it("selects the first enabled tab by default", () => {
    render(<Tabs tabs={[{ key: "a", title: "A", isDisabled: true }, ...tabs]}>{panel}</Tabs>);
    expect(screen.getByRole("tab", { name: "Photos" })).toHaveAttribute("aria-selected", "true");
  });
});
