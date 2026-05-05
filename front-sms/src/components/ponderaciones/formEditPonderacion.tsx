"use client";
import React, { useState, useEffect } from "react";
import { Ponderacion } from "../../../types/ponderacion.type";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePonderacionMutation } from "@/redux/services/ponderacionesApi";
import { useGetCiclosQuery } from "@/redux/services/ciclosApi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

interface Props {
  dataPonderacion: Ponderacion | undefined;
}

const FormEditPonderacion = ({ dataPonderacion }: Props) => {
  const router = useRouter();
  const [updatePonderacion, { isLoading }] = useUpdatePonderacionMutation();
  const { data: ciclosData, isLoading: isLoadingCiclos } = useGetCiclosQuery();
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formPonderacionSchema>>({
    resolver: zodResolver(formPonderacionSchema),
    defaultValues: {
      cicloEducativoId: dataPonderacion ? String(dataPonderacion.cicloEducativoId) : "",
      nombre: dataPonderacion?.nombre || "",
      porcentaje: dataPonderacion ? String(dataPonderacion.porcentaje) : "",
    },
  });

  useEffect(() => {
    if (dataPonderacion) {
      form.reset({
        cicloEducativoId: String(dataPonderacion.cicloEducativoId),
        nombre: dataPonderacion.nombre,
        porcentaje: String(dataPonderacion.porcentaje),
      });
    }
  }, [dataPonderacion, form]);

  const handlerEdit = async (values: z.infer<typeof formPonderacionSchema>) => {
    if (!dataPonderacion?.id) {
      setError("Ponderacion no encontrada");
      return;
    }

    setError("");
    setMensaje("");

    try {
      const response = await updatePonderacion({
        id: String(dataPonderacion.id),
        data: {
          cicloEducativoId: Number(values.cicloEducativoId),
          nombre: values.nombre,
          porcentaje: Number(values.porcentaje),
        },
      }).unwrap();

      if (response) {
        setMensaje("Ponderacion actualizada correctamente");
        setTimeout(() => {
          router.push("/dashboard/ponderaciones");
        }, 1500);
      } else {
        setError("Error al actualizar la ponderacion");
      }
    } catch (error: unknown) {
      console.error("Error al actualizar ponderacion:", error);
      let errorMessage = "Error inesperado al actualizar la ponderacion.";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as { error?: string; message?: string };
        if (errorData?.error && typeof errorData.error === "string") {
          errorMessage = errorData.error;
        } else if (errorData?.message && typeof errorData.message === "string") {
          errorMessage = errorData.message;
        }
      }

      setError(errorMessage);
    }
  };

  if (!dataPonderacion || isLoadingCiclos) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="animate-spin h-48 w-48 mx-auto" />
      </section>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlerEdit)} className="space-y-6">
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
              {isLoading ? "Guardando..." : "Actualizar Ponderacion"}
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
          {error && typeof error === "string" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {mensaje && typeof mensaje === "string" && (
            <Alert variant="default">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {mensaje}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Form>
    </div>
  );
};

export default FormEditPonderacion;
