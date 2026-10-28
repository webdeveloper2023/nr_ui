import { useState, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../src/components/Modal";

function Harness({ children, ...props }: { children?: ReactNode } & Partial<React.ComponentProps<typeof Modal>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal isOpen={open} onClose={() => setOpen(false)} {...props}>
        {children}
      </Modal>
    </>
  );
}

const openModal = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  return screen.findByRole("dialog");
};

describe("Modal", () => {
  it("opens, closes with Escape and returns focus to the trigger", async () => {
    render(
      <Harness>
        <ModalContent>
          <ModalHeader>Edit profile</ModalHeader>
          <ModalBody>
            <input aria-label="Name" />
          </ModalBody>
        </ModalContent>
      </Harness>
    );
    const dialog = await openModal();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    // First field gets focus (the close button is skipped)
    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveFocus());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });

  it("closes with the close button and on backdrop click", async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} aria-label="Dialog">
        <p>Body</p>
      </Modal>
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.mouseDown(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(2);
    // Clicks inside the dialog do not close it
    fireEvent.mouseDown(screen.getByText("Body"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("does not close with Escape when keyboard dismiss is disabled", async () => {
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose} aria-label="Dialog" isKeyboardDismissDisabled />);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  // Regression: the dialog had no accessible name
  it("is named by its ModalHeader", async () => {
    render(
      <Harness>
        <ModalContent>
          <ModalHeader>Delete project</ModalHeader>
          <ModalBody>Are you sure?</ModalBody>
        </ModalContent>
      </Harness>
    );
    await openModal();
    expect(screen.getByRole("dialog", { name: "Delete project" })).toBeInTheDocument();
  });

  it("respects a custom ModalHeader id", async () => {
    render(
      <Modal isOpen onClose={() => {}}>
        <ModalHeader id="my-title">Settings</ModalHeader>
      </Modal>
    );
    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveAttribute("aria-labelledby", "my-title");
  });

  it("accepts aria-label when there is no header", () => {
    render(<Modal isOpen onClose={() => {}} aria-label="Image preview" />);
    expect(screen.getByRole("dialog", { name: "Image preview" })).toBeInTheDocument();
  });

  it("wraps Tab and Shift+Tab inside the dialog", async () => {
    render(
      <Harness>
        <ModalContent>
          <ModalHeader>Form</ModalHeader>
          <ModalBody>
            <input aria-label="First" />
            <button style={{ display: "none" }}>Hidden</button>
            <button hidden>Hidden attr</button>
          </ModalBody>
          <ModalFooter>
            <button>Save</button>
          </ModalFooter>
        </ModalContent>
      </Harness>
    );
    await openModal();
    const first = screen.getByLabelText("First");
    const save = screen.getByRole("button", { name: "Save" });
    const close = screen.getByRole("button", { name: "Close" });
    await waitFor(() => expect(first).toHaveFocus());

    await userEvent.tab();
    expect(save).toHaveFocus(); // hidden buttons are skipped
    // DOM order is close → First → Save: Tab on the last element wraps to the first, Shift+Tab wraps back
    await userEvent.tab();
    expect(close).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(save).toHaveFocus();
  });

  // Regression: a hidden last element counted as the trap edge, so Tab left the dialog
  it("ignores hidden elements at the edge of the focus trap", async () => {
    render(
      <Harness>
        <ModalContent>
          <ModalHeader>Form</ModalHeader>
          <ModalFooter>
            <button>Save</button>
            <button hidden>Ghost</button>
            <span style={{ display: "none" }}>
              <button>Nested ghost</button>
            </span>
          </ModalFooter>
        </ModalContent>
      </Harness>
    );
    await openModal();
    const save = screen.getByRole("button", { name: "Save" });
    await waitFor(() => expect(save).toHaveFocus());
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
  });

  // Regression: with nothing focusable, Tab used to escape the dialog
  it("keeps focus on the dialog when it has nothing focusable", async () => {
    render(
      <Harness hideCloseButton aria-label="Notice">
        <p>Plain text only</p>
      </Harness>
    );
    const dialog = await openModal();
    await waitFor(() => expect(dialog).toHaveFocus());
    await userEvent.tab();
    expect(dialog).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(dialog).toHaveFocus();
  });

  // Regression: every open modal reacted to Escape, closing the whole stack at once
  it("lets only the top-most nested modal handle the keyboard", async () => {
    const outerClose = vi.fn();
    function Nested() {
      const [inner, setInner] = useState(false);
      return (
        <Modal isOpen onClose={outerClose} aria-label="Outer">
          <button onClick={() => setInner(true)}>Open inner</button>
          <Modal isOpen={inner} onClose={() => setInner(false)} aria-label="Inner">
            <button>Inner action</button>
          </Modal>
        </Modal>
      );
    }
    render(<Nested />);
    await userEvent.click(screen.getByRole("button", { name: "Open inner" }));
    await screen.findByRole("dialog", { name: "Inner" });
    await waitFor(() => expect(screen.getByRole("button", { name: "Inner action" })).toHaveFocus());

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Inner" })).not.toBeInTheDocument());
    expect(outerClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Outer" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(outerClose).toHaveBeenCalledTimes(1);
  });
});
