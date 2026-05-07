import React, { useState, useEffect } from 'react'
import { Ciclo } from '../../../types/ciclo.type'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateCicloMutation } from '@/redux/services/ciclosApi';
import { useRouter } from "next/navigation";
import { Button } from '../ui/button';
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
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/input';

const formCicloSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre es requerido y debe tener al menos 3 caracteres" }),
});

interface Props {
  dataCiclo: Ciclo | undefined
}

const FormEditCiclo = ({ dataCiclo }: Props) => {
    const router = useRouter();
    const [updateCicloApi, { isLoading }] = useUpdateCicloMutation();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formCicloSchema>>({
        resolver: zodResolver(formCicloSchema),
        defaultValues: {
            nombre: dataCiclo?.nombre || "",
        },
    });

    useEffect(() => {
        if (dataCiclo) {
            form.reset({
                nombre: dataCiclo.nombre || "",
            });
        }
    }, [dataCiclo, form]);

    const handlerEdit = async (values: z.infer<typeof formCicloSchema>) => {
        if(!dataCiclo?.id){
            setError("Ciclo no encontrado");
            return;
        }

        setError("");
        setMensaje("");

        try {
            const response = await updateCicloApi({
                id: dataCiclo.id,
                data: values
            }).unwrap();
            
            if (response) {
                setMensaje("Ciclo actualizado correctamente");
                router.push("/dashboard/ciclos");
            } else {
                setError("Error al actualizar el ciclo");
            }
        } catch (error: unknown) {
            console.error("Error al actualizar ciclo:", error);
            
            let errorMessage = "Error inesperado al actualizar el ciclo.";
            
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

    if (!dataCiclo) {
        return <div>Cargando datos del ciclo...</div>;
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handlerEdit)} className="space-y-6">
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
                            {isLoading ? "Guardando..." : "Actualizar Ciclo"}
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
        </div>
    )
}

export default FormEditCiclo
