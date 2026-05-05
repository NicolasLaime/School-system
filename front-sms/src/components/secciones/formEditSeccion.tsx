import React, { useState, useEffect } from 'react'
import { Seccion } from '../../../types/seccion.type'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateSeccionMutation } from '@/redux/services/seccionesApi';
import { useGetGradosQuery } from '@/redux/services/gradosApi';
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
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
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

interface Props {
  dataSeccion: Seccion | undefined
}

const FormEditSeccion = ({ dataSeccion }: Props) => {
    const router = useRouter();
    const [updateSeccionApi, { isLoading }] = useUpdateSeccionMutation();
    const { data: gradosData, isLoading: isLoadingGrados } = useGetGradosQuery();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formSeccionSchema>>({
        resolver: zodResolver(formSeccionSchema),
        defaultValues: {
            nombre: dataSeccion?.nombre || "",
            grado_id: dataSeccion?.gradoId ? String(dataSeccion.gradoId) : "",
            ciclo_lectivo: dataSeccion?.cicloLectivo || "",
        },
    });

    useEffect(() => {
        if (dataSeccion) {
            form.reset({
                nombre: dataSeccion.nombre || "",
                grado_id: dataSeccion.gradoId ? String(dataSeccion.gradoId) : "",
                ciclo_lectivo: dataSeccion.cicloLectivo || "",
            });
        }
    }, [dataSeccion, form]);

    const handlerEdit = async (values: z.infer<typeof formSeccionSchema>) => {
        if(!dataSeccion?.id){
            setError("Seccion no encontrada");
            return;
        }

        setError("");
        setMensaje("");

        try {
            const response = await updateSeccionApi({
                id: dataSeccion.id,
                data: {
                    nombre: values.nombre,
                    grado_id: values.grado_id,
                    ciclo_lectivo: values.ciclo_lectivo,
                }
            }).unwrap();
            
            if (response) {
                setMensaje("Seccion actualizada correctamente");
                router.push("/dashboard/secciones");
            } else {
                setError("Error al actualizar la seccion");
            }
        } catch (error: unknown) {
            console.error("Error al actualizar seccion:", error);
            
            let errorMessage = "Error inesperado al actualizar la seccion.";
            
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

    if (!dataSeccion) {
        return <div>Cargando datos de la seccion...</div>;
    }

    if (isLoadingGrados) {
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
                                    <FormDescription>Nombre de la seccion.</FormDescription>
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
                                                <SelectItem key={grado.id} value={grado.id}>
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
                                    <FormDescription>Ciclo lectivo.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading} className="cursor-pointer">
                            {isLoading ? "Guardando..." : "Actualizar Seccion"}
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

export default FormEditSeccion
