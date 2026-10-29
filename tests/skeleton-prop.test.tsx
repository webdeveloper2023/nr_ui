import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, Card, CardBody, Chip, Table, useSkeleton } from "../src/components";

function Probe() {
  return <span>{useSkeleton() ? "inherited" : "own"}</span>;
}

describe("skeleton prop", () => {
  it("renders exactly as before without it", () => {
    const { container } = render(<Button>Save</Button>);
    expect(container.firstElementChild?.tagName).toBe("BUTTON");
    expect(container.querySelector("[data-skeleton]")).toBeNull();
  });

  it("marks the component busy, inert and in the skeleton state", () => {
    const { container } = render(<Chip skeleton>New</Chip>);
    const holder = container.querySelector("[data-skeleton]") as HTMLElement;
    expect(holder).not.toBeNull();
    expect(holder.getAttribute("aria-busy")).toBe("true");
    expect(holder.hasAttribute("inert")).toBe(true);
    expect(holder.style.display).toBe("contents");
    expect(holder.querySelector("span")).toHaveTextContent("New");
  });

  it("passes the state to components inside", () => {
    render(
      <Card skeleton>
        <CardBody>
          <Probe />
        </CardBody>
      </Card>
    );
    expect(screen.getByText("inherited")).toBeInTheDocument();
  });

  it("draws placeholder rows in a table without data", () => {
    const { container } = render(<Table aria-label="Orders" keyField="id" rows={[]} skeleton columns={[{ key: "id", label: "ID" }]} />);
    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(container.querySelector("[data-skeleton]")).not.toBeNull();
    expect(screen.queryByText("No rows to display.")).toBeNull();
  });

  it("keeps table cells as bars when rows are there", () => {
    const { container } = render(
      <Table aria-label="Orders" keyField="id" rows={[{ id: "#1" }]} skeleton columns={[{ key: "id", label: "ID" }]} />
    );
    expect(container.querySelector("tbody td span")).toHaveTextContent("#1");
  });
});
