import React, { useState, useCallback, type ReactNode } from "react";

type TableColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
type TableLayout = "auto" | "fixed";
type SelectionMode = "none" | "single" | "multiple";
type SortDirection = "ascending" | "descending";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: "start" | "center" | "end";
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  rows: T[];
  keyField: string;
  color?: TableColor;
  layout?: TableLayout;
  isStriped?: boolean;
  isCompact?: boolean;
  isHeaderSticky?: boolean;
  selectionMode?: SelectionMode;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  className?: string;
  emptyContent?: ReactNode;
}

const colorHighlight: Record<TableColor, { row: string; header: string }> = {
  default: {
    row: "bg-default-100",
    header: "bg-default-50 text-default-600",
  },
  primary: {
    row: "bg-primary-50",
    header: "bg-primary-50 text-primary-600",
  },
  secondary: {
    row: "bg-primary-50/50",
    header: "bg-primary-50 text-primary-400",
  },
  success: {
    row: "bg-success-500/10",
    header: "bg-success-500/5 text-success-500",
  },
  warning: {
    row: "bg-warning-500/10",
    header: "bg-warning-500/5 text-warning-500",
  },
  danger: {
    row: "bg-danger-500/10",
    header: "bg-danger-500/5 text-danger-500",
  },
};

const SortIcon: React.FC<{ direction?: SortDirection; active: boolean }> = ({
  direction,
  active,
}) => (
  <span className={`inline-flex flex-col ml-1 ${active ? "opacity-100" : "opacity-30"}`}>
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="currentColor"
      className={`${active && direction === "ascending" ? "opacity-100" : "opacity-40"}`}
    >
      <path d="M4 0L8 5H0L4 0Z" />
    </svg>
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="currentColor"
      className={`mt-0.5 ${active && direction === "descending" ? "opacity-100" : "opacity-40"}`}
    >
      <path d="M4 5L0 0H8L4 5Z" />
    </svg>
  </span>
);

const Checkbox: React.FC<{
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}> = ({ checked, indeterminate, onChange }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={indeterminate ? "mixed" : checked}
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={[
      "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 cursor-pointer",
      checked || indeterminate
        ? "bg-primary-500 border-primary-500 text-white"
        : "border-default-300 hover:border-default-400",
    ].join(" ")}
  >
    {checked && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
    {indeterminate && !checked && (
      <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
        <path d="M1 1H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )}
  </button>
);

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField,
  color = "default",
  layout = "auto",
  isStriped = false,
  isCompact = false,
  isHeaderSticky = false,
  selectionMode = "none",
  selectedKeys: controlledKeys,
  onSelectionChange,
  sortDescriptor: controlledSort,
  onSortChange,
  className = "",
  emptyContent,
}: TableProps<T>) {
  const [internalKeys, setInternalKeys] = useState<Set<string>>(new Set());
  const selectedKeys = controlledKeys ?? internalKeys;

  const setSelectedKeys = useCallback(
    (keys: Set<string>) => {
      if (!controlledKeys) setInternalKeys(keys);
      onSelectionChange?.(keys);
    },
    [controlledKeys, onSelectionChange]
  );

  const getRowKey = (row: T): string => String(row[keyField]);

  const allKeys = rows.map(getRowKey);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.has(k));
  const someSelected = allKeys.some((k) => selectedKeys.has(k));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(allKeys));
    }
  };

  const toggleRow = (key: string) => {
    const next = new Set(selectedKeys);
    if (selectionMode === "single") {
      if (next.has(key)) {
        next.clear();
      } else {
        next.clear();
        next.add(key);
      }
    } else {
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
    }
    setSelectedKeys(next);
  };

  const handleSort = (columnKey: string) => {
    const newDirection: SortDirection =
      controlledSort?.column === columnKey && controlledSort.direction === "ascending"
        ? "descending"
        : "ascending";
    onSortChange?.({ column: columnKey, direction: newDirection });
  };

  const cellPadding = isCompact ? "px-3 py-1.5" : "px-4 py-3";
  const alignClasses = { start: "text-left", center: "text-center", end: "text-right" };

  return (
    <div className={`w-full overflow-auto rounded-xl ${className}`}>
      <table
        className={`w-full border-collapse ${layout === "fixed" ? "table-fixed" : "table-auto"}`}
      >
        <thead
          className={isHeaderSticky ? "sticky top-0 z-10" : ""}
        >
          <tr className={`${colorHighlight[color].header} border-b border-default-100`}>
            {selectionMode === "multiple" && (
              <th className={`${cellPadding} w-12`}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {selectionMode === "single" && (
              <th className={`${cellPadding} w-12`} />
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  cellPadding,
                  "text-xs font-semibold uppercase tracking-wider select-none",
                  alignClasses[col.align ?? "start"],
                  col.sortable ? "cursor-pointer hover:text-default-800 transition-colors" : "",
                ].join(" ")}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="inline-flex items-center">
                  {col.label}
                  {col.sortable && (
                    <SortIcon
                      active={controlledSort?.column === col.key}
                      direction={controlledSort?.column === col.key ? controlledSort.direction : undefined}
                    />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (selectionMode !== "none" ? 1 : 0)}
                className="text-center py-10 text-default-400"
              >
                {emptyContent ?? "No rows to display."}
              </td>
            </tr>
          )}
          {rows.map((row, index) => {
            const rowKey = getRowKey(row);
            const isSelected = selectedKeys.has(rowKey);
            const stripedBg = isStriped && index % 2 === 1 ? "bg-default-50" : "";

            return (
              <tr
                key={rowKey}
                className={[
                  "border-b border-default-50 transition-colors duration-150",
                  isSelected ? colorHighlight[color].row : stripedBg,
                  selectionMode !== "none"
                    ? "cursor-pointer hover:bg-default-100"
                    : "hover:bg-default-50",
                ].join(" ")}
                onClick={selectionMode !== "none" ? () => toggleRow(rowKey) : undefined}
              >
                {selectionMode === "multiple" && (
                  <td className={cellPadding}>
                    <Checkbox checked={isSelected} onChange={() => toggleRow(rowKey)} />
                  </td>
                )}
                {selectionMode === "single" && (
                  <td className={cellPadding}>
                    <div
                      className={[
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected
                          ? "border-primary-500"
                          : "border-default-300",
                      ].join(" ")}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      )}
                    </div>
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${cellPadding} text-sm text-default-700 ${alignClasses[col.align ?? "start"]}`}
                  >
                    {col.render
                      ? col.render(row[col.key], row, index)
                      : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

Table.displayName = "Table";
export default Table;
