"use client";
import {
  useCreateSeccionMutation,
} from "@/redux/services/seccionesApi";
import { useGetGradosQuery } from "@/redux/services/gradosApi";
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

const formSeccionSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  grado_id: z.string().min(1, { message: "El grado es requerido" }),
  ciclo_lectivo: z.string().min(4, { message: "El ciclo lectivo es requerido" }),
});

const FormNuevaSeccion = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createSeccion, { isLoading }] = useCreateSeccionMutation();
  const { data: gradosData, isLoading: isLoadingGrados } = useGetGradosQuery();

  console.log("gradosData", gradosData);

  const form = useForm<z.infer<typeof formSeccionSchema>>({
    resolver: zodResolver(formSeccionSchema),
    defaultValues: {
      nombre: "",
      grado_id: "",
      ciclo_lectivo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSeccionSchema>) {
    try {
      const response = await createSeccion({
        nombre: values.nombre,
        grado_id: values.grado_id,
        ciclo_lectivo: values.ciclo_lectivo,
      }).unwrap();
      if (response) {
        setMessage("Seccion creada correctamente");
        setTimeout(() => {
          router.push("/dashboard/secciones");
        }, 1500);
      } else {
        setMessage("Error al crear la seccion");
      }
    } catch (error) {
      console.error("Error al crear seccion:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear la seccion.";
      setError(errorMessage);
    }
  }

  if (isLoadingGrados) {
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
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la seccion" {...field} />
                </FormControl>
                <FormDescription>Nombre de la seccion (ej: A, B).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grado_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un grado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gradosData?.data?.map((grado) => (
                      <SelectItem key={grado.id} value={String(grado.id)}>
                        {grado.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Grado al que pertenece la seccion.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ciclo_lectivo"
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
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Seccion"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/secciones")}
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

export default FormNuevaSeccion;
