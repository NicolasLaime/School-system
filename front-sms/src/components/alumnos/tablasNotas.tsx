"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Nota } from "../../../types/nota.type";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useCreateOrUpdateNotaMutation } from "@/redux/services/notasApi";
import { useSelector } from "react-redux";
import { selectUserLogin } from "@/redux/features/userSlice";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Alumno } from "../../../types/alumnos.types";
 // Importar el tipo Clase desde Usuario.type

interface TablasNotasProps {
  alumnoId: string;
  dataNotas: Nota[];
  onSaved?: () => void;
  anioLectivo: number;
  clasesDelAnio: Nota[]; // Este tipo podría ser incorrecto, probablemente debería ser Clase[]
  dataAlumno: Alumno | undefined;
}

type Bim = 1 | 2 | 3 | 4;

interface FilaTabla {
  materia: string;
  materiaId: string;
  codigo: string;
  ciclo: string;
  bimestre1: string | number;
  bimestre2: string | number;
  bimestre3: string | number;
  bimestre4: string | number;
  promedio: number | string;
}

// Definir tipo para el estado draft
type DraftState = Record<Bim, string>;

const TablasNotas = ({ alumnoId, dataNotas = [], onSaved, anioLectivo, clasesDelAnio = [], dataAlumno }: TablasNotasProps) => {
  const userLogin = useSelector(selectUserLogin);
  const [createOrUpdateNota, { isLoading: saving }] = useCreateOrUpdateNotaMutation();

  // 1) PIVOT inicial desde props
  const materiasPivot = useMemo(() => {
    const map = new Map<string, FilaTabla>();
    dataNotas.forEach((n) => {
      const key = n.materia.id;
      if (!map.has(key)) {
        map.set(key, {
          materia: n.materia.nombre,
          materiaId: n.materia.id,
          codigo: n.materia.codigo,
          ciclo: n.materia.ciclo,
          bimestre1: "",
          bimestre2: "",
          bimestre3: "",
          bimestre4: "",
          promedio: "",
        });
      }
      const row = map.get(key)!;
      // Corregir el acceso a la propiedad bimestre
      (row)[`bimestre${n.bimestre}`] = n.valor; // número
    });
    
    // Calcular promedios
    Array.from(map.values()).forEach(row => {
      const notas = [];
      if (typeof row.bimestre1 === 'number') notas.push(row.bimestre1);
      if (typeof row.bimestre2 === 'number') notas.push(row.bimestre2);
      if (typeof row.bimestre3 === 'number') notas.push(row.bimestre3);
      if (typeof row.bimestre4 === 'number') notas.push(row.bimestre4);
      
      if (notas.length > 0) {
        const sum = notas.reduce((a, b) => a + b, 0);
        row.promedio = (sum / notas.length).toFixed(2);
      } else {
        row.promedio = "-";
      }
    });
    
    return Array.from(map.values()).sort((a, b) => a.materia.localeCompare(b.materia));
  }, [dataNotas]);

  // 2) Estado local de filas (para reflejar cambios sin recargar)
  const [rows, setRows] = useState<FilaTabla[]>([]);
  useEffect(() => setRows(materiasPivot), [materiasPivot]);

  // 3) Edición por fila
  const [editandoMateriaId, setEditandoMateriaId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState>({
    1: "", 2: "", 3: "", 4: ""
  });

  const toStr = (v: string | number) => (v === "" ? "" : String(v));

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

  const getClaseIdPorMateria = (materiaId: string): string | null => {
    // Primero buscar en notas existentes que tengan claseId válido
    const notaConClase = dataNotas.find(n => 
      n.materia.id === materiaId && n.clase?.id
    );
    if (notaConClase?.clase?.id) {
      return notaConClase.clase.id;
    }
    
    // Si no existe, buscar en las inscripciones del año
    // Aquí asumimos que clasesDelAnio contiene objetos con propiedad clase
    const inscripcion = clasesDelAnio.find(
      (insc) => insc.clase?.materiaId === materiaId
    );
    return inscripcion?.clase?.id || null;
  };

  // Función para calcular promedio
  const calcularPromedio = (b1: string | number, b2: string | number, b3: string | number, b4: string | number): string => {
    const notas = [];
    if (typeof b1 === 'number') notas.push(b1);
    if (typeof b2 === 'number') notas.push(b2);
    if (typeof b3 === 'number') notas.push(b3);
    if (typeof b4 === 'number') notas.push(b4);
    
    if (notas.length > 0) {
      const sum = notas.reduce((a, b) => a + b, 0);
      return (sum / notas.length).toFixed(2);
    }
    return "-";
  };

  // Función para guardar una fila de la tabla
  const saveRow = async (fila: FilaTabla) => {
    if (!userLogin?.id) {
      toast.error("Usuario no autenticado");
      return;
    }

    const ops: Array<{ b: Bim; val: number }> = [];
    ([1, 2, 3, 4] as Bim[]).forEach((b) => {
      const raw = draft[b].trim();
      if (raw === "") return;
      const num = parseFloat(raw);
      if (isNaN(num) || num < 1 || num > 10) {
        toast.error(`Nota inválida en ${b}° bimestre (1 a 10)`);
        return;
      }
      const original = toStr((fila)[`bimestre${b}`]);
      if (original === raw) return;
      ops.push({ b, val: num });
    });

    if (ops.length === 0) {
      toast.message("No hay cambios por guardar");
      cancelEdit();
      return;
    }

    // Obtener claseId correcto
    const claseId = getClaseIdPorMateria(fila.materiaId);
    
    if (!claseId) {
      toast.error(`No se encontró la clase para la materia ${fila.materia}`);
      console.error(`Debug - Materia: ${fila.materia} (ID: ${fila.materiaId})`);
      console.error('Clases disponibles:', clasesDelAnio);
      return;
    }

    try {
      for (const { b, val } of ops) {
        await createOrUpdateNota({
          estudianteId: alumnoId,
          materiaId: fila.materiaId,
          claseId: claseId,
          bimestre: b,
          valor: val,
          docenteId: userLogin.id,
        }).unwrap();
      }

      // Actualizar estado local
      setRows((prev) =>
        prev.map((r) =>
          r.materiaId === fila.materiaId
            ? {
              ...r,
              bimestre1: draft[1] === "" ? r.bimestre1 : parseFloat(draft[1]),
              bimestre2: draft[2] === "" ? r.bimestre2 : parseFloat(draft[2]),
              bimestre3: draft[3] === "" ? r.bimestre3 : parseFloat(draft[3]),
              bimestre4: draft[4] === "" ? r.bimestre4 : parseFloat(draft[4]),
              promedio: calcularPromedio(
                draft[1] === "" ? r.bimestre1 : parseFloat(draft[1]),
                draft[2] === "" ? r.bimestre2 : parseFloat(draft[2]),
                draft[3] === "" ? r.bimestre3 : parseFloat(draft[3]),
                draft[4] === "" ? r.bimestre4 : parseFloat(draft[4])
              )
            }
            : r
        )
      );
      
      toast.success("Notas guardadas");
      cancelEdit();
      onSaved?.();
    } catch (e) {
      console.error('Error al guardar notas:', e);
      toast.error("Error al guardar notas");
    }
  };

  // 🔥 exportar lista de notas a Excel
  const exportarListaNotasExcel = () => {
    try {
      // Encabezados
      const headers = [
        "Materia",
        "Código",
        "Ciclo",
        "Bimestre 1",
        "Bimestre 2",
        "Bimestre 3",
        "Bimestre 4",
        "Promedio"
      ];

      // Datos formateados usando las filas actuales
      const dataToExport = rows.map((fila) => [
        fila.materia,
        fila.codigo,
        fila.ciclo,
        fila.bimestre1 === "" ? "-" : fila.bimestre1,
        fila.bimestre2 === "" ? "-" : fila.bimestre2,
        fila.bimestre3 === "" ? "-" : fila.bimestre3,
        fila.bimestre4 === "" ? "-" : fila.bimestre4,
        fila.promedio
      ]);

      // Crear hoja de trabajo
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
      
      // Ajustar anchos de columna
      const columnWidths = [
        { width: 30 }, // Materia
        { width: 15 }, // Código
        { width: 10 }, // Ciclo
        { width: 12 }, // Bimestre 1
        { width: 12 }, // Bimestre 2
        { width: 12 }, // Bimestre 3
        { width: 12 }, // Bimestre 4
        { width: 12 }, // Promedio
      ];
      worksheet['!cols'] = columnWidths;

      // Crear libro y guardar
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notas");
      
      // Generar nombre de archivo con fecha
      const fecha = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Notas ${dataAlumno?.nombre} ${dataAlumno?.apellido} ${anioLectivo}_${fecha}.xlsx`);
      
      toast.success("Archivo Excel exportado correctamente");
    } catch (error) {
      console.error("Error en exportación a Excel:", error);
      toast.error("Error al exportar el archivo Excel");
    }
  };

  // 🔥 exportar lista de notas a PDF
  const exportarListaNotasPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let currentY = 15;

      // Configuración de colores
      const primaryColor: [number, number, number] = [66, 135, 245];
      const lightBlue: [number, number, number] = [225, 235, 255];
      const darkText: [number, number, number] = [51, 51, 51];
      const grayText: [number, number, number] = [102, 102, 102];

      // Logo o encabezado
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 10, 'F');
      
      // Título del documento
      doc.setFontSize(18);
      doc.setTextColor(...darkText);
      doc.setFont('helvetica', 'bold');
      doc.text("REPORTE DE NOTAS", pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;

      // Información de la escuela
      doc.setFontSize(10);
      doc.setTextColor(...grayText);
      doc.setFont('helvetica', 'normal');
      doc.text("Instituto Educativo Excelencia", pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;

      // Información del alumno
      doc.setFontSize(12);
      doc.setTextColor(...darkText);
      doc.setFont('helvetica', 'bold');
      doc.text("INFORMACIÓN DEL ALUMNO", margin, currentY);
      currentY += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${dataAlumno?.nombre} ${dataAlumno?.apellido}`, margin, currentY);
      doc.text(`Año Lectivo: ${anioLectivo}`, pageWidth / 2, currentY);
      currentY += 6;

      doc.text(`DNI: ${dataAlumno?.dni}`, margin, currentY);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY);
      currentY += 6;

      doc.text(`Dirección: ${dataAlumno?.direccion}`, margin, currentY);
      currentY += 6;

      doc.text(`Grado/Sección: ${dataAlumno?.grado} / ${dataAlumno?.seccion}`, margin, currentY);
      currentY += 15;

      // Preparar datos para la tabla
      const headers = [
        ["Materia", "Código", "Ciclo", "Bim. 1", "Bim. 2", "Bim. 3", "Bim. 4", "Promedio"]
      ];
      
      const data = rows.map((fila) => [
        fila.materia,
        fila.codigo,
        fila.ciclo,
        fila.bimestre1 === "" ? "-" : String(fila.bimestre1),
        fila.bimestre2 === "" ? "-" : String(fila.bimestre2),
        fila.bimestre3 === "" ? "-" : String(fila.bimestre3),
        fila.bimestre4 === "" ? "-" : String(fila.bimestre4),
        String(fila.promedio)
      ]);

      // Generar tabla con mejor estilo
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
          cellPadding: 3
        },
        bodyStyles: {
          textColor: darkText,
          fontSize: 9,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: lightBlue
        },
        styles: {
          lineColor: [200, 200, 200],
          lineWidth: 0.1
        },
        margin: { top: currentY },
        didDrawPage: function() {
          // Pie de página
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Página ${(doc as jsPDF & { internal: { getNumberOfPages(): number } }).internal.getNumberOfPages()}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      });

      // // Calcular promedio general
      // const promedios = rows.map(row => {
      //   const promedio = typeof row.promedio === 'string' ? parseFloat(row.promedio) : row.promedio;
      //   return isNaN(promedio) ? 0 : promedio;
      // });
      
      // const promedioGeneral = promedios.length > 0 
      //   ? (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(2)
      //   : "0.00";
      
      // Añadir promedio general al final
      // const finalY = ((doc as any).lastAutoTable?.finalY || 0) + 10;
      // doc.setFontSize(10);
      // doc.setFont('helvetica', 'bold');
      // doc.setTextColor(...darkText);
      // doc.text(`Promedio General: ${promedioGeneral}`, pageWidth - margin, finalY, { align: 'right' });

      // Guardar PDF
      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`Reporte_Notas_${dataAlumno?.nombre}_${dataAlumno?.apellido}_${anioLectivo}_${fecha}.pdf`);
      
      toast.success("Archivo PDF exportado correctamente");
    } catch (error) {
      console.error("Error en exportación a PDF:", error);
      toast.error("Error al exportar el archivo PDF");
    }
  };

  return (
    <div className="p-4 rounded-xl shadow-md">
      {/* Agregar indicador del año */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notas del Año {anioLectivo}</h3>
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
          <p className="text-sm mt-2">Haz clic en Agregar Nota para comenzar.</p>
        </div>
      )}
    </div>
  );
};

export default TablasNotas;