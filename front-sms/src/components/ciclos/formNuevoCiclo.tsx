"use client";
import {
  useCreateCicloMutation,
} from "@/redux/services/ciclosApi";
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
import { AlertCircle, CheckCircle2 } from "lucide-react";

const formCicloSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre es requerido y debe tener al menos 3 caracteres" }),
});

const FormNuevoCiclo = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createCiclo, { isLoading }] = useCreateCicloMutation();

  const form = useForm<z.infer<typeof formCicloSchema>>({
    resolver: zodResolver(formCicloSchema),
    defaultValues: {
      nombre: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formCicloSchema>) {
    try {
      const response = await createCiclo({ nombre: values.nombre }).unwrap();
      if (response) {
        setMessage("Ciclo creado correctamente");
        setTimeout(() => {
          router.push("/dashboard/ciclos");
        }, 1500);
      } else {
        setMessage("Error al crear el ciclo");
      }
    } catch (error) {
      console.error("Error al crear ciclo:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear el ciclo.";
      setError(errorMessage);
    }
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
                  <Input placeholder="Nombre del ciclo" {...field} />
                </FormControl>
                <FormDescription>Nombre del ciclo educativo.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Ciclo"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/ciclos")}
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

export default FormNuevoCiclo;
