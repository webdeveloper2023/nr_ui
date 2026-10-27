import { type ReactNode } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

type TableColor = "default" | "primary" | "striped";
type TableRadius = "none" | "sm" | "md" | "lg";

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: keyof T;
  color?: TableColor;
  radius?: TableRadius;
  isCompact?: boolean;
  isStriped?: boolean;
  showDivider?: boolean;
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  className?: string;
}

const radiusMap: Record<TableRadius, string> = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
};

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField,
  radius = "md",
  isCompact = false,
  isStriped = false,
  showDivider = true,
  selectionMode = "none",
  selectedKeys = new Set(),
  onSelectionChange,
  className = "",
}: TableProps<T>) {
  const cellPadding = isCompact ? "px-3 py-1.5" : "px-4 py-3";

  const handleSelect = (key: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedKeys);
    if (selectionMode === "single") {
      onSelectionChange(next.has(key) ? new Set() : new Set([key]));
    } else {
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onSelectionChange(next);
    }
  };

  return (
    <div className={`bg-white border border-default-200 overflow-hidden ${radiusMap[radius]} ${className}`}>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-default-50 border-b border-default-200">
            {selectionMode !== "none" && (
              <th className={`${cellPadding} w-10`}>
                <span className="sr-only">Select</span>
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key} className={`${cellPadding} font-semibold text-default-600 text-xs uppercase tracking-wider`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = String(row[keyField]);
            const isSelected = selectedKeys.has(key);
            const stripe = isStriped && i % 2 === 1 ? "bg-default-50" : "";
            const selected = isSelected ? "bg-primary-50" : "";
            const divider = showDivider && i < rows.length - 1 ? "border-b border-default-100" : "";

            return (
              <tr
                key={key}
                className={`transition-colors hover:bg-default-50 ${stripe} ${selected} ${divider}`}
                onClick={() => selectionMode !== "none" && handleSelect(key)}
              >
                {selectionMode !== "none" && (
                  <td className={cellPadding}>
                    <input
                      type={selectionMode === "single" ? "radio" : "checkbox"}
                      checked={isSelected}
                      onChange={() => handleSelect(key)}
                      className="accent-primary-500"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={`${cellPadding} text-default-700`}>
                    {col.render ? col.render(row) : (row[col.key] as ReactNode)}
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

export default Table;
