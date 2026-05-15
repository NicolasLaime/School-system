"use client";
import { useCreateNotaMutation } from "@/redux/services/notasApi";
import { useGetAsignaturasByCodigoQuery } from "@/redux/services/asignatura.Api";
import { useGetAlumnosPorCodigoQuery } from "@/redux/services/alumnosApi";
import { useGetUserByIdQuery } from "@/redux/services/authApi";
import { useGetPonderacionesQuery } from "@/redux/services/ponderacionesApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppSelector } from "@/redux/hooks";
import { selectUserLogin } from "@/redux/features/userSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formNotaSchema = z.object({
  alumnoId: z.string().min(1, { message: "Busca un alumno por codigo" }),
  asignaturaId: z.string().min(1, { message: "Busca una materia por codigo" }),
  seccionId: z.string().min(1, { message: "La seccion es requerida" }),
  bimestre: z.string().min(1, { message: "El bimestre es requerido" }),
  cicloLectivo: z.string().min(4, { message: "El ciclo lectivo es requerido" }),
  tipoNota: z.string().min(1, { message: "El tipo de nota es requerido" }),
  valor: z.string().min(1, { message: "El valor es requerido" }),
  docenteId: z.string().min(1, { message: "Busca un docente por ID" }),
});

const FormNuevaNota = () => {
  const router = useRouter();
  const userLogin = useAppSelector(selectUserLogin);
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createNota, { isLoading }] = useCreateNotaMutation();
  const { data: ponderacionesData, isLoading: isLoadingPonderaciones } = useGetPonderacionesQuery();

  const [alumnoCodigo, setAlumnoCodigo] = useState("");
  const [alumnoSearchTerm, setAlumnoSearchTerm] = useState("");
  const { data: alumnoData, isFetching: alumnoFetching } = useGetAlumnosPorCodigoQuery(alumnoSearchTerm, {
    skip: !alumnoSearchTerm,
  });

  const [asignaturaCodigo, setAsignaturaCodigo] = useState("");
  const [asignaturaSearchTerm, setAsignaturaSearchTerm] = useState("");
  const { data: asignaturaData, isFetching: asignaturaFetching } = useGetAsignaturasByCodigoQuery(asignaturaSearchTerm, {
    skip: !asignaturaSearchTerm,
  });

  const [docenteSearchId, setDocenteSearchId] = useState("");
  const [docenteSearchTerm, setDocenteSearchTerm] = useState("");
  const { data: docenteData, isFetching: docenteFetching } = useGetUserByIdQuery(docenteSearchTerm, {
    skip: !docenteSearchTerm,
  });

  useEffect(() => {
    if (userLogin?.role === "DOCENTE" && userLogin?.userId) {
      const id = String(userLogin.userId);
      setDocenteSearchId(id);
      setDocenteSearchTerm(id);
    }
  }, [userLogin]);

  const form = useForm<z.infer<typeof formNotaSchema>>({
    resolver: zodResolver(formNotaSchema),
    defaultValues: {
      alumnoId: "",
      asignaturaId: "",
      seccionId: "",
      bimestre: "",
      cicloLectivo: "",
      tipoNota: "",
      valor: "",
      docenteId: "",
    },
  });

  useEffect(() => {
    if (alumnoData?.data) {
      const alumno = Array.isArray(alumnoData.data) ? alumnoData.data[0] : alumnoData.data;
      if (alumno) {
        form.setValue("alumnoId", String(alumno.id), { shouldValidate: true });
        form.setValue("seccionId", String(alumno.seccionId), { shouldValidate: true });
        form.setValue("cicloLectivo", alumno.cicloLectivo || "", { shouldValidate: true });
      }
    }
  }, [alumnoData, form]);

  useEffect(() => {
    if (asignaturaData?.data) {
      form.setValue("asignaturaId", String(asignaturaData.data.id), { shouldValidate: true });
    }
  }, [asignaturaData, form]);

  useEffect(() => {
    if (docenteData?.data) {
      form.setValue("docenteId", String(docenteData.data.id), { shouldValidate: true });
    }
  }, [docenteData, form]);

  async function onSubmit(values: z.infer<typeof formNotaSchema>) {
    try {
      const response = await createNota({
        alumnoId: Number(values.alumnoId),
        asignaturaId: Number(values.asignaturaId),
        seccionId: Number(values.seccionId),
        bimestre: values.bimestre,
        cicloLectivo: values.cicloLectivo,
        tipoNota: values.tipoNota,
        valor: Number(values.valor),
        docenteId: Number(values.docenteId),
      }).unwrap();
      if (response) {
        setMessage("Nota creada correctamente");
        setTimeout(() => {
          router.push("/dashboard/notas");
        }, 1500);
      } else {
        setError("Error al crear la nota");
      }
    } catch (err) {
      console.error("Error al crear nota:", err);
      const errorMessage =
        (err as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al crear la nota.";
      setError(errorMessage);
    }
  }

  if (isLoadingPonderaciones) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="animate-spin h-48 w-48 mx-auto" />
      </section>
    );
  }

  const alumnoEncontrado = alumnoData?.data
    ? (Array.isArray(alumnoData.data) ? alumnoData.data[0] : alumnoData.data)
    : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">

          <FormItem>
            <FormLabel>Codigo del Alumno</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Ej: ALU-0001"
                value={alumnoCodigo}
                onChange={(e) => setAlumnoCodigo(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => setAlumnoSearchTerm(alumnoCodigo)}
                disabled={!alumnoCodigo || alumnoFetching}
              >
                {alumnoFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Buscar
              </Button>
            </div>
            {alumnoEncontrado && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm space-y-1">
                <p><strong>Nombre:</strong> {alumnoEncontrado.nombre} {alumnoEncontrado.apellido}</p>
                <p><strong>Seccion:</strong> {alumnoEncontrado.seccionNombre} | <strong>Grado:</strong> {alumnoEncontrado.gradoNombre} | <strong>Ciclo:</strong> {alumnoEncontrado.cicloEducativoNombre} - {alumnoEncontrado.cicloLectivo}</p>
              </div>
            )}
            {alumnoSearchTerm && !alumnoFetching && !alumnoEncontrado && (
              <p className="text-sm text-destructive mt-1">Alumno no encontrado</p>
            )}
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Codigo de la Materia</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Ej: MAT-001"
                value={asignaturaCodigo}
                onChange={(e) => setAsignaturaCodigo(e.target.value)}
              />
              <Button
                type="button"
                onClick={() => setAsignaturaSearchTerm(asignaturaCodigo)}
                disabled={!asignaturaCodigo || asignaturaFetching}
              >
                {asignaturaFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Buscar
              </Button>
            </div>
            {asignaturaData?.data && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                <p><strong>Materia:</strong> {asignaturaData.data.nombre}</p>
              </div>
            )}
            {asignaturaSearchTerm && !asignaturaFetching && !asignaturaData?.data && (
              <p className="text-sm text-destructive mt-1">Materia no encontrada</p>
            )}
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>ID del Docente</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Ej: 3"
                value={docenteSearchId}
                onChange={(e) => setDocenteSearchId(e.target.value)}
                type="number"
              />
              <Button
                type="button"
                onClick={() => setDocenteSearchTerm(docenteSearchId)}
                disabled={!docenteSearchId || docenteFetching}
              >
                {docenteFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Buscar
              </Button>
            </div>
            {docenteData?.data && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm space-y-1">
                <p><strong>Nombre:</strong> {docenteData.data.nombre} {docenteData.data.apellido}</p>
                <p><strong>Rol:</strong> {docenteData.data.rol}</p>
              </div>
            )}
            {docenteSearchTerm && !docenteFetching && !docenteData?.data && (
              <p className="text-sm text-destructive mt-1">Docente no encontrado</p>
            )}
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="bimestre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bimestre</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un bimestre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PRIMERO">Primero</SelectItem>
                    <SelectItem value="SEGUNDO">Segundo</SelectItem>
                    <SelectItem value="TERCERO">Tercero</SelectItem>
                    <SelectItem value="CUARTO">Cuarto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipoNota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Nota</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ponderacionesData?.data?.map((ponderacion) => (
                      <SelectItem key={ponderacion.id} value={String(ponderacion.nombre)}>
                        {ponderacion.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="10" step="0.1" placeholder="0-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Nota"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/notas")}
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
          <Alert className="border-green-200">
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

export default FormNuevaNota;
