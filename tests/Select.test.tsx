import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, type SelectItemData } from "../src/components/Select";
import { Modal } from "../src/components/Modal";

const items: SelectItemData[] = [
  { key: "apricot", label: "Apricot" },
  { key: "banana", label: "Banana", isDisabled: true },
  { key: "cherry", label: "Cherry" },
];

const activeOption = (combobox: HTMLElement) => {
  const id = combobox.getAttribute("aria-activedescendant");
  return id ? document.getElementById(id) : null;
};

describe("Select", () => {
  it("opens with ArrowDown, skips disabled options and selects with Enter", async () => {
    const onSelectionChange = vi.fn();
    render(<Select label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
    const combobox = screen.getByRole("combobox", { name: "Fruit" });
    combobox.focus();

    await userEvent.keyboard("{ArrowDown}");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(activeOption(combobox)).toHaveTextContent("Apricot");

    await userEvent.keyboard("{ArrowDown}");
    expect(activeOption(combobox)).toHaveTextContent("Cherry"); // Banana is disabled

    await userEvent.keyboard("{ArrowUp}");
    expect(activeOption(combobox)).toHaveTextContent("Apricot");

    await userEvent.keyboard("{End}{Enter}");
    expect(onSelectionChange).toHaveBeenCalledWith("cherry");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(combobox).toHaveTextContent("Cherry");
    expect(combobox).toHaveFocus();
  });

  it("closes with Escape without changing the value", async () => {
    const onSelectionChange = vi.fn();
    render(<Select label="Fruit" items={items} defaultSelectedKey="apricot" onSelectionChange={onSelectionChange} />);
    const combobox = screen.getByRole("combobox", { name: "Fruit" });
    combobox.focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Escape}");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(combobox).toHaveTextContent("Apricot");
  });

  it("ignores clicks on disabled options", async () => {
    const onSelectionChange = vi.fn();
    render(<Select label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Fruit" }));
    const banana = screen.getByRole("option", { name: "Banana" });
    expect(banana).toHaveAttribute("aria-disabled", "true");
    banana.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("option", { name: "Cherry" }));
    expect(onSelectionChange).toHaveBeenCalledWith("cherry");
  });

  it("does not open when disabled", async () => {
    render(<Select label="Fruit" items={items} isDisabled />);
    const combobox = screen.getByRole("combobox", { name: "Fruit" });
    expect(combobox).toBeDisabled();
    await userEvent.click(combobox);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("Escape inside a Modal closes only the Select", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} aria-label="Dialog">
        <Select label="Fruit" items={items} />
      </Modal>
    );
    const combobox = screen.getByRole("combobox", { name: "Fruit" });
    await waitFor(() => expect(combobox).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    expect(combobox).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(combobox).toHaveAttribute("aria-expanded", "false");
    expect(onClose).not.toHaveBeenCalled();
  });
});
