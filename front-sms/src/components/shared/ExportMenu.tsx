"use client"

import { FileDown, FileText, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportToPdf } from "@/lib/export/exportToPdf"
import { exportToExcel } from "@/lib/export/exportToExcel"

export interface ExportMenuProps {
  data: Record<string, unknown>[]
  config: {
    filename: string
    columns: Array<{ key: string; header: string; width?: number }>
    pdfTitle?: string
    pdfSubtitle?: string
  }
  onExportStart?: (format: "pdf" | "excel") => void
  onExportComplete?: (format: "pdf" | "excel") => void
  disabled?: boolean
}

export function ExportMenu({
  data,
  config,
  onExportStart,
  onExportComplete,
  disabled,
}: ExportMenuProps) {
  const handlePdf = () => {
    onExportStart?.("pdf")
    exportToPdf(data, config.columns, config.pdfTitle ?? config.filename, config.pdfSubtitle)
    onExportComplete?.("pdf")
  }

  const handleExcel = () => {
    onExportStart?.("excel")
    exportToExcel(data, config.columns, config.filename)
    onExportComplete?.("excel")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <FileDown size={16} className="mr-1" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handlePdf}>
          <FileText size={16} className="mr-2" />
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExcel}>
          <FileSpreadsheet size={16} className="mr-2" />
          Exportar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
