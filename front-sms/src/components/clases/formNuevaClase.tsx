"use client";
import { useGetUserByIdQuery } from '@/redux/services/authApi';
import { useAsignarDocenteMutation, useGetAsignaturasByCodigoQuery } from '@/redux/services/asignatura.Api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { useGetSeccionesQuery } from '@/redux/services/seccionesApi';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SeccionList } from '../../../types/seccion.type';

const formClaseSchema = z.object({
    docenteId: z.number().min(1, "Docente es requerido"),
    asignaturaId: z.number().min(1, "Asignatura es requerida"),
    seccionId: z.number().min(1, "Seccion es requerida"),
})

const FormNuevaClase = () => {
    const router = useRouter()
    const [asignarDocente, { isLoading }] = useAsignarDocenteMutation()
    const [codigoAsignaturaBusqueda, setCodigoAsignaturaBusqueda] = useState("")
    const [docenteIdBusqueda, setDocenteIdBusqueda] = useState("")

    const { data: seccionData, isLoading: isLoadingSeccion } = useGetSeccionesQuery();
    console.log("seccionData", seccionData)


    const [mensaje, setMensaje] = useState({
        error: "",
        success: "",
        asignatura: "",
        docente: "",
        seccion: "",
    })

    // hook para obtener datos de la materia
    const { data: asignaturaData, isLoading: isLoadingAsignatura, isError: isErrorAsignatura, refetch: refetchAsignatura } = useGetAsignaturasByCodigoQuery(codigoAsignaturaBusqueda, {
        skip: !codigoAsignaturaBusqueda,
    })

    // hook para obtener datos del docente
    const { data: docenteData, isLoading: isLoadingDocente, isError: isErrorDocente, refetch: refetchDocente } = useGetUserByIdQuery(docenteIdBusqueda, {
        skip: !docenteIdBusqueda,
    })

    const form = useForm<z.infer<typeof formClaseSchema>>({
        resolver: zodResolver(formClaseSchema),
        defaultValues: {
            docenteId: 0,
            asignaturaId: 0,
            seccionId: 0,
        },
    });

    // Efecto para autocompletar asignatura cuando se encuentra
    useEffect(() => {
        if (asignaturaData) {
            form.setValue('asignaturaId', Number(asignaturaData.data.id));
            setMensaje(prev => ({
                ...prev,
                asignatura: `Asignatura encontrada: ${asignaturaData.data.nombre} (${asignaturaData.data.codigo})`
            }));
        }
    }, [asignaturaData, form]);

    // Efecto para autocompletar docente cuando se encuentra
    useEffect(() => {
        if (docenteData && docenteData.data.rol === 'DOCENTE') {
            form.setValue('docenteId', Number(docenteData.data.id));
            setMensaje(prev => ({
                ...prev,
                docente: `Docente encontrado: ${docenteData.data.nombre} (${docenteData.data.email})`
            }));
        } else if (docenteData && docenteData.data.rol !== 'DOCENTE') {
            setMensaje(prev => ({
                ...prev,
                docente: "El usuario encontrado no es un docente"
            }));
        }
    }, [docenteData, form]);

    // Efecto para manejar errores de búsqueda
    useEffect(() => {
        if (isErrorAsignatura && codigoAsignaturaBusqueda) {
            setMensaje(prev => ({
                ...prev,
                asignatura: "Asignatura no encontrada. Verifica el código."
            }));
        }
    }, [isErrorAsignatura, codigoAsignaturaBusqueda]);

    useEffect(() => {
        if (isErrorDocente && docenteIdBusqueda) {
            setMensaje(prev => ({
                ...prev,
                docente: "Docente no encontrado. Verifica el ID."
            }));
        }
    }, [isErrorDocente, docenteIdBusqueda]);

    const handleSubmit = async (data: z.infer<typeof formClaseSchema>) => {
        try {
            const response = await asignarDocente(data).unwrap();
            if (response) {
                setMensaje({
                    error: "",
                    success: "Clase creada correctamente",
                    asignatura: "",
                    docente: "",
                    seccion: "",
                });
                setTimeout(() => router.push("/dashboard/clases"), 1500);
            }
        } catch (error) {
            console.error("Error al crear clase:", error);
            const errorMessage =
                (error as { data?: { error?: string } })?.data?.error ||
                "Error inesperado al crear la clase.";
            setMensaje({
                error: errorMessage,
                success: "",
                asignatura: "",
                docente: "",
                seccion: "",
            });
        }
    };

    const handleBuscarAsignatura = () => {
        if (codigoAsignaturaBusqueda.trim()) {
            refetchAsignatura();
            setMensaje(prev => ({ ...prev, asignatura: "Buscando asignatura..." }));
        }
    };

    const handleBuscarDocente = () => {
        if (docenteIdBusqueda.trim()) {
            refetchDocente();
            setMensaje(prev => ({ ...prev, docente: "Buscando docente..." }));
        }
    };

    if (isLoadingSeccion) {
        return (
            <section className="container mx-auto py-10">
                <Loader2 className="animate-spin h-48 w-48 mx-auto" />
            </section>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Card para buscar asignatura */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Buscar Asignatura por Código
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='flex gap-2'>
                                <Input
                                    placeholder="Ingresa el código de la asignatura (ej: MAT-5P)"
                                    value={codigoAsignaturaBusqueda}
                                    onChange={(e) => setCodigoAsignaturaBusqueda(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleBuscarAsignatura())}
                                />
                                <Button
                                    type="button"
                                    onClick={handleBuscarAsignatura}
                                    disabled={isLoadingAsignatura || !codigoAsignaturaBusqueda.trim()}
                                >
                                    {isLoadingAsignatura ? "Buscando..." : "Buscar"}
                                </Button>
                            </div>

                            {isLoadingAsignatura && (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            )}

                            {mensaje.asignatura && (
                                <Alert variant={isErrorAsignatura ? "destructive" : "default"} className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{mensaje.asignatura}</AlertDescription>
                                </Alert>
                            )}

                            {asignaturaData && (
                                <div className="p-3 border rounded-lg bg-muted/50">
                                    <h4 className="font-semibold">Información de la Asignatura:</h4>
                                    <p><strong>Nombre:</strong> {asignaturaData.data.nombre}</p>
                                    <p><strong>Código:</strong> {asignaturaData.data.codigo}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Card para buscar docente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Buscar Docente por ID
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='flex gap-2'>
                                <Input
                                    placeholder="Ingresa el ID del docente"
                                    value={docenteIdBusqueda}
                                    onChange={(e) => setDocenteIdBusqueda(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleBuscarDocente())}
                                />
                                <Button
                                    type="button"
                                    onClick={handleBuscarDocente}
                                    disabled={isLoadingDocente || !docenteIdBusqueda.trim()}
                                >
                                    {isLoadingDocente ? "Buscando..." : "Buscar"}
                                </Button>
                            </div>

                            {isLoadingDocente && (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            )}

                            {mensaje.docente && (
                                <Alert variant={isErrorDocente ? "destructive" : "default"} className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{mensaje.docente}</AlertDescription>
                                </Alert>
                            )}

                            {docenteData && docenteData.data.rol === 'DOCENTE' && (
                                <div className="p-3 border rounded-lg bg-muted/50">
                                    <h4 className="font-semibold">Información del Docente:</h4>
                                    <p><strong>Nombre:</strong> {docenteData.data.nombre}</p>
                                    <p><strong>Email:</strong> {docenteData.data.email}</p>
                                    <p><strong>Teléfono:</strong> {docenteData.data.telefono || "No registrado"}</p>
                                    <p><strong>Rol:</strong> {docenteData.data.rol}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Campos del formulario (ocultos o visibles según prefieras) */}
                <div className="hidden">
                    <FormField
                        control={form.control}
                        name="asignaturaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="docenteId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Campo de sección */}
                <FormField
                    control={form.control}
                    name="seccionId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sección a la que pertenece la clase</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={String(field.value)}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona una sección" />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {seccionData?.data?.map((seccion: SeccionList) => (
                                            <SelectItem key={seccion.id} value={String(seccion.id)}>
                                                {seccion.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isLoading || !form.watch('asignaturaId') || !form.watch('docenteId')}
                        className="cursor-pointer"
                    >
                        {isLoading ? "Creando..." : "Crear Clase"}
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.push("/dashboard/clases")}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>

            {/* Alertas de estado */}
            <div className="mt-5 space-y-3">
                {mensaje.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{mensaje.error}</AlertDescription>
                    </Alert>
                )}

                {mensaje.success && (
                    <Alert className="">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                            {mensaje.success}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </Form>
    )
}

export default FormNuevaClase;