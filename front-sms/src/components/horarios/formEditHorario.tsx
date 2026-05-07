import React, { useState, useEffect } from 'react'
import { Horario } from '../../../types/horario.type'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateHorarioMutation } from '@/redux/services/horariosApi';
import { useGetAsignaturasQuery } from '@/redux/services/asignatura.Api';
import { useGetSeccionesQuery } from '@/redux/services/seccionesApi';
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

const formHorarioSchema = z.object({
    diaSemana: z.string().min(1, { message: "El dia es requerido" }),
    horaInicio: z.string().min(1, { message: "La hora de inicio es requerida" }),
    horaFin: z.string().min(1, { message: "La hora de fin es requerida" }),
    asignaturaId: z.string().min(1, { message: "La asignatura es requerida" }),
    seccionId: z.string().min(1, { message: "La seccion es requerida" }),
});

const diasSemana = [
  { value: "LUNES", label: "Lunes" },
  { value: "MARTES", label: "Martes" },
  { value: "MIERCOLES", label: "Miercoles" },
  { value: "JUEVES", label: "Jueves" },
  { value: "VIERNES", label: "Viernes" },
  { value: "SABADO", label: "Sabado" },
  { value: "DOMINGO", label: "Domingo" },
];

interface Props {
  dataHorario: Horario | undefined
}

const formatHora = (hora: string | undefined): string => {
  if (!hora) return "";
  if (typeof hora === "string") {
    return hora.substring(0, 5);
  }
  return "";
};

const FormEditHorario = ({ dataHorario }: Props) => {
    const router = useRouter();
    const [updateHorarioApi, { isLoading }] = useUpdateHorarioMutation();
    const { data: asignaturasData, isLoading: isLoadingAsignaturas } = useGetAsignaturasQuery();
    const { data: seccionesData, isLoading: isLoadingSecciones } = useGetSeccionesQuery();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof formHorarioSchema>>({
        resolver: zodResolver(formHorarioSchema),
        defaultValues: {
            diaSemana: dataHorario?.diaSemana || "",
            horaInicio: dataHorario ? formatHora(dataHorario.horaInicio) : "",
            horaFin: dataHorario ? formatHora(dataHorario.horaFin) : "",
            asignaturaId: dataHorario ? String(dataHorario.asignaturaId) : "",
            seccionId: dataHorario ? String(dataHorario.seccionId) : "",
        },
    });

    useEffect(() => {
        if (dataHorario) {
            form.reset({
                diaSemana: dataHorario.diaSemana || "",
                horaInicio: formatHora(dataHorario.horaInicio),
                horaFin: formatHora(dataHorario.horaFin),
                asignaturaId: String(dataHorario.asignaturaId),
                seccionId: String(dataHorario.seccionId),
            });
        }
    }, [dataHorario, form]);

    const handlerEdit = async (values: z.infer<typeof formHorarioSchema>) => {
        if(!dataHorario?.id){
            setError("Horario no encontrado");
            return;
        }

        setError("");
        setMensaje("");

        try {
            const response = await updateHorarioApi({
                id: dataHorario.id,
                data: {
                    diaSemana: values.diaSemana,
                    horaInicio: `${values.horaInicio}:00`,
                    horaFin: `${values.horaFin}:00`,
                    asignaturaId: Number(values.asignaturaId),
                    seccionId: Number(values.seccionId),
                }
            }).unwrap();
            
            if (response) {
                setMensaje("Horario actualizado correctamente");
                router.push("/dashboard/horarios");
            } else {
                setError("Error al actualizar el horario");
            }
        } catch (error: unknown) {
            console.error("Error al actualizar horario:", error);
            
            let errorMessage = "Error inesperado al actualizar el horario.";
            
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

    if (!dataHorario) {
        return <div>Cargando datos del horario...</div>;
    }

    if (isLoadingAsignaturas || isLoadingSecciones) {
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
                            name="diaSemana"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dia de la semana</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona un dia" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {diasSemana.map((dia) => (
                                                <SelectItem key={dia.value} value={dia.value}>
                                                    {dia.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Dia de la semana.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="horaInicio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hora de inicio</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormDescription>Hora de inicio.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="horaFin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hora de fin</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormDescription>Hora de fin.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="asignaturaId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Asignatura</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una asignatura" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {asignaturasData?.data?.map((asignatura) => (
                                                <SelectItem key={asignatura.id} value={String(asignatura.id)}>
                                                    {asignatura.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Asignatura del horario.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="seccionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Seccion</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una seccion" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {seccionesData?.data?.map((seccion) => (
                                                <SelectItem key={seccion.id} value={String(seccion.id)}>
                                                    {seccion.nombre} - {seccion.cicloLectivo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Seccion del horario.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading} className="cursor-pointer">
                            {isLoading ? "Guardando..." : "Actualizar Horario"}
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.push("/dashboard/horarios")}
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

export default FormEditHorario
