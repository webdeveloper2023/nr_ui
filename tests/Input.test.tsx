import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../src/components/Input";

describe("Input", () => {
  it("types into an uncontrolled input and reports the value", async () => {
    const onValueChange = vi.fn();
    render(<Input aria-label="Name" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByLabelText("Name"), "Ali");
    expect(screen.getByLabelText("Name")).toHaveValue("Ali");
    expect(onValueChange).toHaveBeenLastCalledWith("Ali");
  });

  it("clears an uncontrolled input, fires onChange / onValueChange / onClear and keeps focus", async () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    const onClear = vi.fn();
    render(<Input aria-label="Name" defaultValue="Ali" isClearable onChange={onChange} onValueChange={onValueChange} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    const input = screen.getByLabelText("Name");
    expect(input).toHaveValue("");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe("");
    expect(onValueChange).toHaveBeenCalledWith("");
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveFocus();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  // Regression: clearing used to call only onValueChange, so value + onChange inputs never emptied
  it("clears a value + onChange controlled input", async () => {
    function Controlled() {
      const [value, setValue] = useState("Ali");
      return <Input aria-label="Name" isClearable value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("clears a value + onValueChange controlled input", async () => {
    function Controlled() {
      const [value, setValue] = useState("Ali");
      return <Input aria-label="Name" isClearable value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await userEvent.type(screen.getByLabelText("Name"), "m");
    expect(screen.getByLabelText("Name")).toHaveValue("Alim");
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("keeps a controlled value when the parent ignores changes", async () => {
    render(<Input aria-label="Name" isClearable value="Fixed" onChange={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByLabelText("Name")).toHaveValue("Fixed");
  });

  it("hides the clear button when read-only", () => {
    render(<Input aria-label="Name" defaultValue="Ali" isClearable isReadOnly />);
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });
});
