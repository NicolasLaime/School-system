"use client";
import {
  useCreateGradoMutation,
} from "@/redux/services/gradosApi";
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

const formGradoSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  ciclo_id: z.number().min(1, { message: "El ciclo es requerido" }),
});

const FormNuevoGrado = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createGrado, { isLoading }] = useCreateGradoMutation();
  const { data: ciclosData, isLoading: isLoadingCiclos } = useGetCiclosQuery();

  const form = useForm<z.infer<typeof formGradoSchema>>({
    resolver: zodResolver(formGradoSchema),
    defaultValues: {
      nombre: "",
      ciclo_id: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formGradoSchema>) {
    console.log("Formulario enviado", values);
    try {
      const response = await createGrado(values).unwrap();
      if (response) {
        setMessage("Grado creado correctamente");
        setTimeout(() => {
          router.push("/dashboard/grados");
        }, 1500);
      } else {
        setMessage("Error al crear el grado");
      }
    } catch (error) {
      console.error("Error al crear grado:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear el grado.";
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
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del grado" {...field} />
                </FormControl>
                <FormDescription>Nombre del grado.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ciclo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciclo</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger className="w-full">
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
                <FormDescription>Ciclo educativo al que pertenece el grado.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Grado"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/grados")}
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

export default FormNuevoGrado;
