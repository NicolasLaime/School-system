"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Search } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SkeletonTable } from "./SkeletonTable"
import { EmptyState, type EmptyStateProps } from "./EmptyState"
import { ExportMenu } from "./ExportMenu"

export interface ExportConfig {
  filename: string
  columns: string[]
  pdfTitle?: string
}

export interface DataTableEnhancedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  searchColumn?: string
  globalSearch?: boolean
  exportConfig?: ExportConfig
  primaryAction?: React.ReactNode
  toolbarActions?: React.ReactNode
  pageSize?: number
  isLoading?: boolean
  emptyStateProps?: EmptyStateProps
  disableRowSelection?: boolean
  onRowSelectionChange?: (rows: TData[]) => void
}

export function DataTableEnhanced<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Buscar...",
  globalSearch: _globalSearch = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  exportConfig,
  primaryAction,
  toolbarActions,
  pageSize = 10,
  isLoading = false,
  emptyStateProps,
}: DataTableEnhancedProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize },
    },
  })

  const normalize = (val: string) =>
    val.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")

  const handleGlobalSearch = (value: string) => {
    const normalized = normalize(value)
    setGlobalFilter(normalized)
  }

  const exportData: Record<string, unknown>[] = React.useMemo(() => {
    if (!exportConfig) return []
    return data.map((row) => {
      const obj: Record<string, unknown> = {}
      for (const colKey of exportConfig.columns) {
        const rowRecord = row as Record<string, unknown>
        obj[colKey] = rowRecord[colKey]
      }
      return obj
    })
  }, [data, exportConfig])

  const exportColumns = React.useMemo(() => {
    if (!exportConfig) return []
    return exportConfig.columns.map((key) => ({
      key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
    }))
  }, [exportConfig])

  if (isLoading) {
    return <SkeletonTable rows={pageSize} columns={columns.length} />
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyStateProps?.title ?? "No hay datos"}
        description={emptyStateProps?.description ?? "No se encontraron registros para mostrar."}
        icon={emptyStateProps?.icon}
        action={emptyStateProps?.action}
      />
    )
  }

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex + 1

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {toolbarActions}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columnas <ChevronDown size={14} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {exportConfig && (
            <ExportMenu
              data={exportData}
              config={{
                filename: exportConfig.filename,
                columns: exportColumns,
                pdfTitle: exportConfig.pdfTitle,
              }}
            />
          )}
          {primaryAction}
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Filas por página:</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(val) => table.setPageSize(Number(val))}
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
