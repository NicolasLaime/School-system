"use client";
import { useUploadNotasExcelMutation } from "@/redux/services/notasApi";
import { useGetAsignaturasQuery } from "@/redux/services/asignatura.Api";
import { useGetSeccionesQuery } from "@/redux/services/seccionesApi";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
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
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formExcelSchema = z.object({
  seccionId: z.string().min(1, { message: "La seccion es requerida" }),
  asignaturaId: z.string().min(1, { message: "La asignatura es requerida" }),
  cicloLectivo: z.string().min(4, { message: "El ciclo lectivo es requerido" }),
  docenteId: z.string().min(1, { message: "El docente es requerido" }),
});

const FormSubirExcel = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadNotasExcel, { isLoading }] = useUploadNotasExcelMutation();
  const { data: asignaturasData, isLoading: isLoadingAsignaturas } = useGetAsignaturasQuery();
  const { data: seccionesData, isLoading: isLoadingSecciones } = useGetSeccionesQuery();

  const form = useForm<z.infer<typeof formExcelSchema>>({
    resolver: zodResolver(formExcelSchema),
    defaultValues: {
      seccionId: "",
      asignaturaId: "",
      cicloLectivo: "",
      docenteId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formExcelSchema>) {
    if (!archivo) {
      setError("Debe seleccionar un archivo Excel");
      return;
    }

    try {
      const response = await uploadNotasExcel({
        seccionId: Number(values.seccionId),
        asignaturaId: Number(values.asignaturaId),
        cicloLectivo: values.cicloLectivo,
        docenteId: Number(values.docenteId),
        archivo,
      }).unwrap();
      if (response) {
        setMessage("Notas cargadas correctamente desde Excel");
        setTimeout(() => {
          router.push("/dashboard/notas");
        }, 1500);
      } else {
        setError("Error al cargar las notas");
      }
    } catch (error) {
      console.error("Error al subir excel:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al cargar las notas.";
      setError(errorMessage);
    }
  }

  if (isLoadingAsignaturas || isLoadingSecciones) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="animate-spin h-48 w-48 mx-auto" />
      </section>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="seccionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seccion</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una seccion" />
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
                <FormDescription>Seccion a la que pertenecen las notas.</FormDescription>
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
                      <SelectValue placeholder="Selecciona una asignatura" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {asignaturasData?.data?.map((asignatura) => (
                      <SelectItem key={asignatura.id} value={String(asignatura.id)}>
                        {asignatura.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Asignatura de las notas.</FormDescription>
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
          <FormField
            control={form.control}
            name="docenteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Docente ID</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="ID del docente" {...field} />
                </FormControl>
                <FormDescription>ID del docente que asigna las notas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Archivo Excel</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setArchivo(file);
                  }}
                  className="cursor-pointer"
                />
              </div>
            </FormControl>
            <FormDescription>
              Archivo Excel con las notas a cargar (.xlsx o .xls).
            </FormDescription>
            <FormMessage />
          </FormItem>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || !archivo} className="cursor-pointer">
            {isLoading ? (
              <>Subiendo...</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" /> Subir Excel</>
            )}
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

        {mensaje && (
          <Alert className="border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {mensaje}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Form>
  );
};

export default FormSubirExcel;
