import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, type TableColumn } from "../src/components/Table";

type Row = { id: string; name: string; age: number };

const columns: TableColumn<Row>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "age", label: "Age", sortable: true },
];
const rows: Row[] = [
  { id: "1", name: "Bobur", age: 31 },
  { id: "2", name: "Aziza", age: 24 },
  { id: "3", name: "Dilnoza", age: 28 },
];

const columnHeader = (name: string) => screen.getByRole("columnheader", { name: new RegExp(`^${name}`) });

describe("Table", () => {
  // Regression: sorting was an onClick on <th>, unreachable from the keyboard
  it("sorts from the keyboard with a header button and updates aria-sort", async () => {
    render(<Table aria-label="People" columns={columns} rows={rows} keyField="id" />);
    const nameHeader = columnHeader("Name");
    expect(nameHeader).not.toHaveAttribute("aria-sort");

    await userEvent.tab();
    const sortButton = within(nameHeader).getByRole("button", { name: "Name" });
    expect(sortButton).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Aziza");

    await userEvent.keyboard(" ");
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Dilnoza");

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(columnHeader("Age")).toHaveAttribute("aria-sort", "ascending");
    expect(nameHeader).not.toHaveAttribute("aria-sort");
  });

  it("reports sort changes in controlled mode without sorting locally", async () => {
    const onSortChange = vi.fn();
    render(
      <Table
        aria-label="People"
        columns={columns}
        rows={rows}
        keyField="id"
        sortDescriptor={{ column: "age", direction: "ascending" }}
        onSortChange={onSortChange}
      />
    );
    await userEvent.click(within(columnHeader("Age")).getByRole("button"));
    expect(onSortChange).toHaveBeenCalledWith({ column: "age", direction: "descending" });
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Bobur"); // order unchanged
  });

  it("does not render a button for non-sortable columns", () => {
    render(<Table aria-label="People" columns={[{ key: "name", label: "Name" }]} rows={rows} keyField="id" />);
    expect(within(columnHeader("Name")).queryByRole("button")).not.toBeInTheDocument();
  });

  it("selects rows with checkboxes, the keyboard and select-all, skipping disabled rows", async () => {
    const onSelectionChange = vi.fn();
    render(
      <Table
        aria-label="People"
        columns={columns}
        rows={rows}
        keyField="id"
        selectionMode="multiple"
        disabledKeys={["3"]}
        onSelectionChange={onSelectionChange}
      />
    );
    const [, first, second, third] = screen.getAllByRole("row").filter((r) => r.getAttribute("aria-hidden") !== "true");

    await userEvent.click(within(first).getByRole("checkbox"));
    expect(first).toHaveAttribute("aria-selected", "true");
    expect([...onSelectionChange.mock.lastCall![0]]).toEqual(["1"]);

    second.focus();
    await userEvent.keyboard(" ");
    expect(second).toHaveAttribute("aria-selected", "true");

    await userEvent.click(within(third).getByRole("checkbox"));
    expect(third).toHaveAttribute("aria-selected", "false"); // disabled

    await userEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect([...onSelectionChange.mock.lastCall![0]]).toEqual([]); // all selectable were selected → clear
    await userEvent.click(screen.getByRole("checkbox", { name: "Select all rows" }));
    expect([...onSelectionChange.mock.lastCall![0]].sort()).toEqual(["1", "2"]);
  });

  it("single selection keeps only one row selected", async () => {
    render(<Table aria-label="People" columns={columns} rows={rows} keyField="id" selectionMode="single" />);
    const radios = screen.getAllByRole("radio");
    await userEvent.click(radios[0]);
    await userEvent.click(radios[1]);
    expect(radios[0]).toHaveAttribute("aria-checked", "false");
    expect(radios[1]).toHaveAttribute("aria-checked", "true");
  });

  it("shows the empty state", () => {
    render(<Table aria-label="People" columns={columns} rows={[]} keyField="id" />);
    expect(screen.getByText("No rows to display.")).toBeInTheDocument();
  });
});
