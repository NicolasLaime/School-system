"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { useCreateAsignaturaMutation } from '@/redux/services/asignatura.Api';
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
import { useGetGradosQuery } from '@/redux/services/gradosApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formAsignaturaSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre es requerido" }),
    codigo: z.string().min(3, { message: "El codigo es requerido" }),
    gradoId: z.number().min(1, { message: "El grado es requerido" }),
});

const FormNuevaAsignatura = () => {
    const router = useRouter();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [createAsignatura, { isLoading }] = useCreateAsignaturaMutation();
    const { data: grados, isLoading: isLoadingGrados } = useGetGradosQuery();

    const form = useForm<z.infer<typeof formAsignaturaSchema>>({
        resolver: zodResolver(formAsignaturaSchema),
        defaultValues: {
            nombre: "",
            codigo: "",
            gradoId: 0,
        },
    });

    const handleSubmit = async (data: z.infer<typeof formAsignaturaSchema>) => {
        try {
            const response = await createAsignatura(data).unwrap();
            if (response) {
                setMensaje("Asignatura creada correctamente");
                router.push("/dashboard/materias");
            } else {
                setMensaje("Error al crear la asignatura");
            }
        } catch (error) {
            console.error("Error al crear asignatura:", error);
            const errorMessage =
                (error as { data?: { error?: string } })?.data?.error ||
                "Error inesperado al crear la asignatura.";
            setError(errorMessage);
        }
    };

    if (isLoadingGrados) {
        return (
            <section className="container mx-auto py-10">
                <Loader2 className="animate-spin h-48 w-48 mx-auto" />
            </section>
        );
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="flex flex-col gap-6">
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
                    <FormField
                        control={form.control}
                        name="gradoId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grado</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={String(field.value)}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona un grado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {grados?.data?.map((grado) => (
                                            <SelectItem key={grado.id} value={String(grado.id)}>
                                                {grado.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>Grado al que pertenece la asignatura.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading} className="cursor-pointer">
                        {isLoading ? "Guardando..." : "Crear Asignatura"}
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

export default FormNuevaAsignatura;
