import { useCallback, useMemo, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "./locale";
import { Checkbox } from "./Checkbox";
import { rx, useResponsive, type BreakpointClasses, type ResponsiveProp } from "./breakpoints";

type TableColor = "default" | "accent" | "success" | "warning" | "danger";
type TableLayout = "auto" | "fixed";
type TableVariant = "primary" | "secondary";
type SelectionMode = "none" | "single" | "multiple";
type SortDirection = "ascending" | "descending";

export interface TableColumn<T = Record<string, unknown>> {
  /** Field name in the row object */
  key: string;
  /** Column header */
  label: string;
  /** Enables sorting by this column */
  sortable?: boolean;
  /** Column width (px or CSS value) */
  width?: string | number;
  /** Content alignment */
  align?: "start" | "center" | "end";
  /** Custom cell renderer */
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface SortDescriptor {
  column: string;
  direction: SortDirection;
}

export interface TableProps<T = Record<string, unknown>> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Table rows (data) */
  rows: T[];
  /** Field that uniquely identifies each row */
  keyField: string;
  /** Style: primary (white surface) or secondary (no background, for use inside a surface) */
  variant?: TableVariant;
  /** Color of the selected row and checkbox */
  color?: TableColor;
  /** Table layout: auto or fixed */
  layout?: TableLayout;
  /** Zebra-striped rows */
  isStriped?: boolean;
  /** Dense layout with smaller padding */
  isCompact?: boolean;
  /** Keeps the header pinned while scrolling */
  isHeaderSticky?: boolean;
  /** Shows skeleton rows */
  isLoading?: boolean;
  /** Number of skeleton rows while loading */
  loadingRows?: number;
  /** Removes the outer card wrapper */
  removeWrapper?: boolean;
  /** Makes the wrapper glass — for colorful backgrounds */
  isBlurred?: boolean;
  /** Glass material: frosted (classic) or liquid (clearer, with shining edges). Falls back to the global setting (html data-glass) */
  material?: "frosted" | "liquid";
  /** Hides the header row */
  hideHeader?: boolean;
  /** Row selection mode */
  selectionMode?: SelectionMode;
  /** Selected row keys (controlled) */
  selectedKeys?: Set<string>;
  /** Keys of rows that cannot be selected */
  disabledKeys?: string[];
  /** Called when the selection changes */
  onSelectionChange?: (keys: Set<string>) => void;
  /** Called when a row is pressed */
  onRowAction?: (key: string, row: T) => void;
  /** Current sort state (controlled) */
  sortDescriptor?: SortDescriptor;
  /** Called when sorting changes */
  onSortChange?: (descriptor: SortDescriptor) => void;
  /** Slot above the table (search, buttons) */
  topContent?: ReactNode;
  /** Slot below the table (pagination) */
  bottomContent?: ReactNode;
  /** Maximum height; scrolls inside when exceeded */
  maxHeight?: string | number;
  /** Extra classes for the wrapper */
  className?: string;
  /** Content shown when there are no rows */
  emptyContent?: ReactNode;
  /** Table name for screen readers */
  "aria-label"?: string;
  /** Adapts to the screen: on mobile cells stop wrapping and the table scrolls sideways with tighter padding and a smaller wrapper; on desktop cells get roomier. true = all breakpoints or a list like ["m", "t"] */
  responsive?: ResponsiveProp;
}

// Mobile: tighter cells that don't wrap (the wrapper scrolls sideways). Desktop: roomier cells.
const thR: BreakpointClasses = { m: "mobile:px-2.5", d: "desktop:h-11 desktop:px-4" };
const tdR: BreakpointClasses = { m: "mobile:px-2.5 mobile:whitespace-nowrap", d: "desktop:px-4" };
const tdHeightR: BreakpointClasses = { d: "desktop:h-14" };
const wrapperR: BreakpointClasses = { m: "mobile:rounded-2xl mobile:p-1.5 mobile:overscroll-x-contain", d: "desktop:p-3" };

const selectedRow: Record<TableColor, string> = {
  default: "[&>td]:bg-default",
  accent: "[&>td]:bg-accent-soft",
  success: "[&>td]:bg-success-soft",
  warning: "[&>td]:bg-warning-soft",
  danger: "[&>td]:bg-danger-soft",
};

const radioDot: Record<TableColor, string> = {
  default: "bg-foreground",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const SortIcon = ({ direction, active }: { direction?: SortDirection; active: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={cn(
      "ml-1 shrink-0 transition-[transform,opacity] duration-200 ease-(--ease-out-soft)",
      active ? "opacity-100" : "opacity-0 group-hover/th:opacity-60",
      active && direction === "descending" && "rotate-180"
    )}
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true, sensitivity: "base" });
}

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField,
  variant = "primary",
  color = "accent",
  layout = "auto",
  isStriped = false,
  isCompact = false,
  isHeaderSticky = false,
  isLoading = false,
  loadingRows = 5,
  removeWrapper = false,
  isBlurred = false,
  material,
  hideHeader = false,
  selectionMode = "none",
  selectedKeys: controlledKeys,
  disabledKeys = [],
  onSelectionChange,
  onRowAction,
  sortDescriptor: controlledSort,
  onSortChange,
  topContent,
  bottomContent,
  maxHeight,
  className = "",
  emptyContent,
  "aria-label": ariaLabel,
  responsive,
}: TableProps<T>) {
  const t = useLocale();
  const bps = useResponsive(responsive);
  const [internalKeys, setInternalKeys] = useState<Set<string>>(new Set());
  const [internalSort, setInternalSort] = useState<SortDescriptor | undefined>();
  const selectedKeys = controlledKeys ?? internalKeys;
  const sort = controlledSort ?? internalSort;
  const disabledSet = useMemo(() => new Set(disabledKeys), [disabledKeys]);

  const setSelectedKeys = useCallback(
    (keys: Set<string>) => {
      if (!controlledKeys) setInternalKeys(keys);
      onSelectionChange?.(keys);
    },
    [controlledKeys, onSelectionChange]
  );

  const getRowKey = (row: T): string => String(row[keyField]);

  // Uncontrolled sorting sorts locally; controlled sorting expects the parent to sort rows.
  const displayRows = useMemo(() => {
    if (controlledSort || !internalSort) return rows;
    const { column, direction } = internalSort;
    const sorted = [...rows].sort((a, b) => compareValues(a[column], b[column]));
    return direction === "descending" ? sorted.reverse() : sorted;
  }, [rows, controlledSort, internalSort]);

  const selectableKeys = displayRows.map(getRowKey).filter((k) => !disabledSet.has(k));
  const allSelected = selectableKeys.length > 0 && selectableKeys.every((k) => selectedKeys.has(k));
  const someSelected = selectableKeys.some((k) => selectedKeys.has(k));

  const toggleAll = () => setSelectedKeys(allSelected ? new Set() : new Set(selectableKeys));

  const toggleRow = (key: string) => {
    if (disabledSet.has(key)) return;
    const next = new Set(selectionMode === "single" ? [] : selectedKeys);
    if (selectedKeys.has(key)) next.delete(key);
    else next.add(key);
    setSelectedKeys(next);
  };

  const handleSort = (columnKey: string) => {
    const direction: SortDirection = sort?.column === columnKey && sort.direction === "ascending" ? "descending" : "ascending";
    const next = { column: columnKey, direction };
    if (!controlledSort) setInternalSort(next);
    onSortChange?.(next);
  };

  const hasSelection = selectionMode !== "none";
  const isInteractive = hasSelection || Boolean(onRowAction);
  const colSpan = columns.length + (hasSelection ? 1 : 0);
  const cellPad = isCompact ? "px-3 h-10" : "px-3 h-12";
  const alignClasses = { start: "text-left", center: "text-center", end: "text-right" };

  const thBase = cn(
    "group/th h-10 px-3 text-xs font-medium text-muted whitespace-nowrap align-middle first:rounded-l-xl last:rounded-r-xl",
    isBlurred ? "bg-default/60" : variant === "primary" ? "bg-surface-secondary" : "bg-default/70",
    rx(bps, thR)
  );
  const tdBase = cn(cellPad, "text-sm text-foreground align-middle whitespace-normal relative", rx(bps, tdR), !isCompact && rx(bps, tdHeightR));

  const table = (
    <table
      aria-label={ariaLabel}
      aria-multiselectable={selectionMode === "multiple" || undefined}
      className={cn("w-full min-w-full h-auto border-separate border-spacing-0", layout === "fixed" ? "table-fixed" : "table-auto")}
    >
      {!hideHeader && (
        <thead className={cn(isHeaderSticky && "sticky top-0 z-20")}>
          <tr>
            {hasSelection && (
              <th className={cn(thBase, "w-10 pr-0")}>
                {selectionMode === "multiple" && (
                  <Checkbox
                    size="sm"
                    color={color}
                    isSelected={allSelected}
                    isIndeterminate={someSelected && !allSelected}
                    isDisabled={isLoading || selectableKeys.length === 0}
                    onChange={toggleAll}
                    aria-label={t.table.selectAll}
                  />
                )}
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sort?.column === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={isSorted ? sort.direction : undefined}
                  className={cn(thBase, alignClasses[col.align ?? "start"], isSorted && "text-foreground")}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.sortable ? (
                    // A real button: reachable with Tab, sorts with Enter / Space
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className={cn(
                        "inline-flex items-center rounded-md -mx-1 px-1 cursor-pointer select-none hover:text-foreground transition-colors",
                        "outline-none focus-visible:ring-2 focus-visible:ring-focus",
                        col.align === "end" && "flex-row-reverse",
                        col.align === "center" && "justify-center"
                      )}
                    >
                      {col.label}
                      <SortIcon active={isSorted} direction={isSorted ? sort.direction : undefined} />
                    </button>
                  ) : (
                    <span className={cn("inline-flex items-center", col.align === "end" && "flex-row-reverse", col.align === "center" && "justify-center")}>
                      {col.label}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
          <tr aria-hidden className="h-1" />
        </thead>
      )}
      <tbody>
        {isLoading &&
          Array.from({ length: loadingRows }, (_, i) => (
            <tr key={`skeleton-${i}`}>
              {hasSelection && (
                <td className={tdBase}>
                  <span className="block w-4 h-4 rounded-md bg-default animate-pulse" />
                </td>
              )}
              {columns.map((col, j) => (
                <td key={col.key} className={tdBase}>
                  <span
                    className="block h-3 rounded-full bg-default animate-pulse"
                    style={{ width: `${55 + ((i * 7 + j * 13) % 40)}%`, animationDelay: `${i * 80}ms` }}
                  />
                </td>
              ))}
            </tr>
          ))}

        {!isLoading && displayRows.length === 0 && (
          <tr>
            <td colSpan={colSpan} className="h-40 text-center text-sm text-muted">
              {emptyContent ?? t.table.empty}
            </td>
          </tr>
        )}

        {!isLoading &&
          displayRows.map((row, index) => {
            const rowKey = getRowKey(row);
            const isSelected = selectedKeys.has(rowKey);
            const isDisabled = disabledSet.has(rowKey);
            const isOdd = isStriped && index % 2 === 1;
            const isLast = index === displayRows.length - 1;

            return (
              <tr
                key={rowKey}
                aria-selected={hasSelection ? isSelected : undefined}
                aria-disabled={isDisabled || undefined}
                tabIndex={isInteractive && !isDisabled ? 0 : undefined}
                onClick={
                  isInteractive && !isDisabled
                    ? () => {
                        if (hasSelection) toggleRow(rowKey);
                        onRowAction?.(rowKey, row);
                      }
                    : undefined
                }
                onKeyDown={
                  isInteractive && !isDisabled
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (hasSelection) toggleRow(rowKey);
                          onRowAction?.(rowKey, row);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "group/tr outline-none",
                  "[&>td]:transition-colors [&>td]:duration-150",
                  (isSelected || isOdd) && "[&>td:first-child]:rounded-l-xl [&>td:last-child]:rounded-r-xl",
                  isInteractive && "hover:[&>td:first-child]:rounded-l-xl hover:[&>td:last-child]:rounded-r-xl",
                  !isLast && !isStriped && "[&>td]:shadow-[inset_0_-1px_0_var(--color-separator)]",
                  "focus-visible:[&>td]:bg-surface-secondary",
                  isSelected ? selectedRow[color] : isOdd ? "[&>td]:bg-surface-secondary/70" : "",
                  isInteractive && !isDisabled && "cursor-pointer",
                  !isSelected && "hover:[&>td]:bg-surface-secondary/70",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {hasSelection && (
                  <td className={cn(tdBase, "w-10 pr-0")} onClick={(e) => e.stopPropagation()}>
                    {selectionMode === "multiple" ? (
                      <Checkbox
                        size="sm"
                        color={color}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        onChange={() => toggleRow(rowKey)}
                        aria-label={t.table.selectRow}
                      />
                    ) : (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={isDisabled}
                        onClick={() => toggleRow(rowKey)}
                        className={cn(
                          "flex items-center justify-center w-4 h-4 rounded-full border-2 transition-colors duration-150 cursor-pointer outline-none",
                          "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isSelected ? "border-accent bg-field" : "border-border bg-field hover:border-muted"
                        )}
                      >
                        <span className={cn("w-2 h-2 rounded-full transition-transform duration-200 ease-(--ease-out-soft)", radioDot[color], isSelected ? "scale-100" : "scale-0")} />
                      </button>
                    )}
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={cn(tdBase, alignClasses[col.align ?? "start"])}>
                    {col.render ? col.render(row[col.key], row, index) : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            );
          })}
      </tbody>
    </table>
  );

  if (removeWrapper) {
    return (
      <div className={cn("flex flex-col gap-4 w-full", className)}>
        {topContent}
        <div className={cn("overflow-auto", rx(bps, { m: "mobile:overscroll-x-contain" }))} style={maxHeight ? { maxHeight } : undefined}>
          {table}
        </div>
        {bottomContent}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {topContent}
      <div
        data-glass={material}
        className={cn("relative w-full overflow-auto rounded-3xl", variant === "primary" ? cn(isBlurred ? "glass" : "bg-surface-gradient shadow-surface", "p-2", rx(bps, wrapperR)) : "bg-transparent")}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {table}
      </div>
      {bottomContent}
    </div>
  );
}

Table.displayName = "Table";
export default Table;
