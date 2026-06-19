import jsPDF from "jspdf"

interface ExportColumn {
  key: string
  header: string
  width?: number
}

export function exportToPdf(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  title: string,
  subtitle?: string
) {
  const doc = new jsPDF({ orientation: "landscape" })
  const today = new Date().toISOString().split("T")[0]

  doc.setFontSize(16)
  doc.text(title, 14, 20)

  if (subtitle) {
    doc.setFontSize(10)
    doc.text(subtitle, 14, 28)
  }

  doc.setFontSize(8)
  doc.text(`Generado: ${today}`, 14, subtitle ? 34 : 28)

  const headers = columns.map((c) => c.header)
  const rows = data.map((row) => columns.map((c) => String(row[c.key] ?? "")))

  const docAny = doc as unknown as { autoTable: (config: Record<string, unknown>) => void }
  docAny.autoTable({
    head: [headers],
    body: rows,
    startY: subtitle ? 38 : 32,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  })

  const filename = `${title.toLowerCase().replace(/\s+/g, "-")}_${today}.pdf`
  doc.save(filename)
}
