"use client";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateOrUpdateNotaMutation } from "@/redux/services/notasApi";
import { NotaParcial } from "../../../types/nota.type";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AlumnoClase {
    id: string;
    nombre: string;
    apellido: string;
    grado: string;
    seccion: string;
    notas: NotaParcial[];
    promedio: number | null;
}

interface TablasAlumnosClasesProps {
    AlumnosClase: AlumnoClase[] | undefined;
    docenteId: string;
    materiaId: string;
    claseId: string;
    refetch: () => void;
    anioLectivo: number;
    materiaNombre: string;
}

const TablasAlumnosClases = ({
    AlumnosClase,
    docenteId,
    materiaId,
    claseId,
    anioLectivo,
    materiaNombre,
    refetch,
}: TablasAlumnosClasesProps) => {
    const [createOrUpdateNota] = useCreateOrUpdateNotaMutation();

    // fila en edición
    const [editandoId, setEditandoId] = useState<string | null>(null);
    // notas locales para edición
    const [editNotas, setEditNotas] = useState<Record<string, Record<number, string>>>({});
    const [alumnos, setAlumnos] = useState(AlumnosClase ?? []);

    useEffect(() => {
        if (AlumnosClase) setAlumnos(AlumnosClase);
    }, [AlumnosClase]);


    if (!AlumnosClase || AlumnosClase.length === 0) {
        return <p>No hay alumnos en esta clase</p>;
    }

    const handleNotaChange = (
        alumnoId: string,
        bimestre: number,
        value: string
    ) => {
        setEditNotas((prev) => ({
            ...prev,
            [alumnoId]: {
                ...prev[alumnoId],
                [bimestre]: value,
            },
        }));
    };



    const handleGuardarFila = async (alumnoId: string) => {
        const notasDelAlumno = editNotas[alumnoId];
        if (!notasDelAlumno) return;

        try {
            for (const [bimestreStr, valor] of Object.entries(notasDelAlumno)) {
                const bimestre = parseInt(bimestreStr, 10);
                const notaNum = parseFloat(valor);

                await createOrUpdateNota({
                    estudianteId: alumnoId,
                    materiaId,
                    bimestre,
                    valor: notaNum,
                    docenteId,
                    claseId,
                }).unwrap();

                // 🔥 actualizar en memoria
                setAlumnos((prev) =>
                    prev.map((a) =>
                        a.id === alumnoId
                            ? {
                                ...a,
                                notas: [
                                    ...a.notas.filter((n) => n.bimestre !== bimestre),
                                    { bimestre, valor: notaNum },
                                ],
                            }
                            : a
                    )
                );
            }

            toast.success("Notas guardadas correctamente");
            setEditandoId(null);
            setEditNotas((prev) => {
                const nuevo = { ...prev };
                delete nuevo[alumnoId];
                return nuevo;
            });
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar las notas");
        }
    };

    // 🔥 exportar lista de notas a Excel
    const exportarListaNotasExcel = () => {
        try {
            // Encabezados
            const headers = [
                "Nombre",
                "Grado",
                "Sección",
                "1° Bimestre",
                "2° Bimestre",
                "3° Bimestre",
                "4° Bimestre",
                "Promedio"
            ];

            // Datos formateados usando las filas actuales
            const dataToExport = alumnos.map((alumno) => [
                alumno.nombre,
                alumno.grado,
                alumno.seccion,
                ...alumno.notas.map(nota => nota.valor),
                alumno.promedio
            ]);

            // Crear hoja de trabajo
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
            
            // Ajustar anchos de columna
            const columnWidths = [
                { width: 30 }, // Nombre
                { width: 15 }, // Grado
                { width: 10 }, // Sección
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
            XLSX.writeFile(workbook, `Notas_${materiaNombre}_${anioLectivo}_${fecha}.xlsx`);
            
            toast.success("Archivo Excel exportado correctamente");
            console.log(`Exportación exitosa: ${alumnos.length} alumnos exportadas`);
        } catch (error) {
            console.error("Error en exportación a Excel:", error);
            toast.error("Error al exportar el archivo Excel");
        }
    };

    // 🔥 exportar lista de notas a PDF - VERSIÓN CORREGIDA
    const exportarListaNotasPDF = () => {
        try {
            // Crear nuevo documento PDF
            const doc = new jsPDF();
            
            // Título del documento
            doc.setFontSize(18);
            doc.text("Reporte de Notas", 14, 15);
            doc.setFontSize(12);
            doc.text(`Alumno: - Fecha: ${new Date().toLocaleDateString()}`, 14, 22);
            
            // Preparar datos para la tabla
            const headers = [
                ["Nombre", "Grado", "Sección", "1° Bimestre", "2° Bimestre", "3° Bimestre", "4° Bimestre", "Promedio"]
            ];
            
            const data = alumnos.map((alumno) => [
                alumno.nombre,
                alumno.grado,
                alumno.seccion,
                ...alumno.notas.map(nota => nota.valor),
                alumno.promedio
            ]);
            
            // Generar tabla
            autoTable(doc, {
                head: headers,
                body: data,
                startY: 35, // ✅ Ajustado porque añadimos más texto arriba
                styles: { fontSize: 9 },
                headStyles: { fillColor: [66, 135, 245] },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { top: 35 }
            });
            
            // Guardar PDF
            const fecha = new Date().toISOString().slice(0, 10);
            doc.save(`Notas_${materiaNombre}_${anioLectivo}_${fecha}.pdf`);
            
            toast.success("Archivo PDF exportado correctamente");
        } catch (error) {
            console.error("Error en exportación a PDF:", error);
            toast.error("Error al exportar el archivo PDF");
        }
    };



    return (
        <div className="p-4  rounded-xl shadow-md">
              <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notas de {materiaNombre} - {anioLectivo}</h3>
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
            <h2 className="text-lg font-semibold mb-4">Lista de Alumnos</h2>
            <Table>
                <TableCaption>Notas de los alumnos de la clase</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Grado</TableHead>
                        <TableHead>Sección</TableHead>
                        <TableHead>1° Bimestre</TableHead>
                        <TableHead>2° Bimestre</TableHead>
                        <TableHead>3° Bimestre</TableHead>
                        <TableHead>4° Bimestre</TableHead>
                        <TableHead>Promedio</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {alumnos.map((alumno) => {
                        const estaEditando = editandoId === alumno.id;

                        return (
                            <TableRow key={alumno.id}>
                                <TableCell>{alumno.nombre} {alumno.apellido}</TableCell>
                                <TableCell>{alumno.grado}</TableCell>
                                <TableCell>{alumno.seccion}</TableCell>
                                {[1, 2, 3, 4].map((bimestre) => {
                                    const notaExistente = alumno.notas.find(
                                        (n) => n.bimestre === bimestre
                                    );
                                    const valorLocal = editNotas[alumno.id]?.[bimestre] ?? "";

                                    return (
                                        <TableCell key={bimestre}>
                                            {estaEditando ? (
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="1"
                                                    max="10"
                                                    className="w-20"
                                                    value={
                                                        valorLocal !== ""
                                                            ? valorLocal
                                                            : notaExistente?.valor?.toString() ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        handleNotaChange(alumno.id, bimestre, e.target.value)
                                                    }
                                                />
                                            ) : (
                                                <span>{notaExistente?.valor ?? "-"}</span>
                                            )}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{alumno.promedio ?? "-"}</TableCell>
                                <TableCell>
                                    {estaEditando ? (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleGuardarFila(alumno.id)}
                                                className="cursor-pointer"
                                            >
                                                Guardar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="cursor-pointer"
                                                onClick={() => setEditandoId(null)}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => setEditandoId(alumno.id)}
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
    );
};

export default TablasAlumnosClases;
