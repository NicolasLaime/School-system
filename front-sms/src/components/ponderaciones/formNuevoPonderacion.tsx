"use client";
import { useCreatePonderacionMutation } from "@/redux/services/ponderacionesApi";
import { useGetCiclosQuery } from "@/redux/services/ciclosApi";
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

const formPonderacionSchema = z.object({
  cicloEducativoId: z.string().min(1, { message: "El ciclo es requerido" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  porcentaje: z.string().min(1, { message: "El porcentaje es requerido" }),
});

const FormNuevoPonderacion = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createPonderacion, { isLoading }] = useCreatePonderacionMutation();
  const { data: ciclosData, isLoading: isLoadingCiclos } = useGetCiclosQuery();

  const form = useForm<z.infer<typeof formPonderacionSchema>>({
    resolver: zodResolver(formPonderacionSchema),
    defaultValues: {
      cicloEducativoId: "",
      nombre: "",
      porcentaje: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formPonderacionSchema>) {
    try {
      const response = await createPonderacion({
        cicloEducativoId: Number(values.cicloEducativoId),
        nombre: values.nombre,
        porcentaje: Number(values.porcentaje),
      }).unwrap();

      if (response) {
        setMessage("Ponderacion creada correctamente");
        setTimeout(() => {
          router.push("/dashboard/ponderaciones");
        }, 1500);
      } else {
        setMessage("Error al crear la ponderacion");
      }
    } catch (error) {
      console.error("Error al crear ponderacion:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear la ponderacion.";
      setError(errorMessage);
    }
  }

  if (isLoadingCiclos) {
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
            name="cicloEducativoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciclo Educativo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un ciclo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ciclosData?.data?.map((ciclo) => (
                      <SelectItem key={ciclo.id} value={String(ciclo.id)}>
                        {ciclo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Ciclo educativo de la ponderacion.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ej: Examenes" />
                </FormControl>
                <FormDescription>Nombre de la ponderacion.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="porcentaje"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="Ej: 40" />
                </FormControl>
                <FormDescription>Porcentaje que representa esta ponderacion.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Ponderacion"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/ponderaciones")}
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

export default FormNuevoPonderacion;
