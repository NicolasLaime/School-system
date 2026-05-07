"use client";
import { useCreateAsistenciaAlumnoMutation, useGetAsistenciasAlumnoBySeccionQuery } from "@/redux/services/asistenciasApi";
import { useGetSeccionesQuery } from "@/redux/services/seccionesApi";
import { useGetAlumnosPorSeccionQuery } from "@/redux/services/alumnosApi";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EstadoAsistencia } from "../../../types/asistencia.type";

const formAsistenciaAlumnoSchema = z.object({
  fecha: z.string().min(1, { message: "La fecha es requerida" }),
  seccionId: z.string().min(1, { message: "La seccion es requerida" }),
});

const estadosAsistencia: { value: EstadoAsistencia; label: string }[] = [
  { value: "PRESENTE", label: "Presente" },
  { value: "AUSENTE", label: "Ausente" },
  { value: "TARDANZA", label: "Tardanza" },
  { value: "JUSTIFICADO", label: "Justificado" },
];

const FormAsistenciaAlumno = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createAsistencia, { isLoading }] = useCreateAsistenciaAlumnoMutation();
  const { data: seccionesData, isLoading: isLoadingSecciones } = useGetSeccionesQuery();
  const [asistencias, setAsistencias] = useState<Record<number, EstadoAsistencia>>({});

  const form = useForm<z.infer<typeof formAsistenciaAlumnoSchema>>({
    resolver: zodResolver(formAsistenciaAlumnoSchema),
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
      seccionId: "",
    },
  });

  const seccionId = form.watch("seccionId");
  const fecha = form.watch("fecha");

  const { data: alumnosData, isLoading: isLoadingAlumnos } = useGetAlumnosPorSeccionQuery(seccionId || "", {
    skip: !seccionId,
  });

  const { data: asistenciasExistentes, isLoading: isLoadingAsistencias } = useGetAsistenciasAlumnoBySeccionQuery(
    { seccionId: seccionId || "", fecha },
    { skip: !seccionId || !fecha }
  );

  React.useEffect(() => {
    if (alumnosData?.data && !isLoadingAsistencias) {
      const map: Record<number, EstadoAsistencia> = {};

      if (asistenciasExistentes?.data) {
        asistenciasExistentes.data.forEach((a) => {
          map[a.alumnoId] = a.estado;
        });
      }
      console.log("Alumnos:", alumnosData?.data);
      alumnosData?.data?.forEach((alumno) => {
        if (!map[alumno.id]) {
          map[alumno.id] = "PRESENTE";
        }
      });

      setAsistencias(map);
    }
  }, [alumnosData, asistenciasExistentes, isLoadingAsistencias]);

  async function onSubmit() {
    try {
      setError("");
      setMessage("");

      const seccionIdNum = Number(seccionId);
      const promises = Object.entries(asistencias).map(([alumnoId, estado]) =>
        createAsistencia({
          fecha,
          estado,
          alumnoId: Number(alumnoId),
          seccionId: seccionIdNum,
        }).unwrap()
      );

      await Promise.all(promises);
      setMessage("Asistencias registradas correctamente");
      setTimeout(() => {
        router.push("/dashboard/asistencias");
      }, 1500);
    } catch (error) {
      console.error("Error al registrar asistencias:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al registrar las asistencias.";
      setError(errorMessage);
    }
  }

  const handleEstadoChange = (alumnoId: number, estado: EstadoAsistencia) => {
    setAsistencias((prev) => ({ ...prev, [alumnoId]: estado }));
  };

  const getEstadoColor = (estado: EstadoAsistencia) => {
    switch (estado) {
      case "PRESENTE": return "bg-green-100 text-green-700 border-green-300"
      case "AUSENTE": return "bg-red-100 text-red-700 border-red-300"
      case "TARDANZA": return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "JUSTIFICADO": return "bg-blue-100 text-blue-700 border-blue-300"
      default: return "bg-gray-100 text-gray-700 border-gray-300"
    }
  };

  if (isLoadingSecciones) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="animate-spin h-48 w-48 mx-auto" />
      </section>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Fecha de la asistencia.</FormDescription>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una seccion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {seccionesData?.data?.map((seccion) => (
                      <SelectItem key={seccion.id} value={String(seccion.id)}>
                        {seccion.nombre} - {seccion.cicloLectivo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Seccion para tomar asistencia.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {seccionId && isLoadingAlumnos && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-10 w-10" />
          </div>
        )}

        {seccionId && !isLoadingAlumnos && alumnosData?.data && alumnosData.data.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Alumno</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumnosData.data.map((alumno) => (
                  <TableRow key={alumno.id}>
                    <TableCell className="font-medium">{alumno.nombre} {alumno.apellido}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {estadosAsistencia.map((estado) => (
                          <Button
                            key={estado.value}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`cursor-pointer ${
                              asistencias[alumno.id] === estado.value
                                ? getEstadoColor(estado.value)
                                : "opacity-50"
                            }`}
                            onClick={() => handleEstadoChange(alumno.id, estado.value)}
                          >
                            {estado.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || !seccionId} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Registrar Asistencias"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/asistencias")}
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
          <Alert className="border-green-200 ">
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

export default FormAsistenciaAlumno;
