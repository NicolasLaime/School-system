import * as XLSX from "xlsx"

interface ExportColumn {
  key: string
  header: string
  width?: number
}

export function exportToExcel(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string
) {
  const headers = columns.map((c) => c.header)
  const rows = data.map((row) => columns.map((c) => row[c.key] ?? ""))

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

  if (columns.some((c) => c.width)) {
    ws["!cols"] = columns.map((c) => ({ wch: c.width ?? 20 }))
  }

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Datos")

  const today = new Date().toISOString().split("T")[0]
  const safeName = filename.toLowerCase().replace(/\s+/g, "-")
  XLSX.writeFile(wb, `${safeName}_${today}.xlsx`)
}
