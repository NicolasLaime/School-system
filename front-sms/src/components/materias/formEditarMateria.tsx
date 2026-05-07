import React, { useState } from 'react'
import { AsignaturaEdit } from '../../../types/materia.types';
import { useRouter } from 'next/navigation';
import { useUpdateAsignaturaMutation } from '@/redux/services/asignatura.Api';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from 'react-hook-form';

interface FormEditarAsignaturaProps {
  dataAsignatura: AsignaturaEdit;
}


const formAsignaturaSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre es requerido" }),
    codigo: z.string().min(3, { message: "El codigo es requerido" }),
    gradoId: z.number().min(1, { message: "El grado es requerido" }),
});

const FormEditarAsignatura = ({ dataAsignatura }: FormEditarAsignaturaProps) => {
    console.log("dataAsignatura", dataAsignatura);
    const router = useRouter();
    const [updateAsignaturaApi, { isLoading }] = useUpdateAsignaturaMutation();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

       const form = useForm<z.infer<typeof formAsignaturaSchema>>({
        resolver: zodResolver(formAsignaturaSchema),
        defaultValues: {
            nombre: dataAsignatura?.nombre || "",
            codigo: dataAsignatura?.codigo || "",
            gradoId: dataAsignatura?.gradoId || 0,
        },
    });

    const handlerEdit = async (values: z.infer<typeof formAsignaturaSchema>) => {
        if(!dataAsignatura?.id){
            setError("Asignatura no encontrada");
            return;
        }

        setError("");
        setMensaje("");

        try {
            const response = await updateAsignaturaApi({
                id: dataAsignatura.id,
                data: values
            }).unwrap();
            
            if (response) {
                setMensaje("Asignatura actualizada correctamente");
                router.push("/dashboard/materias");
            } else {
                setError("Error al actualizar la asignatura");
            }
        } catch (error: unknown) {
            console.error("Error al actualizar asignatura:", error);
            
            let errorMessage = "Error inesperado al actualizar la asignatura.";
            
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

  return (
   <Form     {...form}>
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
                <FormDescription>Nombre de la asignatura.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código" {...field} />
                </FormControl>
                <FormDescription>Código de la asignatura.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Actualizar Asignatura"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/materias")}
          >
            Cancelar
          </Button>
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {error && typeof error === 'string' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mensaje && typeof mensaje === 'string' && (
          <Alert variant="default">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {mensaje}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Form>
  );
}

export default FormEditarAsignatura
