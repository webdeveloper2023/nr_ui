import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FileUpload } from "../src/components/FileUpload";

const file = (name: string, type = "text/plain", size = 10) => new File(["x".repeat(size)], name, { type });
const pick = (container: HTMLElement, files: File[]) => {
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(input, { target: { files } });
  return input;
};

describe("FileUpload", () => {
  it("renders every layout", () => {
    for (const layout of ["dropzone", "inline", "button", "avatar", "gallery"] as const) {
      const { container, unmount } = render(<FileUpload layout={layout} />);
      expect(container.querySelector('input[type="file"]')).not.toBeNull();
      unmount();
    }
  });

  it("scales with size", () => {
    const { container, rerender } = render(<FileUpload size="sm" />);
    expect(container.innerHTML).toContain("py-5");
    rerender(<FileUpload size="xl" />);
    expect(container.innerHTML).toContain("py-20");
  });

  it("lists picked files and removes them", () => {
    const { container } = render(<FileUpload layout="inline" />);
    pick(container, [file("a.txt"), file("b.txt")]);
    expect(screen.getByText("a.txt")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Remove a.txt"));
    expect(screen.queryByText("a.txt")).toBeNull();
    expect(screen.getByText("b.txt")).toBeTruthy();
  });

  it("stops at maxFiles and hides the gallery add tile", () => {
    const { container } = render(<FileUpload layout="gallery" maxFiles={2} />);
    pick(container, [file("1.txt"), file("2.txt"), file("3.txt")]);
    expect(screen.queryByText("3.txt")).toBeNull();
    expect(screen.getByText("You can add up to 2 files")).toBeTruthy();
    expect(screen.queryByLabelText("Add")).toBeNull();
  });

  it("avatar keeps one image file", () => {
    const { container } = render(<FileUpload layout="avatar" />);
    const input = pick(container, [file("me.png", "image/png")]);
    expect(input.multiple).toBe(false);
    expect(input.accept).toBe("image/*");
    expect(screen.getByText("me.png")).toBeTruthy();
  });

  it("rejects files above maxSizeMB", () => {
    const { container } = render(<FileUpload maxSizeMB={0.000001} />);
    pick(container, [file("big.txt", "text/plain", 100)]);
    expect(screen.getByText(/big\.txt — larger than/)).toBeTruthy();
  });
});
