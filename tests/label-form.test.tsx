import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../src/components/Checkbox";
import { Form } from "../src/components/Form";
import { Input } from "../src/components/Input";
import { Label } from "../src/components/Label";
import { PieChart } from "../src/components/PieChart";
import { Select } from "../src/components/Select";
import { Textarea } from "../src/components/Textarea";

describe("Label", () => {
  it("shows required / optional markers, a tooltip trigger and an end slot", () => {
    render(
      <>
        <Label htmlFor="a" isRequired tooltip="Help" endContent={<a href="#x">Forgot?</a>}>
          Password
        </Label>
        <Label htmlFor="b" isOptional>
          Website
        </Label>
        <Label htmlFor="c" isRequired necessityIndicator="text">
          Company
        </Label>
      </>
    );
    expect(screen.getByText("Password").textContent).toBe("Password*");
    expect(screen.getByText("Optional")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More info" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Forgot?" })).toBeInTheDocument();
  });
});

describe("inside and floating labels", () => {
  it("keeps the label linked and marks the box as filled once typed", async () => {
    render(<Input label="Email" labelPlacement="floating" placeholder="you@example.com" />);
    const input = screen.getByLabelText("Email");
    const box = input.closest("[class*='group/field']")!;
    expect(box).not.toHaveAttribute("data-filled");
    await userEvent.type(input, "a");
    expect(box).toHaveAttribute("data-filled");
    expect(input).toHaveAttribute("placeholder", "you@example.com");
  });

  it("works for Textarea and Select", () => {
    render(
      <>
        <Textarea label="Note" labelPlacement="inside" />
        <Select label="City" labelPlacement="floating" items={[{ key: "t", label: "Tashkent" }]} />
      </>
    );
    expect(screen.getByLabelText("Note").tagName).toBe("TEXTAREA");
    expect(screen.getByRole("combobox")).toHaveTextContent("City");
  });
});

describe("Form", () => {
  it("sets defaults for every field and lets a field override them", () => {
    render(
      <Form labelPlacement="floating" showOptional>
        <Input label="Name" isRequired />
        <Input label="Nickname" labelPlacement="outside" />
      </Form>
    );
    // The label sits on the border: a real <label> plus a hidden legend that opens the gap
    const floating = screen.getAllByText("Name").map((n) => n.closest("label")).find(Boolean)!;
    expect(floating.className).toContain("absolute");
    expect(floating.closest("[class*='group/field']")!.querySelector("fieldset legend")).toHaveTextContent("Name");
    const outside = screen.getByText("Nickname").closest("label")!;
    expect(outside.className).not.toContain("absolute");
    expect(screen.getByText("Optional")).toBeInTheDocument(); // Nickname is not required
  });

  it("disables every field inside", () => {
    render(
      <Form isDisabled>
        <Input label="Name" />
        <Textarea label="Note" />
        <Checkbox>Agree</Checkbox>
      </Form>
    );
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByLabelText("Note")).toBeDisabled();
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("hands the named values to onValues on submit, Select included", async () => {
    const onValues = vi.fn();
    render(
      <Form onValues={onValues}>
        <Input name="email" label="Email" defaultValue="a@b.uz" />
        <Select name="plan" label="Plan" defaultSelectedKey="pro" items={[{ key: "pro", label: "Pro" }]} />
        <Checkbox name="tags" value="x" defaultSelected>X</Checkbox>
        <Checkbox name="tags" value="y" defaultSelected>Y</Checkbox>
        <button type="submit">Send</button>
      </Form>
    );
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onValues).toHaveBeenCalledWith({ email: "a@b.uz", plan: "pro", tags: ["x", "y"] }, expect.anything());
  });
});

describe("pie variants", () => {
  let spy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    spy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0, y: 0, top: 0, left: 0, right: 800, bottom: 300, width: 800, height: 300, toJSON: () => ({}),
    } as DOMRect);
  });
  afterEach(() => spy.mockRestore());

  const data = [
    { key: "a", label: "A", value: 50 },
    { key: "b", label: "B", value: 30 },
    { key: "c", label: "C", value: 20 },
  ];

  it("rounds slice corners with a stroke of twice the radius", () => {
    const { container } = render(<PieChart data={data} cornerRadius={8} animate={false} showLegend={false} />);
    const slices = container.querySelectorAll("svg path");
    expect(slices).toHaveLength(3);
    expect(slices[0]).toHaveAttribute("stroke-width", "16");
  });

  it.each(["semi", "polar", "radial", "donut"] as const)("draws the %s variant", (variant) => {
    const { container } = render(<PieChart data={data} variant={variant} animate={false} showLegend={false} />);
    // radial draws a track under every ring
    expect(container.querySelectorAll("svg path").length).toBe(variant === "radial" ? 6 : 3);
  });

  it("writes shares inside and names outside", () => {
    const { container, rerender } = render(<PieChart data={data} labels="inside" animate={false} showLegend={false} />);
    const svgText = () => [...container.querySelectorAll("svg text")].map((t) => t.textContent);
    expect(svgText()).toEqual(["50%", "30%", "20%"]);
    rerender(<PieChart data={data} labels="outside" animate={false} showLegend={false} />);
    expect(svgText()).toEqual(["A 50%", "B 30%", "C 20%"]);
  });
});
