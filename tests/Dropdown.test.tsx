import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "../src/components/Dropdown";

function Menu({ onAction = vi.fn(), isDisabled = false }: { onAction?: (key: string) => void; isDisabled?: boolean }) {
  return (
    <Dropdown isDisabled={isDisabled}>
      <DropdownTrigger>
        <button>Actions</button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions" onAction={onAction}>
        <DropdownItem itemKey="edit">Edit</DropdownItem>
        <DropdownItem itemKey="archive" isDisabled>
          Archive
        </DropdownItem>
        <DropdownItem itemKey="delete">Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

describe("Dropdown", () => {
  it("opens with ArrowDown, moves with arrows (skipping disabled) and activates with Enter", async () => {
    const onAction = vi.fn();
    render(<Menu onAction={onAction} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();

    await userEvent.keyboard("{ArrowDown}");
    const menu = await screen.findByRole("menu");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(menu).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus(); // Archive is disabled
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus(); // wraps
    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledWith("delete");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const onAction = vi.fn();
    render(<Menu onAction={onAction} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    await screen.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(onAction).not.toHaveBeenCalled();
  });

  it("renders disabled items as disabled", async () => {
    render(<Menu />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(await screen.findByRole("menuitem", { name: "Archive" })).toBeDisabled();
  });

  it("does not open when the whole dropdown is disabled", async () => {
    render(<Menu isDisabled />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
