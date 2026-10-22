"use client";

import * as React from "react";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, Columns3Icon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc";
type DataTableSort = { key: string; direction: SortDirection };
type CellValue = string | number | boolean | Date | null | undefined;

type DataTableColumn<T> = {
  /** unique id; also the property read from the row when there's no `value` */
  key: (keyof T & string) | (string & {});
  header: React.ReactNode;
  /** custom cell; defaults to the raw value */
  cell?: (row: T, index: number) => React.ReactNode;
  /** value used for sorting and filtering (default: row[key]) */
  value?: (row: T) => CellValue;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: number | string;
  className?: string;
  /** listed in the Columns menu (default true) */
  hideable?: boolean;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  /** stable row id, used for selection (default: index) */
  getRowId?: (row: T, index: number) => string;

  selectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;

  /** show a global filter input */
  filterable?: boolean;
  filterPlaceholder?: string;
  filterFn?: (row: T, query: string) => boolean;
  /** show a Columns visibility menu */
  columnToggle?: boolean;
  /** extra toolbar content, right-aligned */
  toolbar?: React.ReactNode;

  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;

  /** enables client-side pagination */
  pageSize?: number;
  paginationVariant?: "pages" | "compact";

  emptyState?: React.ReactNode;
  /** keeps the header visible; needs `maxHeight` to scroll inside the table */
  stickyHeader?: boolean;
  maxHeight?: number | string;
  onRowClick?: (row: T, index: number) => void;

  "aria-label"?: string;
  className?: string;
};

const alignClass = { left: "text-left", center: "text-center", right: "text-right" } as const;

function readValue<T>(column: DataTableColumn<T>, row: T): CellValue {
  if (column.value) return column.value(row);
  const raw = (row as Record<string, unknown>)[column.key];
  return raw instanceof Date || ["string", "number", "boolean"].includes(typeof raw) ? (raw as CellValue) : raw == null ? raw : String(raw);
}

const isEmpty = (v: CellValue) => v === null || v === undefined || v === "";

function compareValues(a: CellValue, b: CellValue) {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if ((typeof a === "number" || typeof a === "boolean") && (typeof b === "number" || typeof b === "boolean")) return Number(a) - Number(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

function renderValue(v: CellValue) {
  if (v instanceof Date) return v.toLocaleDateString();
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return v;
}

function DataTable<T extends object>({
  data,
  columns,
  getRowId,
  selectable = false,
  selectedIds,
  defaultSelectedIds,
  onSelectionChange,
  filterable = false,
  filterPlaceholder = "Filter…",
  filterFn,
  columnToggle = false,
  toolbar,
  defaultSort = null,
  onSortChange,
  pageSize,
  paginationVariant = "pages",
  emptyState = "No results.",
  stickyHeader = false,
  maxHeight,
  onRowClick,
  "aria-label": ariaLabel,
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<DataTableSort | null>(defaultSort);
  const [hidden, setHidden] = React.useState<Set<string>>(() => new Set());
  const [page, setPage] = React.useState(1);
  const [innerSelected, setInnerSelected] = React.useState<string[]>(defaultSelectedIds ?? []);
  const selected = React.useMemo(() => new Set(selectedIds ?? innerSelected), [selectedIds, innerSelected]);

  const visibleColumns = columns.filter((c) => !hidden.has(c.key));
  const rows = React.useMemo(() => data.map((row, index) => ({ row, index, id: getRowId ? getRowId(row, index) : String(index) })), [data, getRowId]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(({ row }) =>
      filterFn
        ? filterFn(row, q)
        : columns.some((c) => {
            const v = readValue(c, row);
            return !isEmpty(v) && String(renderValue(v)).toLowerCase().includes(q);
          }),
    );
  }, [rows, query, filterFn, columns]);

  const sorted = React.useMemo(() => {
    const column = sort && columns.find((c) => c.key === sort.key);
    if (!sort || !column) return filtered;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...filtered].sort((ra, rb) => {
      const a = readValue(column, ra.row);
      const b = readValue(column, rb.row);
      // empty values always sink to the bottom
      if (isEmpty(a) || isEmpty(b)) return isEmpty(a) === isEmpty(b) ? 0 : isEmpty(a) ? 1 : -1;
      return compareValues(a, b) * dir;
    });
  }, [filtered, sort, columns]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount);
  const pageRows = pageSize ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sorted;

  const setSelection = (next: Set<string>) => {
    const ids = [...next];
    if (selectedIds === undefined) setInnerSelected(ids);
    onSelectionChange?.(ids);
  };
  const toggleRow = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    setSelection(next);
  };
  // select-all acts on every filtered row, across pages
  const selectedInView = filtered.filter((r) => selected.has(r.id)).length;
  const allChecked = filtered.length > 0 && selectedInView === filtered.length ? true : selectedInView > 0 ? "indeterminate" : false;
  const toggleAll = () => {
    const next = new Set(selected);
    for (const r of filtered) {
      if (allChecked === true) next.delete(r.id);
      else next.add(r.id);
    }
    setSelection(next);
  };

  // none → asc → desc → none
  const cycleSort = (key: string) => {
    const next: DataTableSort | null =
      sort?.key !== key ? { key, direction: "asc" } : sort.direction === "asc" ? { key, direction: "desc" } : null;
    setSort(next);
    onSortChange?.(next);
  };

  const hideableColumns = columns.filter((c) => c.hideable !== false);
  const showToolbar = filterable || columnToggle || toolbar;
  const colSpan = visibleColumns.length + (selectable ? 1 : 0);

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-3", className)}>
      {showToolbar && (
        <div data-slot="data-table-toolbar" className="flex flex-wrap items-center gap-2">
          {filterable && (
            <div className="relative w-full max-w-64">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fg-subtle" />
              <Input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={filterPlaceholder}
                aria-label="Filter rows"
                className="pl-8"
              />
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            {toolbar}
            {columnToggle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Columns3Icon /> Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {hideableColumns.map((c) => (
                    <DropdownMenuCheckboxItem
                      key={c.key}
                      checked={!hidden.has(c.key)}
                      // keep the menu open while toggling several columns
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={(on) =>
                        setHidden((prev) => {
                          const next = new Set(prev);
                          if (on) next.delete(c.key);
                          else next.add(c.key);
                          return next;
                        })
                      }
                    >
                      {c.header}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      <div
        data-slot="data-table-frame"
        className={cn(
          "rounded-lg border border-border bg-surface shadow-sm",
          // the frame becomes the scroll container so sticky headers stick to it
          stickyHeader ? "overflow-auto [&>[data-slot=table-container]]:overflow-visible" : "overflow-hidden",
        )}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        <Table aria-label={ariaLabel}>
          <TableHeader
            className={cn(
              stickyHeader &&
                "[&_th]:sticky [&_th]:top-0 [&_th]:z-(--dx-z-sticky) [&_th]:bg-surface [&_th]:shadow-[inset_0_-1px_0_var(--dx-border)]",
            )}
          >
            <TableRow className="hover:bg-transparent">
              {selectable && (
                <TableHead className="w-10 pr-0">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    disabled={filtered.length === 0}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {visibleColumns.map((c) => {
                const active = sort?.key === c.key ? sort.direction : null;
                const SortIcon = active === "asc" ? ArrowUpIcon : active === "desc" ? ArrowDownIcon : ChevronsUpDownIcon;
                return (
                  <TableHead
                    key={c.key}
                    aria-sort={c.sortable ? (active === "asc" ? "ascending" : active === "desc" ? "descending" : "none") : undefined}
                    className={cn(alignClass[c.align ?? "left"], c.className)}
                    style={c.width !== undefined ? { width: c.width } : undefined}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => cycleSort(c.key)}
                        className={cn(
                          "-mx-1.5 inline-flex h-(--dx-control-sm) items-center gap-1 rounded-sm px-1.5 transition-colors duration-(--dx-motion-fast)",
                          "hover:bg-muted hover:text-fg [&_svg]:size-3 [&_svg]:shrink-0",
                          active && "text-fg",
                          c.align === "right" && "flex-row-reverse",
                        )}
                      >
                        {c.header}
                        <SortIcon aria-hidden="true" className={cn(!active && "text-fg-subtle")} />
                      </button>
                    ) : (
                      c.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan} className="h-24 text-center whitespace-normal text-fg-muted">
                  {query ? `No results for “${query.trim()}”.` : emptyState}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map(({ row, index, id }) => {
                const isSelected = selected.has(id);
                return (
                  <TableRow
                    key={id}
                    data-state={isSelected ? "selected" : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            // only when the row itself is focused, not a checkbox or link inside it
                            if (e.key === "Enter" && e.target === e.currentTarget) onRowClick(row, index);
                          }
                        : undefined
                    }
                    className={cn(onRowClick && "cursor-pointer outline-none focus-visible:bg-bg-subtle focus-visible:shadow-[inset_2px_0_0_var(--dx-ring)]")}
                  >
                    {selectable && (
                      <TableCell className="w-10 pr-0" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isSelected} onCheckedChange={(on) => toggleRow(id, on === true)} aria-label="Select row" />
                      </TableCell>
                    )}
                    {visibleColumns.map((c) => (
                      <TableCell key={c.key} className={cn(alignClass[c.align ?? "left"], c.align === "right" && "tabular-nums", c.className)}>
                        {c.cell ? c.cell(row, index) : renderValue(readValue(c, row))}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {(selectable || !!pageSize) && (
        <div data-slot="data-table-footer" className="flex flex-wrap items-center justify-between gap-2 text-sm text-fg-muted">
          <span aria-live="polite" className="tabular-nums">
            {selectable && selected.size > 0
              ? `${selected.size} of ${rows.length} selected`
              : pageSize && sorted.length > 0
                ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, sorted.length)} of ${sorted.length}`
                : `${sorted.length} ${sorted.length === 1 ? "row" : "rows"}`}
          </span>
          {!!pageSize && pageCount > 1 && (
            <PaginationControls page={currentPage} pageCount={pageCount} onPageChange={setPage} variant={paginationVariant} />
          )}
        </div>
      )}
    </div>
  );
}

export { DataTable, type DataTableColumn, type DataTableProps, type DataTableSort, type SortDirection };
