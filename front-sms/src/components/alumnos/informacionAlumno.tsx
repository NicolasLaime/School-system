import React, { useState } from 'react'
import { AlumnoList } from '../../../types/alumnos.types'
import z from 'zod';
import { useRouter } from 'next/navigation';
import { useUpdateAlumnoMutation } from '@/redux/services/alumnosApi';
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetSeccionesQuery } from '@/redux/services/seccionesApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InformacionAlumnoProps {
  dataAlumno: AlumnoList;
}

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
    direccion: z.string().min(3, { message: "La direccion es requerida" }),
  documento: z.string().min(8, { message: "El dni es requerido" }),
  seccionId: z.number().min(1, { message: "La sección es requerida" }),
 
});

const InformacionAlumno = ({ dataAlumno }: InformacionAlumnoProps) => {

  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [editarAlumno, { isLoading }] = useUpdateAlumnoMutation();
  const { data: secciones, isLoading: isLoadingSecciones } = useGetSeccionesQuery();

  console.log("dataAlumno", dataAlumno);

  const form = useForm<z.infer<typeof formAlumnoSchema>>({
    resolver: zodResolver(formAlumnoSchema),
    defaultValues: {
      nombre: dataAlumno?.nombre || "",
      apellido: dataAlumno?.apellido || "",
      documento: dataAlumno?.documento || "",
      seccionId: dataAlumno?.seccionId || 0,
      telefono: dataAlumno?.telefono || "",
      direccion: dataAlumno?.direccion || "",
      codigo: dataAlumno?.codigo || "",
    },
  });

  const handlerEdit = async (values: z.infer<typeof formAlumnoSchema>) => {
    if (!dataAlumno?.id) {
      setError("Alumno no encontrado");
      return;
    }

    // Limpiar mensajes previos
    setError("");
    setMensaje("");

    try {
      const response = await editarAlumno({
        id: dataAlumno.id,
        data: values
      }).unwrap();

      if (response) {
        setMensaje("Alumno actualizado correctamente");
        router.push("/dashboard/alumnos");
      } else {
        setError("Error al actualizar el alumno");
      }
    } catch (error: unknown) {
      console.error("Error al actualizar alumno:", error);

      // Asegurar que siempre sea un string
      let errorMessage = "Error inesperado al actualizar el alumno.";

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as { error?: string; message?: string };
        if (errorData?.error && typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if (errorData?.message && typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message: string };
        if (typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        }
      }

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
      <form onSubmit={form.handleSubmit(handlerEdit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                <FormLabel>Telefono</FormLabel>
                <FormControl>
                  <Input placeholder="Telefono" {...field} />
                </FormControl>
                <FormDescription>Telefono del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direccion</FormLabel>
                <FormControl>
                  <Input placeholder="Direccion" {...field} />
                </FormControl>
                <FormDescription>Direccion del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*codigo*/}
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo</FormLabel>
                <FormControl>
                  <Input placeholder="Codigo" {...field} disabled />
                </FormControl>
                <FormDescription>Codigo del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Actualizar Alumno"}
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
          <Alert className="border-green-200 ">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {mensaje}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Form>
  )
}

export default InformacionAlumno