import React, { useState, useEffect } from 'react'
import { Grado } from '../../../types/grado.type'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateGradoMutation } from '@/redux/services/gradosApi';
import { useGetCiclosQuery } from '@/redux/services/ciclosApi';
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

const formGradoSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    ciclo_id: z.number().min(1, { message: "El ciclo es requerido" }),
});

interface Props {
  dataGrado: Grado | undefined
}

const FormEditGrado = ({ dataGrado }: Props) => {
    const router = useRouter();
    const [updateGradoApi, { isLoading }] = useUpdateGradoMutation();
    const { data: ciclosData, isLoading: isLoadingCiclos } = useGetCiclosQuery();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formGradoSchema>>({
        resolver: zodResolver(formGradoSchema),
        defaultValues: {
            nombre: dataGrado?.nombre || "",
            ciclo_id: dataGrado?.ciclo_id|| 0,
        },
    });

    useEffect(() => {
        if (dataGrado) {
            console.log("Datos del grado", dataGrado);
            form.reset({
                nombre: dataGrado.nombre || "",
                ciclo_id: dataGrado.ciclo_id || 0,
            });
        }
    }, [dataGrado, form]);

    const handlerEdit = async (values: z.infer<typeof formGradoSchema>) => {
        if(!dataGrado?.id){
            setError("Grado no encontrado");
            return;
        }

        setError("");
        setMensaje("");

        try {
            const response = await updateGradoApi({
                id: dataGrado.id,
                data: values
            }).unwrap();
            
            if (response) {
                setMensaje("Grado actualizado correctamente");
                router.push("/dashboard/grados");
            } else {
                setError("Error al actualizar el grado");
            }
        } catch (error: unknown) {
            console.error("Error al actualizar grado:", error);
            
            let errorMessage = "Error inesperado al actualizar el grado.";
            
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

    if (!dataGrado) {
        return <div>Cargando datos del grado...</div>;
    }

    if (isLoadingCiclos) {
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
                                                <SelectItem key={ciclo.id} value={ciclo.id}>
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
                            {isLoading ? "Guardando..." : "Actualizar Grado"}
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

export default FormEditGrado
