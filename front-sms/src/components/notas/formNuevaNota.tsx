"use client";
import { useCreateNotaMutation } from "@/redux/services/notasApi";
import { useGetAsignaturasQuery } from "@/redux/services/asignatura.Api";
import { useGetAlumnosQuery } from "@/redux/services/alumnosApi";
import { useGetSeccionesQuery } from "@/redux/services/seccionesApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formNotaSchema = z.object({
  alumnoId: z.string().min(1, { message: "El alumno es requerido" }),
  asignaturaId: z.string().min(1, { message: "La asignatura es requerida" }),
  seccionId: z.string().min(1, { message: "La seccion es requerida" }),
  bimestre: z.string().min(1, { message: "El bimestre es requerido" }),
  cicloLectivo: z.string().min(4, { message: "El ciclo lectivo es requerido" }),
  tipoNota: z.string().min(1, { message: "El tipo de nota es requerido" }),
  valor: z.string().min(1, { message: "El valor es requerido" }),
  docenteId: z.string().min(1, { message: "El docente es requerido" }),
});

const FormNuevaNota = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createNota, { isLoading }] = useCreateNotaMutation();
  const { data: asignaturasData, isLoading: isLoadingAsignaturas } = useGetAsignaturasQuery();
  const { data: alumnosData, isLoading: isLoadingAlumnos } = useGetAlumnosQuery();
  const { data: seccionesData, isLoading: isLoadingSecciones } = useGetSeccionesQuery();

  const form = useForm<z.infer<typeof formNotaSchema>>({
    resolver: zodResolver(formNotaSchema),
    defaultValues: {
      alumnoId: "",
      asignaturaId: "",
      seccionId: "",
      bimestre: "",
      cicloLectivo: "",
      tipoNota: "EXAMEN",
      valor: "",
      docenteId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formNotaSchema>) {
    try {
      const response = await createNota({
        alumnoId: Number(values.alumnoId),
        asignaturaId: Number(values.asignaturaId),
        seccionId: Number(values.seccionId),
        bimestre: values.bimestre,
        cicloLectivo: values.cicloLectivo,
        tipoNota: values.tipoNota,
        valor: Number(values.valor),
        docenteId: Number(values.docenteId),
      }).unwrap();
      if (response) {
        setMessage("Nota creada correctamente");
        setTimeout(() => {
          router.push("/dashboard/notas");
        }, 1500);
      } else {
        setError("Error al crear la nota");
      }
    } catch (error) {
      console.error("Error al crear nota:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear la nota.";
      setError(errorMessage);
    }
  }

  if (isLoadingAsignaturas || isLoadingAlumnos || isLoadingSecciones) {
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
            name="alumnoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alumno</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un alumno" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {alumnosData?.data?.map((alumno) => (
                      <SelectItem key={alumno.id} value={String(alumno.id)}>
                        {alumno.nombre} {alumno.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Alumno al que pertenece la nota.</FormDescription>
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
                <FormDescription>Asignatura de la nota.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormDescription>Seccion del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bimestre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bimestre</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un bimestre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PRIMERO">Primero</SelectItem>
                    <SelectItem value="SEGUNDO">Segundo</SelectItem>
                    <SelectItem value="TERCERO">Tercero</SelectItem>
                    <SelectItem value="CUARTO">Cuarto</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Bimestre de la nota.</FormDescription>
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
            name="tipoNota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Nota</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EXAMEN">Examen</SelectItem>
                    <SelectItem value="TRABAJO_PRACTICO">Trabajo Practico</SelectItem>
                    <SelectItem value="TAREA">Tarea</SelectItem>
                    <SelectItem value="PARTICIPACION">Participacion</SelectItem>
                    <SelectItem value="PROYECTO">Proyecto</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Tipo de evaluacion.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="10" step="0.1" placeholder="0-10" {...field} />
                </FormControl>
                <FormDescription>Valor de la nota (0-10).</FormDescription>
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
                <FormDescription>ID del docente que asigna la nota.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Nota"}
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

export default FormNuevaNota;
