"use client"
import { useCreateTutorMutation } from '@/redux/services/tutoresApi';
import { useLazyGetAlumnosPorCodigoQuery } from '@/redux/services/alumnosApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, Loader2, Search, X } from "lucide-react";

const parentescoOptions = ["Padre", "Madre", "Abuelo/a", "Tío/a", "Hermano/a", "Tutor Legal", "Otro"];

const formTutorSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es requerido (mín. 2 caracteres)" }),
  apellido: z.string().min(2, { message: "El apellido es requerido (mín. 2 caracteres)" }),
  telefono: z
    .string()
    .trim()
    .regex(/^[0-9]{7,20}$/, {
      message: "Número de teléfono inválido (solo dígitos, 7-20 caracteres)",
    }),
  email: z.string().email({ message: "Email inválido" }),
  parentesco: z.string().min(1, { message: "El parentesco es requerido" }),
  alumnoIds: z.array(z.number()).min(1, { message: "Debe seleccionar al menos un alumno" }),
});

interface AlumnoSeleccionado {
  id: number;
  nombre: string;
  apellido: string;
  codigo: string;
}

const FormNuevoTutor = () => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState<AlumnoSeleccionado[]>([]);
  const [busquedaError, setBusquedaError] = useState("");
  const [createTutor, { isLoading }] = useCreateTutorMutation();
  const [buscarAlumno, { isLoading: isBuscando }] = useLazyGetAlumnosPorCodigoQuery();

  const form = useForm<z.infer<typeof formTutorSchema>>({
    resolver: zodResolver(formTutorSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      parentesco: "",
      alumnoIds: [],
    },
  });

  const handleBuscarAlumno = async () => {
    if (!codigoBusqueda.trim()) return;
    setBusquedaError("");

    try {
      const response = await buscarAlumno(codigoBusqueda.trim()).unwrap();
      const alumno = response.data;
      console.log("Alumno encontrado:", alumno);

      if (!alumno) {
        setBusquedaError(`No se encontró alumno con código "${codigoBusqueda}"`);
        return;
      }

      const yaSeleccionado = alumnosSeleccionados.some((a) => a.id === alumno.id);

      if (yaSeleccionado) {
        setBusquedaError(`El alumno ${alumno.nombre} ${alumno.apellido} ya fue agregado`);
        return;
      }

      const nuevosAlumnos = [
        ...alumnosSeleccionados,
        { id: alumno.id, nombre: alumno.nombre, apellido: alumno.apellido, codigo: alumno.codigo },
      ];
      setAlumnosSeleccionados(nuevosAlumnos);
      form.setValue("alumnoIds", nuevosAlumnos.map((a) => a.id), { shouldValidate: true });
      setCodigoBusqueda("");
    } catch {
      setBusquedaError(`Error al buscar alumno con código "${codigoBusqueda}"`);
    }
  };

  const handleRemoveAlumno = (alumnoId: number) => {
    const nuevosAlumnos = alumnosSeleccionados.filter((a) => a.id !== alumnoId);
    setAlumnosSeleccionados(nuevosAlumnos);
    form.setValue("alumnoIds", nuevosAlumnos.map((a) => a.id), { shouldValidate: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBuscarAlumno();
    }
  };

  const handleSubmit = async (data: z.infer<typeof formTutorSchema>) => {
    setError("");
    setMensaje("");

    try {
      const response = await createTutor(data).unwrap();

      if (response.success) {
        setMensaje(response.message || "Tutor creado correctamente");
        form.reset();
        setAlumnosSeleccionados([]);
        setTimeout(() => {
          router.push("/dashboard/tutores");
        }, 3000);
      } else {
        setError(response.message || "Error al crear el tutor");
      }
    } catch (error) {
      console.error("Error al crear tutor:", error);
      const errorMessage =
        (error as { data?: { error?: string; message?: string } })?.data?.error ||
        (error as { data?: { error?: string; message?: string } })?.data?.message ||
        "Error inesperado al crear el tutor.";
      setError(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del tutor" {...field} />
                </FormControl>
                <FormDescription>Nombre completo del tutor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido */}
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido del tutor" {...field} />
                </FormControl>
                <FormDescription>Apellido del tutor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="correo@ejemplo.com" type="email" {...field} />
                </FormControl>
                <FormDescription>Correo electrónico del tutor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" {...field} />
                </FormControl>
                <FormDescription>Teléfono de contacto del tutor.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Parentesco */}
          <FormField
            control={form.control}
            name="parentesco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parentesco</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el parentesco" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {parentescoOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Relación con el alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buscar alumno por código */}
          <FormField
            control={form.control}
            name="alumnoIds"
            render={() => (
              <FormItem>
                <FormLabel>Alumnos asociados</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Código del alumno (ej: ALU-0001)"
                      value={codigoBusqueda}
                      onChange={(e) => {
                        setCodigoBusqueda(e.target.value);
                        setBusquedaError("");
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBuscarAlumno}
                    disabled={isBuscando || !codigoBusqueda.trim()}
                    className="cursor-pointer shrink-0"
                  >
                    {isBuscando ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <FormDescription>Ingrese el código del alumno y presione buscar o Enter.</FormDescription>
                {busquedaError && (
                  <p className="text-sm text-destructive">{busquedaError}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Chips de alumnos seleccionados */}
        {alumnosSeleccionados.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {alumnosSeleccionados.map((alumno) => (
              <span
                key={alumno.id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {alumno.nombre} {alumno.apellido} ({alumno.codigo})
                <button
                  type="button"
                  onClick={() => handleRemoveAlumno(alumno.id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Tutor"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/tutores")}
          >
            Cancelar
          </Button>
        </div>
      </form>

      {/* Alertas de estado */}
      <div className="mt-5 space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mensaje && (
          <Alert className="border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <div className="space-y-2">
                <p className="font-semibold">{mensaje}</p>
                <p className="text-xs text-green-600 mt-2">
                  Redirigiendo a la lista de tutores en 3 segundos...
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Form>
  )
}

export default FormNuevoTutor
