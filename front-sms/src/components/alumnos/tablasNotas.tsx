"use client";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useCreateNotaMutation, useGetResumenAlumnoQuery } from "@/redux/services/notasApi";
import { useSelector } from "react-redux";
import { selectUserLogin } from "@/redux/features/userSlice";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2 } from "lucide-react";
import { SelectorAnioLectivo } from "./SelectorAnioLectivo";

interface TablasNotasProps {
  alumnoId: string;
  onSaved?: () => void;
  anioLectivo: number;
  aniosDisponibles: number[];
  seccionId?: number;
  dataAlumno?: {
    nombre?: string;
    apellido?: string;
    dni?: string;
    direccion?: string;
    grado?: string | number;
    seccion?: string;
  };
}

type Bim = 1 | 2 | 3 | 4;

interface FilaTabla {
  materia: string;
  materiaId: string;
  bimestre1: string | number;
  bimestre2: string | number;
  bimestre3: string | number;
  bimestre4: string | number;
  promedio: number | string;
}

type DraftState = Record<Bim, string>;

const BIMESTRE_MAP: Record<Bim, string> = {
  1: "PRIMERO",
  2: "SEGUNDO",
  3: "TERCERO",
  4: "CUARTO",
};

const BIMESTRE_LABEL: Record<Bim, string> = {
  1: "1° Bimestre",
  2: "2° Bimestre",
  3: "3° Bimestre",
  4: "4° Bimestre",
};

const TablasNotas = ({ alumnoId, onSaved, anioLectivo: initialAnio, aniosDisponibles, seccionId, dataAlumno }: TablasNotasProps) => {
  const userLogin = useSelector(selectUserLogin) as { id?: string | number; email: string; role: string } | null;
  const [createNota, { isLoading: saving }] = useCreateNotaMutation();
  const [anioLectivo, setAnioLectivo] = useState(initialAnio);
  const { data: resumenData, isLoading, refetch } = useGetResumenAlumnoQuery(
    { alumnoId, cicloLectivo: String(anioLectivo) },
    { skip: !alumnoId },
  );

  console.log("resumenData", resumenData)


  const [editandoMateriaId, setEditandoMateriaId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState>({ 1: "", 2: "", 3: "", 4: "" });

  const toStr = (v: string | number) => (v === "" ? "" : String(v));

  const rows = useMemo(() => {
    const asignaturas = resumenData?.data?.asignaturas;
    if (!asignaturas || asignaturas.length === 0) return [];

    const BIMESTRE_KEY_MAP: Record<number, string> = {
      1: "Bimestre 1",
      2: "Bimestre 2",
      3: "Bimestre 3",
      4: "Bimestre 4",
    };

    return asignaturas.map((item) => {
      const b1 = item.promediosPorBimestre[BIMESTRE_KEY_MAP[1]] ?? "";
      const b2 = item.promediosPorBimestre[BIMESTRE_KEY_MAP[2]] ?? "";
      const b3 = item.promediosPorBimestre[BIMESTRE_KEY_MAP[3]] ?? "";
      const b4 = item.promediosPorBimestre[BIMESTRE_KEY_MAP[4]] ?? "";

      const notas = [b1, b2, b3, b4].filter((v): v is number => typeof v === "number");
      const promedio = notas.length > 0
        ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2)
        : "";

      return {
        materia: item.asignaturaNombre,
        materiaId: String(item.asignaturaId),
        bimestre1: b1,
        bimestre2: b2,
        bimestre3: b3,
        bimestre4: b4,
        promedio,
      };
    }).sort((a, b) => a.materia.localeCompare(b.materia));
  }, [resumenData]);

  const beginEdit = (fila: FilaTabla) => {
    setEditandoMateriaId(fila.materiaId);
    setDraft({
      1: toStr(fila.bimestre1),
      2: toStr(fila.bimestre2),
      3: toStr(fila.bimestre3),
      4: toStr(fila.bimestre4),
    });
  };

  const cancelEdit = () => {
    setEditandoMateriaId(null);
    setDraft({ 1: "", 2: "", 3: "", 4: "" });
  };

  const changeDraft = (b: Bim, v: string) => {
    setDraft((d) => ({ ...d, [b]: v }));
  };

  const hasChanges = (fila: FilaTabla) =>
    (toStr(fila.bimestre1) !== draft[1]) ||
    (toStr(fila.bimestre2) !== draft[2]) ||
    (toStr(fila.bimestre3) !== draft[3]) ||
    (toStr(fila.bimestre4) !== draft[4]);

  const calcularPromedio = (b1: string | number, b2: string | number, b3: string | number, b4: string | number): string => {
    const notas = [b1, b2, b3, b4]
      .filter((v): v is number => typeof v === 'number');
    if (notas.length > 0) {
      return (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2);
    }
    return "-";
  };

  const saveRow = async (fila: FilaTabla) => {
    if (!userLogin) {
      toast.error("Usuario no autenticado");
      return;
    }

    const derivedSeccionId = seccionId || 0;
    if (!derivedSeccionId) {
      toast.error("No se encontró la sección del alumno. Asegúrate de que esté inscrito en una sección.");
      return;
    }

    const ops: Array<{ b: Bim; val: number }> = [];
    let hasError = false;

    ([1, 2, 3, 4] as Bim[]).forEach((b) => {
      const raw = draft[b].trim();
      if (raw === "") return;
      const num = parseFloat(raw);
      if (isNaN(num) || num < 1 || num > 10) {
        toast.error(`Nota inválida en ${b}° bimestre (1 a 10)`);
        hasError = true;
        return;
      }
      const original = toStr((fila)[`bimestre${b}` as keyof FilaTabla]);
      if (original === raw) return;
      ops.push({ b, val: num });
    });

    if (hasError) return;

    if (ops.length === 0) {
      toast.message("No hay cambios por guardar");
      cancelEdit();
      return;
    }

    try {
      for (const { b, val } of ops) {
        await createNota({
          alumnoId: Number(alumnoId),
          asignaturaId: Number(fila.materiaId),
          seccionId: derivedSeccionId,
          bimestre: BIMESTRE_MAP[b],
          cicloLectivo: String(anioLectivo),
          tipoNota: "EXAMEN",
          valor: val,
          docenteId: Number(userLogin.id),
        }).unwrap();
      }

      toast.success("Notas guardadas correctamente");
      cancelEdit();
      onSaved?.();
      refetch();
    } catch (e) {
      console.error('Error al guardar notas:', e);
      toast.error("Error al guardar notas");
    }
  };

  const exportarListaNotasExcel = () => {
    try {
      const headers = ["Materia", "Bimestre 1", "Bimestre 2", "Bimestre 3", "Bimestre 4", "Promedio"];

      const dataToExport = rows.map((fila) => [
        fila.materia,
        fila.bimestre1 === 0 ? "-" : fila.bimestre1,
        fila.bimestre2 === 0 ? "-" : fila.bimestre2,
        fila.bimestre3 === 0 ? "-" : fila.bimestre3,
        fila.bimestre4 === 0 ? "-" : fila.bimestre4,
        fila.promedio,
      ]);

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);

      worksheet['!cols'] = [
        { width: 30 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
        { width: 12 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notas");

      const fecha = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Notas_${dataAlumno?.nombre || ''}_${dataAlumno?.apellido || ''}_${anioLectivo}_${fecha}.xlsx`);

      toast.success("Archivo Excel exportado correctamente");
    } catch (error) {
      console.error("Error en exportación a Excel:", error);
      toast.error("Error al exportar el archivo Excel");
    }
  };

  const exportarListaNotasPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let currentY = 15;

      const primaryColor: [number, number, number] = [66, 135, 245];
      const darkText: [number, number, number] = [51, 51, 51];
      const grayText: [number, number, number] = [102, 102, 102];

      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 10, 'F');

      doc.setFontSize(18);
      doc.setTextColor(...darkText);
      doc.setFont('helvetica', 'bold');
      doc.text("REPORTE DE NOTAS", pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;

      doc.setFontSize(10);
      doc.setTextColor(...grayText);
      doc.setFont('helvetica', 'normal');
      doc.text("Instituto Educativo Excelencia", pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;

      doc.setFontSize(12);
      doc.setTextColor(...darkText);
      doc.setFont('helvetica', 'bold');
      doc.text("INFORMACIÓN DEL ALUMNO", margin, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${dataAlumno?.nombre || ''} ${dataAlumno?.apellido || ''}`, margin, currentY);
      doc.text(`Año Lectivo: ${anioLectivo}`, pageWidth / 2, currentY);
      currentY += 6;

      doc.text(`DNI: ${dataAlumno?.dni || '-'}`, margin, currentY);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY);
      currentY += 6;

      doc.text(`Dirección: ${dataAlumno?.direccion || '-'}`, margin, currentY);
      currentY += 6;

      doc.text(`Grado/Sección: ${dataAlumno?.grado || '-'} / ${dataAlumno?.seccion || '-'}`, margin, currentY);
      currentY += 15;

      const headers = [["Materia", "Bim. 1", "Bim. 2", "Bim. 3", "Bim. 4", "Promedio"]];
      const data = rows.map((fila) => [
        fila.materia,
        fila.bimestre1 === 0 ? "-" : String(fila.bimestre1),
        fila.bimestre2 === 0 ? "-" : String(fila.bimestre2),
        fila.bimestre3 === 0 ? "-" : String(fila.bimestre3),
        fila.bimestre4 === 0 ? "-" : String(fila.bimestre4),
        String(fila.promedio),
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: currentY,
        theme: 'grid',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          cellPadding: 3,
        },
        bodyStyles: {
          textColor: darkText,
          fontSize: 9,
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [225, 235, 255],
        },
        styles: {
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        margin: { top: currentY },
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`Reporte_Notas_${dataAlumno?.nombre || ''}_${dataAlumno?.apellido || ''}_${anioLectivo}_${fecha}.pdf`);

      toast.success("Archivo PDF exportado correctamente");
    } catch (error) {
      console.error("Error en exportación a PDF:", error);
      toast.error("Error al exportar el archivo PDF");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Notas del Alumno</h3>
          <SelectorAnioLectivo
            anios={aniosDisponibles}
            anioSeleccionado={anioLectivo}
            onAnioChange={setAnioLectivo}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="cursor-pointer bg-green-600 hover:bg-green-700"
            onClick={exportarListaNotasExcel}
          >
            Exportar a Excel
          </Button>
          <Button
            className="cursor-pointer bg-red-600 hover:bg-red-700"
            onClick={exportarListaNotasPDF}
          >
            Exportar a PDF
          </Button>
        </div>
      </div>
      <Table>
        <TableCaption>Notas del Alumno</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Materia</TableHead>
            <TableHead>1° Bimestre</TableHead>
            <TableHead>2° Bimestre</TableHead>
            <TableHead>3° Bimestre</TableHead>
            <TableHead>4° Bimestre</TableHead>
            <TableHead className="font-bold">Promedio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((fila) => {
            const editing = editandoMateriaId === fila.materiaId;

            return (
              <TableRow key={fila.materiaId}>
                <TableCell>{fila.materia}</TableCell>

                {([1, 2, 3, 4] as Bim[]).map((b) => (
                  <TableCell key={`${fila.materiaId}-${b}`}>
                    {editing ? (
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        className="w-20 mx-auto"
                        value={draft[b]}
                        onChange={(e) => changeDraft(b, e.target.value)}
                      />
                    ) : (
                      <span>
                        {toStr(fila[`bimestre${b}` as keyof FilaTabla]) === "" ? "-" : fila[`bimestre${b}` as keyof FilaTabla]}
                      </span>
                    )}
                  </TableCell>
                ))}

                <TableCell className="font-bold">
                  {fila.promedio}
                </TableCell>

                <TableCell>
                  {editing ? (
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={saving || !hasChanges(fila)}
                        onClick={() => saveRow(fila)}
                      >
                        {saving ? "Guardando..." : "Guardar"}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => beginEdit(fila)}
                    >
                      Editar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {rows.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>No hay notas registradas para este alumno.</p>
          <p className="text-sm mt-2">Edita una fila para agregar notas.</p>
        </div>
      )}
    </div>
  );
};

export default TablasNotas;
