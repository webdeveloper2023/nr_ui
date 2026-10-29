import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "../src/components/Alert";
import { Spinner } from "../src/components/Spinner";
import { CircularProgress, Progress } from "../src/components/Progress";
import { ToastProvider, useToast } from "../src/components/Toast";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "../src/components/Modal";
import { Tooltip } from "../src/components/Tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/Popover";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "../src/components/Dropdown";
import { ResponsiveProvider } from "../src/components/Responsive";

const classesOf = (el: Element) => el.getAttribute("class") ?? "";
const hasVariant = (el: Element, variant: "mobile" | "tablet" | "laptop" | "desktop") => classesOf(el).split(/\s+/).some((c) => c.startsWith(`${variant}:`));

function OpenModal(props: Partial<React.ComponentProps<typeof Modal>>) {
  return (
    <Modal isOpen onClose={() => {}} {...props}>
      <ModalContent>
        <ModalHeader>Title</ModalHeader>
        <ModalBody>Body</ModalBody>
        <ModalFooter>
          <button>Cancel</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

describe("responsive overlays and feedback", () => {
  it("Modal: no breakpoint classes without responsive", () => {
    render(<OpenModal />);
    const dialog = screen.getByRole("dialog");
    expect(hasVariant(dialog, "mobile")).toBe(false);
    expect(hasVariant(dialog, "tablet")).toBe(false);
    expect(hasVariant(screen.getByText("Title"), "desktop")).toBe(false);
  });

  it("Modal: responsive=['m'] makes a bottom sheet on mobile only", () => {
    render(<OpenModal responsive={["m"]} />);
    const dialog = screen.getByRole("dialog");
    expect(classesOf(dialog)).toContain("mobile:rounded-b-none");
    expect(classesOf(dialog)).toContain("mobile:max-h-[90dvh]");
    expect(hasVariant(dialog, "tablet")).toBe(false);
    expect(classesOf(screen.getByText("Cancel").parentElement!)).toContain("mobile:flex-col-reverse");
    expect(hasVariant(screen.getByText("Title"), "desktop")).toBe(false);
  });

  it("Modal: responsive applies every breakpoint, but not to size full", () => {
    const { unmount } = render(<OpenModal responsive />);
    expect(classesOf(screen.getByRole("dialog"))).toContain("tablet:max-w-[calc(100vw-4rem)]");
    expect(classesOf(screen.getByText("Title"))).toContain("desktop:px-8");
    unmount();
    render(<OpenModal responsive size="full" />);
    expect(hasVariant(screen.getByRole("dialog"), "mobile")).toBe(false);
  });

  it("Modal inherits from ResponsiveProvider; its own prop wins", () => {
    const { unmount } = render(
      <ResponsiveProvider responsive="d">
        <OpenModal />
      </ResponsiveProvider>
    );
    expect(classesOf(screen.getByText("Title"))).toContain("desktop:px-8");
    expect(hasVariant(screen.getByRole("dialog"), "mobile")).toBe(false);
    unmount();
    render(
      <ResponsiveProvider>
        <OpenModal responsive={false} />
      </ResponsiveProvider>
    );
    expect(hasVariant(screen.getByText("Title"), "desktop")).toBe(false);
  });

  it("Dropdown: touch-sized items and hidden shortcuts only on the requested breakpoints", async () => {
    render(
      <Dropdown responsive={["m"]}>
        <DropdownTrigger>
          <button>Menu</button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions">
          <DropdownItem itemKey="copy" shortcut="⌘C">
            Copy
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    const item = await screen.findByRole("menuitem", { name: /Copy/ });
    expect(classesOf(item)).toContain("mobile:min-h-11");
    expect(hasVariant(item, "tablet")).toBe(false);
    expect(classesOf(screen.getByText("⌘C"))).toContain("mobile:hidden");
    expect(classesOf(screen.getByRole("menu"))).toContain("mobile:max-w-[calc(100vw-1.5rem)]");
  });

  it("Dropdown: no breakpoint classes without responsive", async () => {
    render(
      <Dropdown>
        <DropdownTrigger>
          <button>Menu</button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions">
          <DropdownItem itemKey="copy">Copy</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(hasVariant(await screen.findByRole("menuitem"), "mobile")).toBe(false);
    expect(hasVariant(screen.getByRole("menu"), "mobile")).toBe(false);
  });

  it("Popover: mobile sheet classes only with responsive", () => {
    const { unmount } = render(
      <Popover defaultOpen responsive={["m"]}>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent>Panel</PopoverContent>
      </Popover>
    );
    const panel = screen.getByRole("dialog");
    expect(classesOf(panel)).toContain("mobile:!left-3");
    expect(hasVariant(panel, "tablet")).toBe(false);
    unmount();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>
          <button>Open</button>
        </PopoverTrigger>
        <PopoverContent>Panel</PopoverContent>
      </Popover>
    );
    expect(hasVariant(screen.getByRole("dialog"), "mobile")).toBe(false);
  });

  it("Tooltip: readable text on mobile, wider on desktop", () => {
    render(
      <Tooltip content="Hint" defaultOpen responsive={["m", "d"]}>
        <button>Trigger</button>
      </Tooltip>
    );
    const tip = screen.getByRole("tooltip");
    expect(classesOf(tip)).toContain("mobile:text-sm");
    expect(classesOf(tip)).toContain("desktop:max-w-sm");
    expect(hasVariant(tip, "tablet")).toBe(false);
  });

  it("ToastProvider: full-width bottom toasts on mobile", async () => {
    function Trigger() {
      const { addToast } = useToast();
      return <button onClick={() => addToast({ title: "Saved", timeout: 0 })}>Toast</button>;
    }
    render(
      <ToastProvider responsive="m" placement="top-center">
        <Trigger />
      </ToastProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: "Toast" }));
    const toast = (await screen.findByText("Saved")).closest("[role=status]")!;
    expect(classesOf(toast)).toContain("mobile:w-full");
    expect(classesOf(toast.parentElement!)).toContain("mobile:bottom-[max(0.75rem,env(safe-area-inset-bottom))]");
    expect(hasVariant(toast, "desktop")).toBe(false);
  });

  it("Alert: the action wraps under the text on mobile only", () => {
    const { container, unmount } = render(<Alert responsive="m" title="Update" action={<button>Go</button>} />);
    expect(classesOf(container.firstElementChild!)).toContain("mobile:flex-wrap");
    expect(classesOf(screen.getByText("Go").parentElement!)).toContain("mobile:basis-full");
    expect(hasVariant(container.firstElementChild!, "desktop")).toBe(false);
    unmount();
    const plain = render(<Alert title="Update" />);
    expect(hasVariant(plain.container.firstElementChild!, "mobile")).toBe(false);
  });

  it("Spinner and Progress: size steps only on the requested breakpoints", () => {
    render(
      <>
        <Spinner responsive="d" size="lg" label="Loading" />
        <Progress responsive="m" size="xs" value={20} />
        <CircularProgress size="xl" value={50} />
      </>
    );
    expect(classesOf(screen.getByRole("status").querySelector("svg")!)).toContain("desktop:w-10");
    const [bar, ring] = screen.getAllByRole("progressbar");
    expect(classesOf(bar.querySelector(".bg-default")!)).toContain("mobile:h-1");
    expect(classesOf(bar.querySelector(".bg-default")!)).not.toContain("desktop:");
    expect(ring.querySelector("svg")).toHaveAttribute("width", "96");
  });
});
