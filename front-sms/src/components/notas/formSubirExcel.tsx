"use client";
import { useUploadNotasExcelMutation, useUpdateNotaMutation, useGetNotasBySeccionAsignaturaBimestreQuery } from "@/redux/services/notasApi";
import { useGetAsignaturasQuery, useGetAsignaturasByDocenteQuery } from "@/redux/services/asignatura.Api";
import { useGetSeccionesQuery } from "@/redux/services/seccionesApi";
import { useGetUsuariosByRolQuery } from "@/redux/services/authApi";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useRef } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ChevronLeft, FileSpreadsheet, Info, Loader2, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { selectUserLogin } from "@/redux/features/userSlice";
import * as XLSX from "xlsx";

const BIMESTRE_MAP: Record<number, string> = {
  1: "PRIMERO",
  2: "SEGUNDO",
  3: "TERCERO",
  4: "CUARTO",
};

const BIMESTRE_LABEL: Record<string, string> = {
  PRIMERO: "1er Bimestre",
  SEGUNDO: "2do Bimestre",
  TERCERO: "3er Bimestre",
  CUARTO: "4to Bimestre",
};

interface ExcelRow {
  fila: number;
  codigoAlumno: string;
  tipoNota: string;
  bimestre: number;
  bimestreTexto: string;
  valor: number;
}

interface ConflictRow {
  fila: number;
  codigoAlumno: string;
  tipoNota: string;
  bimestre: number;
  bimestreTexto: string;
  bimestreLabel: string;
  nuevoValor: number;
  estado: "nuevo" | "conflicto";
  notaActual?: number;
  notaId?: number;
  accion: "subir" | "saltar";
}

const formExcelSchema = z.object({
  seccionId: z.string().min(1, { message: "La sección es requerida" }),
  asignaturaId: z.string().min(1, { message: "La asignatura es requerida" }),
  cicloLectivo: z.string().min(4, { message: "El ciclo lectivo es requerido" }),
  docenteId: z.string().min(1, { message: "El docente es requerido" }),
});

const FormSubirExcel = () => {
  const router = useRouter();
  const userLogin = useSelector(selectUserLogin);
  const isDocente = userLogin?.role === "DOCENTE";
  const docenteIdNum = userLogin?.userId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"form" | "revisar" | "subiendo" | "resultado">("form");
  const [error, setError] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [_excelRows, setExcelRows] = useState<ExcelRow[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [conflictRows, setConflictRows] = useState<ConflictRow[]>([]);
  const [progreso, setProgreso] = useState({ actual: 0, total: 0 });
  const [resultado, setResultado] = useState<{ subidas: number; actualizadas: number; saltadas: number; errores: number } | null>(null);

  const [valoresForm, setValoresForm] = useState<z.infer<typeof formExcelSchema> | null>(null);

  const [uploadNotasExcel] = useUploadNotasExcelMutation();
  const [updateNota] = useUpdateNotaMutation();

  const skipNotas = !valoresForm || step !== "revisar";
  const { data: notasB1, isError: errB1 } = useGetNotasBySeccionAsignaturaBimestreQuery(
    valoresForm ? { seccionId: valoresForm.seccionId, asignaturaId: valoresForm.asignaturaId, bimestre: "PRIMERO" } : { seccionId: "", asignaturaId: "", bimestre: "PRIMERO" },
    { skip: skipNotas }
  );
  const { data: notasB2, isError: errB2 } = useGetNotasBySeccionAsignaturaBimestreQuery(
    valoresForm ? { seccionId: valoresForm.seccionId, asignaturaId: valoresForm.asignaturaId, bimestre: "SEGUNDO" } : { seccionId: "", asignaturaId: "", bimestre: "SEGUNDO" },
    { skip: skipNotas }
  );
  const { data: notasB3, isError: errB3 } = useGetNotasBySeccionAsignaturaBimestreQuery(
    valoresForm ? { seccionId: valoresForm.seccionId, asignaturaId: valoresForm.asignaturaId, bimestre: "TERCERO" } : { seccionId: "", asignaturaId: "", bimestre: "TERCERO" },
    { skip: skipNotas }
  );
  const { data: notasB4, isError: errB4 } = useGetNotasBySeccionAsignaturaBimestreQuery(
    valoresForm ? { seccionId: valoresForm.seccionId, asignaturaId: valoresForm.asignaturaId, bimestre: "CUARTO" } : { seccionId: "", asignaturaId: "", bimestre: "CUARTO" },
    { skip: skipNotas }
  );

  const { data: seccionesData, isLoading: isLoadingSecciones } = useGetSeccionesQuery();
  const { data: todasAsignaturas, isLoading: isLoadingAsignaturas } = useGetAsignaturasQuery(undefined, {
    skip: isDocente,
  });
  const { data: asignaturasDocente, isLoading: isLoadingAsignaturasDocente } = useGetAsignaturasByDocenteQuery(docenteIdNum!, {
    skip: !isDocente || !docenteIdNum,
  });
  const { data: docentesData, isLoading: isLoadingDocentes } = useGetUsuariosByRolQuery("DOCENTE", {
    skip: isDocente,
  });

  const todasNotasExistentes = useMemo(() => {
    const all = [
      ...(errB1 ? [] : notasB1?.data ?? []),
      ...(errB2 ? [] : notasB2?.data ?? []),
      ...(errB3 ? [] : notasB3?.data ?? []),
      ...(errB4 ? [] : notasB4?.data ?? []),
    ];
    const map = new Map<string, { id: number; valor: number }>();
    for (const n of all) {
      const key = `${n.alumnoCodigo}|${n.tipoNota}|${n.bimestre}`;
      map.set(key, { id: n.id, valor: n.valor });
    }
    return map;
  }, [notasB1, notasB2, notasB3, notasB4, errB1, errB2, errB3, errB4]);

  const asignaturas = useMemo(() => {
    if (isDocente) return asignaturasDocente?.data ?? [];
    return todasAsignaturas?.data ?? [];
  }, [isDocente, asignaturasDocente, todasAsignaturas]);

  const form = useForm<z.infer<typeof formExcelSchema>>({
    resolver: zodResolver(formExcelSchema),
    defaultValues: {
      seccionId: "",
      asignaturaId: "",
      cicloLectivo: "",
      docenteId: isDocente && docenteIdNum ? String(docenteIdNum) : "",
    },
  });

  const loading = isLoadingSecciones || isLoadingAsignaturas || isLoadingAsignaturasDocente || isLoadingDocentes;

  const parsearExcel = (file: File): Promise<ExcelRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const parsed: ExcelRow[] = [];
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.every((c) => c === undefined || c === null || c === "")) continue;
            const codigo = String(row[0] ?? "").trim();
            const tipo = String(row[1] ?? "").trim();
            const bim = Number(row[2]);
            const val = Number(row[3]);
            if (!codigo || !tipo || isNaN(bim) || isNaN(val)) continue;
            if (bim < 1 || bim > 4) continue;
            if (val < 0 || val > 100) continue;
            parsed.push({
              fila: i + 1,
              codigoAlumno: codigo,
              tipoNota: tipo,
              bimestre: bim,
              bimestreTexto: BIMESTRE_MAP[bim],
              valor: val,
            });
          }
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const cargarRevision = async () => {
    const values = form.getValues();
    if (!archivo) {
      setError("Debe seleccionar un archivo Excel");
      return;
    }
    setError("");
    setValoresForm(values);

    try {
      const rows = await parsearExcel(archivo);
      setExcelRows(rows);

      if (rows.length === 0) {
        setError("El archivo no contiene filas válidas. Verifique el formato.");
        return;
      }

      setStep("revisar");

      setTimeout(() => {
          const conflictos: ConflictRow[] = rows.map((r) => {
          const key = `${r.codigoAlumno}|${r.tipoNota}|${r.bimestreTexto}`;
          const existing = todasNotasExistentes.get(key);
          return {
            fila: r.fila,
            codigoAlumno: r.codigoAlumno,
            tipoNota: r.tipoNota,
            bimestre: r.bimestre,
            bimestreTexto: r.bimestreTexto,
            bimestreLabel: BIMESTRE_LABEL[r.bimestreTexto] || r.bimestreTexto,
            nuevoValor: r.valor,
            estado: existing ? "conflicto" : "nuevo",
            notaActual: existing?.valor,
            notaId: existing?.id,
            accion: existing ? "saltar" : "subir",
          };
        });
        setConflictRows(conflictos);
      }, 300);
    } catch {
      setError("Error al leer el archivo Excel. Verifique que sea un .xlsx válido.");
    }
  };

  const toggleAccion = (index: number) => {
    setConflictRows((prev) =>
      prev.map((r, i) =>
        i === index && r.estado === "conflicto"
          ? { ...r, accion: r.accion === "subir" ? "saltar" : "subir" }
          : r
      )
    );
  };

  const seleccionarTodos = (accion: "subir" | "saltar") => {
    setConflictRows((prev) =>
      prev.map((r) =>
        r.estado === "conflicto" ? { ...r, accion } : r
      )
    );
  };

  const generarExcelDesdeFilas = (rows: { codigoAlumno: string; tipoNota: string; bimestre: number; valor: number }[]): File => {
    const header = ["Codigo Alumno", "Tipo Nota", "Bimestre", "Valor"];
    const data = rows.map((r) => [r.codigoAlumno, r.tipoNota, r.bimestre, r.valor]);
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notas");
    const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new File([wbOut], "notas_nuevas.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  };

  const subirNotas = async () => {
    if (!valoresForm) return;
    setStep("subiendo");

    const aActualizar = conflictRows.filter((r) => r.accion === "subir" && r.estado === "conflicto");
    const aSubirExcel = conflictRows.filter((r) => r.accion === "subir" && r.estado === "nuevo");
    const aSaltar = conflictRows.filter((r) => r.accion === "saltar" && r.estado === "conflicto");

    const total = aActualizar.length + (aSubirExcel.length > 0 ? 1 : 0);
    setProgreso({ actual: 0, total });

    let subidas = 0;
    let actualizadas = 0;
    let errores = 0;

    // 1. Subir notas nuevas mediante el endpoint de Excel (usa códigos de alumno)
    if (aSubirExcel.length > 0) {
      try {
        const excelNuevo = generarExcelDesdeFilas(
          aSubirExcel.map((r) => ({ codigoAlumno: r.codigoAlumno, tipoNota: r.tipoNota, bimestre: r.bimestre, valor: r.nuevoValor }))
        );
        await uploadNotasExcel({
          seccionId: Number(valoresForm.seccionId),
          asignaturaId: Number(valoresForm.asignaturaId),
          cicloLectivo: valoresForm.cicloLectivo,
          docenteId: Number(valoresForm.docenteId),
          archivo: excelNuevo,
        }).unwrap();
        subidas = aSubirExcel.length;
      } catch {
        errores = aSubirExcel.length;
      }
      setProgreso({ actual: 1, total });
    }

    // 2. Actualizar notas existentes (conflictos marcados como "subir")
    for (const row of aActualizar) {
      try {
        await updateNota({
          id: String(row.notaId!),
          data: {
            valor: row.nuevoValor,
            tipoNota: row.tipoNota,
            bimestre: row.bimestreTexto,
            docenteId: Number(valoresForm.docenteId),
            cicloLectivo: valoresForm.cicloLectivo,
          },
        }).unwrap();
        actualizadas++;
      } catch {
        errores++;
      }
      setProgreso({ actual: subidas + actualizadas + errores, total });
    }

    setResultado({
      subidas,
      actualizadas,
      saltadas: aSaltar.length,
      errores,
    });
    setStep("resultado");
  };

  if (loading) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="animate-spin h-48 w-48 mx-auto" />
      </section>
    );
  }

  if (step === "subiendo") {
    return (
      <section className="container mx-auto py-20 px-5 max-w-lg">
        <div className="text-center space-y-6">
          <Loader2 className="animate-spin h-16 w-16 mx-auto text-primary" />
          <p className="text-lg font-medium">Subiendo notas...</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progreso.total > 0 ? (progreso.actual / progreso.total) * 100 : 0}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {progreso.actual} de {progreso.total}
          </p>
        </div>
      </section>
    );
  }

  if (step === "resultado" && resultado) {
    return (
      <section className="container mx-auto py-20 px-5 max-w-lg">
        <div className="text-center space-y-6">
          <CheckCircle2 className="h-16 w-16 mx-auto text-green-600" />
          <p className="text-lg font-semibold">Carga finalizada</p>
          <div className="space-y-2 text-sm">
            {resultado.subidas > 0 && (
              <p><span className="font-medium text-green-600">{resultado.subidas}</span> nota(s) nueva(s) subida(s)</p>
            )}
            {resultado.actualizadas > 0 && (
              <p><span className="font-medium text-blue-600">{resultado.actualizadas}</span> nota(s) actualizada(s)</p>
            )}
            {resultado.saltadas > 0 && (
              <p><span className="font-medium text-amber-600">{resultado.saltadas}</span> nota(s) saltada(s) (ya existían)</p>
            )}
            {resultado.errores > 0 && (
              <p><span className="font-medium text-destructive">{resultado.errores}</span> error(es)</p>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/dashboard/notas")} className="cursor-pointer">
              Ir a lista de notas
            </Button>
            <Button variant="outline" onClick={() => { setStep("form"); setResultado(null); setArchivo(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="cursor-pointer">
              Subir otro archivo
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {step === "form" && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">Formato requerido del archivo Excel</p>
            <p className="text-sm mb-2">
              El archivo debe tener las siguientes 4 columnas. La primera fila debe ser el encabezado.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-blue-300 dark:border-blue-700">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-900/40">
                    <th className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-left font-medium">Columna A</th>
                    <th className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-left font-medium">Columna B</th>
                    <th className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-left font-medium">Columna C</th>
                    <th className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-left font-medium">Columna D</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50/50 dark:bg-blue-950/10">
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 font-medium">Código Alumno</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 font-medium">Tipo Nota</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 font-medium">Bimestre</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 font-medium">Valor</td>
                  </tr>
                  <tr>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-muted-foreground">ALU-0001</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-muted-foreground">Tareas</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-muted-foreground">1</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-muted-foreground">85</td>
                  </tr>
                  <tr>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-muted-foreground">ALU-0002</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-muted-foreground">Examen</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-muted-foreground">2</td>
                    <td className="border border-blue-300 dark:border-blue-700 px-3 py-1.5 text-muted-foreground">92</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="mt-2 text-xs space-y-0.5 list-disc list-inside">
              <li><strong>Código Alumno:</strong> texto (ej: ALU-0001)</li>
              <li><strong>Tipo Nota:</strong> texto (ej: Tareas, Examen, Trabajo Practico)</li>
              <li><strong>Bimestre:</strong> número entero (1, 2, 3 o 4)</li>
              <li><strong>Valor:</strong> número entre 0 y 100</li>
              <li>La primera fila es el encabezado y se ignora automáticamente</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {step === "form" ? (
        <Form {...form}>
          <form onSubmit={(e) => { e.preventDefault(); cargarRevision(); }} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="seccionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sección</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una sección" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {seccionesData?.data?.map((seccion) => (
                          <SelectItem key={seccion.id} value={String(seccion.id)}>
                            {seccion.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Sección a la que pertenecen las notas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="asignaturaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asignatura</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={isDocente ? "Selecciona una de tus asignaturas" : "Selecciona una asignatura"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {asignaturas.map((asignatura) => (
                          <SelectItem key={asignatura.id} value={String(asignatura.id)}>
                            {asignatura.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {isDocente ? "Asignatura que impartes." : "Asignatura de las notas."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cicloLectivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo Lectivo</FormLabel>
                    <FormControl>
                      <Input placeholder="2024-2025" {...field} />
                    </FormControl>
                    <FormDescription>Ciclo lectivo (ej: 2024-2025).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isDocente ? (
                <FormItem>
                  <FormLabel>Docente</FormLabel>
                  <FormControl>
                    <Input value={`${userLogin?.email || ""}`} disabled className="bg-muted" />
                  </FormControl>
                  <FormDescription>Docente que asigna las notas (autocompletado).</FormDescription>
                </FormItem>
              ) : (
                <FormField
                  control={form.control}
                  name="docenteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Docente</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un docente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {docentesData?.data?.map((docente) => (
                            <SelectItem key={docente.id} value={String(docente.id)}>
                              {docente.nombre} {docente.apellido} ({docente.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Docente que asigna las notas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormItem>
              <FormLabel>Archivo Excel</FormLabel>
              <FormControl>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setArchivo(file);
                    setError("");
                  }}
                  className="cursor-pointer"
                />
              </FormControl>
              <FormDescription>
                Archivo Excel con las notas a cargar (.xlsx o .xls).
              </FormDescription>
              {archivo && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <span>{archivo.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(archivo.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
              <FormMessage />
            </FormItem>

            <div className="flex gap-4">
              <Button type="submit" disabled={!archivo} className="cursor-pointer">
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Revisar y confirmar
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/dashboard/notas")}
              >
                Cancelar
              </Button>
            </div>
          </form>

          <div className="mt-5 space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </Form>
      ) : (
        <div className="space-y-6">
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-1">Revisión de notas</p>
              <p className="text-sm">
                Se encontraron <strong>{conflictRows.length}</strong> fila(s) en el Excel.
                Las filas marcadas como <strong className="text-destructive">conflicto</strong> ya tienen una nota existente.
                Elegí si querés <strong>actualizar</strong> el valor o <strong>saltar</strong> esa fila.
              </p>
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Acción para conflictos:</span>
            <Button variant="outline" size="sm" onClick={() => seleccionarTodos("subir")} className="cursor-pointer">
              Actualizar todos
            </Button>
            <Button variant="outline" size="sm" onClick={() => seleccionarTodos("saltar")} className="cursor-pointer">
              Saltar todos
            </Button>
          </div>

          <div className="rounded-md border max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Alumno</TableHead>
                  <TableHead>Tipo Nota</TableHead>
                  <TableHead>Bimestre</TableHead>
                  <TableHead>Valor Nuevo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Valor Actual</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conflictRows.map((row, i) => (
                  <TableRow key={i} className={row.estado === "conflicto" ? "bg-red-50/50 dark:bg-red-950/10" : ""}>
                    <TableCell className="text-xs text-muted-foreground">{row.fila}</TableCell>
                    <TableCell className="font-medium">{row.codigoAlumno}</TableCell>
                    <TableCell>{row.tipoNota}</TableCell>
                    <TableCell>{row.bimestreLabel}</TableCell>
                    <TableCell>{row.nuevoValor}</TableCell>
                    <TableCell>
                      {row.estado === "conflicto" ? (
                        <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">Conflicto</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">Nuevo</span>
                      )}
                    </TableCell>
                    <TableCell>{row.notaActual !== undefined ? row.notaActual : "-"}</TableCell>
                    <TableCell>
                      {row.estado === "conflicto" ? (
                        <Button
                          variant={row.accion === "subir" ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleAccion(i)}
                          className="cursor-pointer text-xs h-7"
                        >
                          {row.accion === "subir" ? "Actualizar" : "Saltar"}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">A subir</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button onClick={subirNotas} disabled={conflictRows.filter((r) => r.accion === "subir").length === 0} className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" /> Subir {conflictRows.filter((r) => r.accion === "subir").length} nota(s)
            </Button>
            <Button variant="outline" onClick={() => setStep("form")} className="cursor-pointer">
              <ChevronLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSubirExcel;
