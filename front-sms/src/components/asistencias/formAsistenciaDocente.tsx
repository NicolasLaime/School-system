"use client";
import { useCreateAsistenciaDocenteMutation, useGetAsistenciasDocenteQuery } from "@/redux/services/asistenciasApi";
import { useGetUsuariosByRolQuery } from "@/redux/services/authApi";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EstadoAsistencia } from "../../../types/asistencia.type";
import { User } from "../../../types/Usuario.type";

const formAsistenciaDocenteSchema = z.object({
  fecha: z.string().min(1, { message: "La fecha es requerida" }),
});

const estadosAsistencia: { value: EstadoAsistencia; label: string }[] = [
  { value: "PRESENTE", label: "Presente" },
  { value: "AUSENTE", label: "Ausente" },
  { value: "TARDANZA", label: "Tardanza" },
  { value: "JUSTIFICADO", label: "Justificado" },
];

const FormAsistenciaDocente = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createAsistencia, { isLoading }] = useCreateAsistenciaDocenteMutation();
  const { data: docentesData, isLoading: isLoadingDocentes } = useGetUsuariosByRolQuery('DOCENTE');
  const [asistencias, setAsistencias] = useState<Record<number, EstadoAsistencia>>({});

  const form = useForm<z.infer<typeof formAsistenciaDocenteSchema>>({
    resolver: zodResolver(formAsistenciaDocenteSchema),
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
    },
  });

  const fecha = form.watch("fecha");

  const { data: asistenciasExistentes, isLoading: isLoadingAsistencias } = useGetAsistenciasDocenteQuery(
    { fecha },
    { skip: !fecha }
  );

  React.useEffect(() => {
    if (docentesData?.data && !isLoadingAsistencias) {
      const map: Record<number, EstadoAsistencia> = {};

      if (asistenciasExistentes?.data) {
        asistenciasExistentes.data.forEach((a) => {
          map[a.docenteId] = a.estado;
        });
      }
      docentesData.data.forEach((docente: User) => {
        if (!map[docente.id]) {
          map[docente.id] = "PRESENTE";
        }
      });

      setAsistencias(map);
    }
  }, [docentesData, asistenciasExistentes, isLoadingAsistencias]);

  async function onSubmit() {
    try {
      setError("");
      setMessage("");

      const promises = Object.entries(asistencias).map(([docenteId, estado]) =>
        createAsistencia({
          fecha,
          estado,
          docenteId: Number(docenteId),
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

  const handleEstadoChange = (docenteId: number, estado: EstadoAsistencia) => {
    setAsistencias((prev) => ({ ...prev, [docenteId]: estado }));
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

  if (isLoadingDocentes) {
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
        </div>

        {isLoadingAsistencias && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-10 w-10" />
          </div>
        )}

        {docentesData?.data && docentesData.data.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Docente</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docentesData.data.map((docente) => (
                  <TableRow key={docente.id}>
                    <TableCell className="font-medium">{docente.nombre} {docente.apellido}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {estadosAsistencia.map((estado) => (
                          <Button
                            key={estado.value}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`cursor-pointer ${
                              asistencias[docente.id] === estado.value
                                ? getEstadoColor(estado.value)
                                : "opacity-50"
                            }`}
                            onClick={() => handleEstadoChange(docente.id, estado.value)}
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
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
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

export default FormAsistenciaDocente;
