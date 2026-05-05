"use client"
import { useCreateAlumnoMutation } from '@/redux/services/alumnosApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, BookOpen, Loader2 } from "lucide-react";
import { useGetSeccionesQuery } from '@/redux/services/seccionesApi';

const formAlumnoSchema = z.object({
  codigo: z.string().min(1, { message: "El codigo es requerido" }),
  nombre: z.string().min(3, { message: "El nombre es requerido" }),
  apellido: z.string().min(3, { message: "El apellido es requerido" }),
  telefono: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, {
      message: "Número de teléfono inválido",
    }),
  direccion: z.string().min(3, { message: "La dirección es requerida" }),
  documento: z.string().min(8, { message: "El dni es requerido" }),
  seccionId: z.number().min(1, { message: "La sección es requerida" }),
});

interface EnrollmentInfo {
  totalClases: number;
  inscripcionesCreadas: number;
}

const FormNuevoAlumno = () => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enrollmentInfo, setEnrollmentInfo] = useState<EnrollmentInfo | null>(null);
  const [createAlumno, { isLoading }] = useCreateAlumnoMutation();
  const { data: secciones, isLoading: isLoadingSecciones } = useGetSeccionesQuery();

  const form = useForm<z.infer<typeof formAlumnoSchema>>({
    resolver: zodResolver(formAlumnoSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      documento: "",
      seccionId: 0,
      telefono: "",
      direccion: "",
      codigo: ""
    },
  });

  const handleSubmit = async (data: z.infer<typeof formAlumnoSchema>) => {
    // Limpiar mensajes previos
    setError("");
    setMensaje("");
    setEnrollmentInfo(null);

    try {
      const response = await createAlumno(data).unwrap();

      if (response.success) {
        setMensaje(response.message || "Alumno creado correctamente");

        // Mostrar información de las inscripciones automáticas
        if (response.enrollment) {
          setEnrollmentInfo(response.enrollment);
        }

        // Redirigir después de 3 segundos para que el usuario vea el mensaje
        setTimeout(() => {
          router.push("/dashboard/alumnos");
        }, 9000);
      } else {
        setError(response.message || "Error al crear el alumno");
      }
    } catch (error) {
      console.error("Error al crear alumno:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear el alumno.";
      setError(errorMessage);
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/*nombre*/}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormDescription>Nombre completo del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*apellido*/}
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido" {...field} />
                </FormControl>
                <FormDescription>Apellido del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*dni*/}
          <FormField
            control={form.control}
            name="documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input placeholder="DNI" {...field} />
                </FormControl>
                <FormDescription>DNI del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*seccion*/}
          <FormField
            control={form.control}
            name="seccionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sección</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una sección" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {secciones?.data?.map((seccion) => (
                      <SelectItem key={seccion.id} value={String(seccion.id)}>
                        {seccion.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Sección del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Teléfono" {...field} />
                </FormControl>
                <FormDescription>Teléfono del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección" {...field} />
                </FormControl>
                <FormDescription>Dirección del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

           {/*codigo e alumno*/}
           <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código" {...field} />
                </FormControl>
                <FormDescription>Código del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Alumno"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/alumnos")}
          >
            Cancelar
          </Button>
        </div>
      </form>

      {/* Alertas de estado */}
      <div className="mt-5 space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mensaje && (
          <Alert className="">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <div className="space-y-2">
                <p className="font-semibold">{mensaje}</p>
                {enrollmentInfo && (
                  <div className="mt-2 p-2 rounded-md">
                    <div className="flex items-center gap-2 text-green-800">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">Inscripciones Automáticas:</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      El alumno fue inscrito automáticamente en {enrollmentInfo.inscripcionesCreadas} de {enrollmentInfo.totalClases} materias.
                    </p>
                    {enrollmentInfo.inscripcionesCreadas < enrollmentInfo.totalClases && (
                      <p className="text-xs text-amber-700 mt-1">
                        ⚠️ Algunas materias no tienen clases creadas.
                      </p>
                    )}
                  </div>
                )}
                <p className="text-xs text-green-600 mt-2">
                  Redirigiendo a la lista de alumnos en 3 segundos...
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Form>
  )
}

export default FormNuevoAlumno