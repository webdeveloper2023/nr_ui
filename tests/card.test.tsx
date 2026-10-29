import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardBody, CardHeader, CardMedia } from "../src/components/Card";

const classesOf = (el: Element | null) => el?.getAttribute("class") ?? "";

describe("Card", () => {
  it("scales its parts with size", () => {
    const { rerender } = render(
      <Card size="sm" data-testid="card">
        <CardHeader title="Title" />
        <CardBody>body</CardBody>
      </Card>
    );
    expect(classesOf(screen.getByText("body"))).toContain("px-3");
    expect(classesOf(screen.getByTestId("card"))).toContain("rounded-2xl");
    rerender(
      <Card size="xl" data-testid="card">
        <CardHeader title="Title" />
        <CardBody>body</CardBody>
      </Card>
    );
    expect(classesOf(screen.getByText("body"))).toContain("px-8");
    expect(classesOf(screen.getByText("Title"))).toContain("text-xl");
    expect(classesOf(screen.getByTestId("card"))).toContain("rounded-[2rem]");
  });

  it("keeps an explicit radius", () => {
    render(<Card size="sm" radius="none" data-testid="card" />);
    expect(classesOf(screen.getByTestId("card"))).toContain("rounded-none");
  });

  it("marks a pressable card as selected", () => {
    render(<Card isPressable isSelected data-testid="card" />);
    const card = screen.getByTestId("card");
    expect(card.getAttribute("aria-pressed")).toBe("true");
    expect(classesOf(card)).toContain("ring-accent");
  });

  it("lays media beside the content when horizontal", () => {
    const { container } = render(
      <Card orientation="horizontal" responsive data-testid="card">
        <CardMedia src="a.jpg" alt="A" />
        <CardBody>body</CardBody>
      </Card>
    );
    expect(classesOf(screen.getByTestId("card"))).toContain("flex-row");
    expect(classesOf(screen.getByTestId("card"))).toContain("mobile:flex-col");
    const media = container.querySelector("[data-slot=media]");
    expect(classesOf(media)).toContain("w-32");
    expect(screen.getByAltText("A")).toBeTruthy();
  });

  it("renders a header start slot", () => {
    render(
      <Card>
        <CardHeader startContent={<span>icon</span>} title="T" />
      </Card>
    );
    expect(screen.getByText("icon")).toBeTruthy();
  });
});
