"use client";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useCreateNotaMutation, useUpdateNotaMutation, useGetResumenAlumnoQuery, useLazyGetNotasByAlumnoAsignaturaQuery } from "@/redux/services/notasApi";
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

const PONDERACIONES = ["EXAMEN", "Tareas", "Proyecto"] as const;
type Ponderacion = typeof PONDERACIONES[number];

const PONDERACION_LABELS: Record<Ponderacion, string> = {
  EXAMEN: "Examen",
  Tareas: "Tareas",
  Proyecto: "Trabajo",
};

interface FilaTabla {
  materia: string;
  materiaId: string;
  bimestre1: string | number;
  bimestre2: string | number;
  bimestre3: string | number;
  bimestre4: string | number;
  promedio: number | string;
}

type DraftCell = Record<Ponderacion, string>;
type DraftState = Record<Bim, DraftCell>;

const BIMESTRE_MAP: Record<Bim, string> = {
  1: "PRIMERO",
  2: "SEGUNDO",
  3: "TERCERO",
  4: "CUARTO",
};

const BIMESTRE_REVERSE_MAP: Record<string, Bim> = {
  PRIMERO: 1,
  SEGUNDO: 2,
  TERCERO: 3,
  CUARTO: 4,
};

const EMPTY_DRAFT_CELL: DraftCell = { EXAMEN: "", Tareas: "", Proyecto: "" };

const TablasNotas = ({ alumnoId, onSaved, anioLectivo: initialAnio, aniosDisponibles, seccionId, dataAlumno }: TablasNotasProps) => {
  const userLogin = useSelector(selectUserLogin) as { id?: string | number; email: string; role: string } | null;
  const [createNota, { isLoading: savingCreate }] = useCreateNotaMutation();
  const [updateNota, { isLoading: savingUpdate }] = useUpdateNotaMutation();
  const saving = savingCreate || savingUpdate;
  const [triggerDetalle] = useLazyGetNotasByAlumnoAsignaturaQuery();
  const [anioLectivo, setAnioLectivo] = useState(initialAnio);
  const { data: resumenData, isLoading, refetch } = useGetResumenAlumnoQuery(
    { alumnoId, cicloLectivo: String(anioLectivo) },
    { skip: !alumnoId },
  );

  const [editandoMateriaId, setEditandoMateriaId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState>({ 1: { ...EMPTY_DRAFT_CELL }, 2: { ...EMPTY_DRAFT_CELL }, 3: { ...EMPTY_DRAFT_CELL }, 4: { ...EMPTY_DRAFT_CELL } });
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [docenteId, setDocenteId] = useState<number>(0);
  const [existingNotas, setExistingNotas] = useState<Record<Bim, Record<Ponderacion, number>>>({} as Record<Bim, Record<Ponderacion, number>>);

  const toStr = (v: string | number) => (v === "" ? "" : String(v));

  const rows = useMemo<FilaTabla[]>(() => {
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

  const beginEdit = async (fila: FilaTabla) => {
    setEditandoMateriaId(fila.materiaId);
    setCargandoDetalle(true);

    const emptyDraft: DraftState = {
      1: { ...EMPTY_DRAFT_CELL },
      2: { ...EMPTY_DRAFT_CELL },
      3: { ...EMPTY_DRAFT_CELL },
      4: { ...EMPTY_DRAFT_CELL },
    };
    setDraft(emptyDraft);

    try {
      const result = await triggerDetalle({
        alumnoId,
        asignaturaId: Number(fila.materiaId),
        cicloLectivo: String(anioLectivo),
      }).unwrap();

      if (result?.data) {
        const filledDraft = { ...emptyDraft };
        const ids: Record<Bim, Record<Ponderacion, number>> = {} as Record<Bim, Record<Ponderacion, number>>;
        result.data.forEach((nota) => {
          const bimo = BIMESTRE_REVERSE_MAP[nota.bimestre];
          if (bimo && (PONDERACIONES as readonly string[]).includes(nota.tipoNota)) {
            filledDraft[bimo][nota.tipoNota as Ponderacion] = String(nota.valor);
            if (!ids[bimo]) ids[bimo] = {} as Record<Ponderacion, number>;
            ids[bimo][nota.tipoNota as Ponderacion] = nota.id;
          }
          if (nota.docenteId) {
            setDocenteId(nota.docenteId);
          }
        });
        setDraft(filledDraft);
        setExistingNotas(ids);
      }
    } catch (e) {
      console.error("Error al cargar detalle de notas:", e);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cancelEdit = () => {
    setEditandoMateriaId(null);
    setDraft({ 1: { ...EMPTY_DRAFT_CELL }, 2: { ...EMPTY_DRAFT_CELL }, 3: { ...EMPTY_DRAFT_CELL }, 4: { ...EMPTY_DRAFT_CELL } });
    setExistingNotas({} as Record<Bim, Record<Ponderacion, number>>);
    setDocenteId(0);
  };

  const changeDraft = (b: Bim, p: Ponderacion, v: string) => {
    setDraft((d) => ({
      ...d,
      [b]: { ...d[b], [p]: v },
    }));
  };

  const saveRow = async (fila: FilaTabla) => {
    const derivedDocenteId = docenteId || Number(userLogin?.id) || 0;
    if (!derivedDocenteId) {
      toast.error("No se encontró el docente para esta materia. Edita la fila primero para cargar los datos.");
      return;
    }

    const derivedSeccionId = seccionId || 0;
    if (!derivedSeccionId) {
      toast.error("No se encontró la sección del alumno.");
      return;
    }

    const ops: Array<{ b: Bim; p: Ponderacion; val: number }> = [];

    for (const b of [1, 2, 3, 4] as Bim[]) {
      for (const p of PONDERACIONES) {
        const raw = draft[b]?.[p]?.trim();
        if (raw === "") continue;
        const num = parseFloat(raw);
        if (isNaN(num) || num < 1 || num > 10) {
          toast.error(`Nota inválida en ${PONDERACION_LABELS[p]} ${b}° bimestre (1 a 10)`);
          return;
        }
        ops.push({ b, p, val: num });
      }
    }

    if (ops.length === 0) {
      toast.message("No hay notas para guardar");
      cancelEdit();
      return;
    }

    try {
      for (const { b, p, val } of ops) {
        const existingId = existingNotas[b]?.[p];
        const payload = {
          alumnoId: Number(alumnoId),
          asignaturaId: Number(fila.materiaId),
          seccionId: derivedSeccionId,
          bimestre: BIMESTRE_MAP[b],
          cicloLectivo: String(anioLectivo),
          tipoNota: p,
          valor: val,
          docenteId: derivedDocenteId,
        };

        if (existingId) {
          await updateNota({ id: String(existingId), data: payload }).unwrap();
        } else {
          await createNota(payload).unwrap();
        }
      }

      toast.success("Notas guardadas correctamente");
      cancelEdit();
      onSaved?.();
      refetch();
    } catch (e) {
      console.error("Error al guardar notas:", e);
      const msg =
        (e as { data?: { message?: string } })?.data?.message || "Error al guardar notas";
      toast.error(msg);
    }
  };

  const exportarListaNotasExcel = () => {
    try {
      const headers = ["Materia", "Bimestre 1", "Bimestre 2", "Bimestre 3", "Bimestre 4", "Promedio"];
      const dataToExport = rows.map((fila) => [
        fila.materia,
        fila.bimestre1 === "" ? "-" : fila.bimestre1,
        fila.bimestre2 === "" ? "-" : fila.bimestre2,
        fila.bimestre3 === "" ? "-" : fila.bimestre3,
        fila.bimestre4 === "" ? "-" : fila.bimestre4,
        fila.promedio,
      ]);

      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
      worksheet["!cols"] = [{ width: 30 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 12 }];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notas");
      const fecha = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Notas_${dataAlumno?.nombre || ""}_${dataAlumno?.apellido || ""}_${anioLectivo}_${fecha}.xlsx`);
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
      doc.rect(0, 0, pageWidth, 10, "F");
      doc.setFontSize(18);
      doc.setTextColor(...darkText);
      doc.setFont("helvetica", "bold");
      doc.text("REPORTE DE NOTAS", pageWidth / 2, currentY, { align: "center" });
      currentY += 10;
      doc.setFontSize(10);
      doc.setTextColor(...grayText);
      doc.setFont("helvetica", "normal");
      doc.text("Instituto Educativo Excelencia", pageWidth / 2, currentY, { align: "center" });
      currentY += 15;
      doc.setFontSize(12);
      doc.setTextColor(...darkText);
      doc.setFont("helvetica", "bold");
      doc.text("INFORMACIÓN DEL ALUMNO", margin, currentY);
      currentY += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Nombre: ${dataAlumno?.nombre || ""} ${dataAlumno?.apellido || ""}`, margin, currentY);
      doc.text(`Año Lectivo: ${anioLectivo}`, pageWidth / 2, currentY);
      currentY += 6;
      doc.text(`DNI: ${dataAlumno?.dni || "-"}`, margin, currentY);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY);
      currentY += 6;
      doc.text(`Dirección: ${dataAlumno?.direccion || "-"}`, margin, currentY);
      currentY += 6;
      doc.text(`Grado/Sección: ${dataAlumno?.grado || "-"} / ${dataAlumno?.seccion || "-"}`, margin, currentY);
      currentY += 15;

      const headers = [["Materia", "Bim. 1", "Bim. 2", "Bim. 3", "Bim. 4", "Promedio"]];
      const data = rows.map((fila) => [
        fila.materia,
        fila.bimestre1 === "" ? "-" : String(fila.bimestre1),
        fila.bimestre2 === "" ? "-" : String(fila.bimestre2),
        fila.bimestre3 === "" ? "-" : String(fila.bimestre3),
        fila.bimestre4 === "" ? "-" : String(fila.bimestre4),
        String(fila.promedio),
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        startY: currentY,
        theme: "grid",
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9, cellPadding: 3 },
        bodyStyles: { textColor: darkText, fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [225, 235, 255] },
        styles: { lineColor: [200, 200, 200], lineWidth: 0.1 },
        margin: { top: currentY },
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`Reporte_Notas_${dataAlumno?.nombre || ""}_${dataAlumno?.apellido || ""}_${anioLectivo}_${fecha}.pdf`);
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
          <Button className="cursor-pointer bg-green-600 hover:bg-green-700" onClick={exportarListaNotasExcel}>
            Exportar a Excel
          </Button>
          <Button className="cursor-pointer bg-red-600 hover:bg-red-700" onClick={exportarListaNotasPDF}>
            Exportar a PDF
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Notas del Alumno</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Materia</TableHead>
              <TableHead className="min-w-[130px]">1° Bimestre</TableHead>
              <TableHead className="min-w-[130px]">2° Bimestre</TableHead>
              <TableHead className="min-w-[130px]">3° Bimestre</TableHead>
              <TableHead className="min-w-[130px]">4° Bimestre</TableHead>
              <TableHead className="font-bold min-w-[70px]">Promedio</TableHead>
              <TableHead className="min-w-[90px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((fila) => {
              const editing = editandoMateriaId === fila.materiaId;

              return (
                <TableRow key={fila.materiaId}>
                  <TableCell className="font-medium">{fila.materia}</TableCell>

                  {([1, 2, 3, 4] as Bim[]).map((b) => (
                    <TableCell key={`${fila.materiaId}-${b}`} className="align-top">
                      {editing ? (
                        cargandoDetalle ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1.5">
                            {PONDERACIONES.map((p) => (
                              <div key={p} className="flex items-center gap-1">
                                <span className="text-[10px] text-muted-foreground w-12 text-right shrink-0">
                                  {PONDERACION_LABELS[p][0]}.
                                </span>
                                <Input
                                  type="number"
                                  min="1"
                                  max="10"
                                  step="0.1"
                                  className="w-14 h-7 text-xs"
                                  value={draft[b]?.[p] ?? ""}
                                  onChange={(e) => changeDraft(b, p, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <span className="text-sm">
                          {toStr(fila[`bimestre${b}` as keyof FilaTabla]) === "" ? "-" : fila[`bimestre${b}` as keyof FilaTabla]}
                        </span>
                      )}
                    </TableCell>
                  ))}

                  <TableCell className="font-bold text-center">{fila.promedio}</TableCell>

                  <TableCell>
                    {editing ? (
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer h-7 text-xs"
                          disabled={saving || cargandoDetalle}
                          onClick={() => saveRow(fila)}
                        >
                          {saving ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="cursor-pointer h-7 text-xs"
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
      </div>

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
