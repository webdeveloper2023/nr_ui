import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountInput } from "../src/components/AmountInput";
import { LocaleProvider } from "../src/components/LocaleProvider";

describe("AmountInput", () => {
  it("groups digits while typing and spells the amount in words", async () => {
    const onValueChange = vi.fn();
    render(<AmountInput label="Amount" wordsLocale="uz" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Amount");
    await userEvent.type(input, "1250000");
    expect(input).toHaveValue("1 250 000");
    expect(screen.getByText("Bir million ikki yuz ellik ming so'm")).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith(1250000, {
      formatted: "1 250 000",
      words: "Bir million ikki yuz ellik ming so'm",
      isValid: true,
    });
    // Words are announced as the field description
    expect(input).toHaveAccessibleDescription("Bir million ikki yuz ellik ming so'm");
  });

  it("follows the LocaleProvider language", async () => {
    render(
      <LocaleProvider locale="ru">
        <AmountInput label="Сумма" />
      </LocaleProvider>
    );
    await userEvent.type(screen.getByLabelText("Сумма"), "2000");
    expect(screen.getByText("Две тысячи сумов")).toBeInTheDocument();
    expect(screen.getByText("сум")).toBeInTheDocument();
  });

  it("ignores letters and keeps the caret after the typed digit", async () => {
    render(<AmountInput label="Amount" currency="USD" />);
    const input = screen.getByLabelText<HTMLInputElement>("Amount");
    await userEvent.type(input, "12a34");
    expect(input).toHaveValue("1,234");
    // Insert a digit in the middle: 1,2|34 → 1,25|34 → "12,534"
    input.setSelectionRange(3, 3);
    await userEvent.type(input, "5", { initialSelectionStart: 3, initialSelectionEnd: 3 });
    expect(input).toHaveValue("12,534");
    expect(input.selectionStart).toBe(4);
  });

  it("allows decimals for USD and pads cents on blur", async () => {
    const onValueChange = vi.fn();
    render(<AmountInput label="Amount" currency="USD" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Amount");
    await userEvent.type(input, "21.5");
    expect(input).toHaveValue("21.5");
    expect(onValueChange).toHaveBeenLastCalledWith(21.5, expect.objectContaining({ words: "Twenty-one dollars 50 cents" }));
    await userEvent.tab();
    expect(input).toHaveValue("21.50");
    await userEvent.type(input, "999");
    expect(input).toHaveValue("21.50"); // only 2 decimals
  });

  it("does not accept decimals for UZS", async () => {
    render(<AmountInput label="Amount" wordsLocale="uz" />);
    const input = screen.getByLabelText("Amount");
    await userEvent.type(input, "15,7");
    expect(input).toHaveValue("157");
  });

  it("removes the digit behind a group separator on Backspace", async () => {
    render(<AmountInput label="Amount" wordsLocale="uz" defaultValue={1250} />);
    const input = screen.getByLabelText<HTMLInputElement>("Amount");
    expect(input).toHaveValue("1 250");
    await userEvent.type(input, "{Backspace}", { initialSelectionStart: 2, initialSelectionEnd: 2 });
    expect(input).toHaveValue("250");
  });

  it("works controlled and can be cleared", async () => {
    function Controlled() {
      const [value, setValue] = useState<number | null>(500000);
      return (
        <>
          <AmountInput label="Amount" wordsLocale="uz" isClearable value={value} onValueChange={setValue} />
          <button onClick={() => setValue(75000)}>Set</button>
          <output>{String(value)}</output>
        </>
      );
    }
    render(<Controlled />);
    const input = screen.getByLabelText("Amount");
    expect(input).toHaveValue("500 000");
    await userEvent.click(screen.getByRole("button", { name: "Set" }));
    expect(input).toHaveValue("75 000");
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(input).toHaveValue("");
    expect(screen.getByRole("status")).toHaveTextContent("null");
  });

  it("checks min / max after leaving the field", async () => {
    render(<AmountInput label="Amount" wordsLocale="uz" min={1000} max={5000000} />);
    const input = screen.getByLabelText("Amount");
    await userEvent.type(input, "500");
    expect(input).not.toHaveAttribute("aria-invalid");
    await userEvent.tab();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Minimum amount is 1 000")).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "9000000");
    expect(screen.getByText("Maximum amount is 5 000 000")).toBeInTheDocument();
  });

  it("fills the amount from presets", async () => {
    const onValueChange = vi.fn();
    render(<AmountInput label="Amount" wordsLocale="uz" presets={[50000, 100000]} onValueChange={onValueChange} />);
    const preset = screen.getByRole("button", { name: /100 000/ });
    await userEvent.click(preset);
    expect(screen.getByLabelText("Amount")).toHaveValue("100 000");
    expect(preset).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(100000, expect.objectContaining({ words: "Bir yuz ming so'm" }));
  });

  it("limits the number of digits", async () => {
    render(<AmountInput label="Amount" maxDigits={4} />);
    const input = screen.getByLabelText("Amount");
    await userEvent.type(input, "123456");
    expect(input).toHaveValue("1,234");
  });
});
