"use client";
import {
  useCreateHorarioMutation,
} from "@/redux/services/horariosApi";
import { useGetAsignaturasQuery } from "@/redux/services/asignatura.Api";
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

const formHorarioSchema = z.object({
  diaSemana: z.string().min(1, { message: "El dia es requerido" }),
  horaInicio: z.string().min(1, { message: "La hora de inicio es requerida" }),
  horaFin: z.string().min(1, { message: "La hora de fin es requerida" }),
  asignaturaId: z.string().min(1, { message: "La asignatura es requerida" }),
  seccionId: z.string().min(1, { message: "La seccion es requerida" }),
});

const diasSemana = [
  { value: "LUNES", label: "Lunes" },
  { value: "MARTES", label: "Martes" },
  { value: "MIERCOLES", label: "Miercoles" },
  { value: "JUEVES", label: "Jueves" },
  { value: "VIERNES", label: "Viernes" }
];

const FormNuevoHorario = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createHorario, { isLoading }] = useCreateHorarioMutation();
  const { data: asignaturasData, isLoading: isLoadingAsignaturas } = useGetAsignaturasQuery();
  const { data: seccionesData, isLoading: isLoadingSecciones } = useGetSeccionesQuery();

  const form = useForm<z.infer<typeof formHorarioSchema>>({
    resolver: zodResolver(formHorarioSchema),
    defaultValues: {
      diaSemana: "",
      horaInicio: "",
      horaFin: "",
      asignaturaId: "",
      seccionId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formHorarioSchema>) {
    try {
      const response = await createHorario({
        diaSemana: values.diaSemana,
        horaInicio: `${values.horaInicio}:00`,
        horaFin: `${values.horaFin}:00`,
        asignaturaId: Number(values.asignaturaId),
        seccionId: Number(values.seccionId),
      }).unwrap();
      if (response) {
        setMessage("Horario creado correctamente");
        setTimeout(() => {
          router.push("/dashboard/horarios");
        }, 1500);
      } else {
        setMessage("Error al crear el horario");
      }
    } catch (error) {
      console.error("Error al crear horario:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear el horario.";
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="diaSemana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia de la semana</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {diasSemana.map((dia) => (
                      <SelectItem key={dia.value} value={dia.value}>
                        {dia.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Dia de la semana para el horario.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="horaInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de inicio</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>Hora de inicio de la clase.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="horaFin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de fin</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>Hora de fin de la clase.</FormDescription>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
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
                <FormDescription>Asignatura del horario.</FormDescription>
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
                <FormDescription>Seccion del horario.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Horario"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/horarios")}
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

export default FormNuevoHorario;
