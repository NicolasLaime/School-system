// app/dashboard/alumnos/[id]/page.tsx
"use client";
import InformacionAlumno from '@/components/alumnos/informacionAlumno';
import TablasNotas from '@/components/alumnos/tablasNotas';
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator';
import { useGetAlumnobyIdQuery, useGetNotasPorAnioQuery } from '@/redux/services/alumnosApi';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(2024);
  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);

  // Obtener datos del alumno
  const { data: alumnoData, isLoading: isLoadingAlumno, isError: isErrorAlumno, refetch: refetchAlumno } = useGetAlumnobyIdQuery(id);
  
  // Obtener notas por año
  const { data: notasData, isLoading: isLoadingNotas, refetch: refetchNotas } = useGetNotasPorAnioQuery(
    { id, anio: anioSeleccionado },
    { skip: !id }
  );

  // Extraer años disponibles de las inscripciones del alumno
  useEffect(() => {
    if (alumnoData?.data?.inscripciones) {
      const anios = alumnoData.data.inscripciones
        .map(insc => insc.clase.anioLectivo)
        .filter((v, i, a) => a.indexOf(v) === i) // valores únicos
        .sort((a, b) => b - a); // orden descendente
      
      setAniosDisponibles(anios);
      
      // Si hay años disponibles, seleccionar el más reciente por defecto
      if (anios.length > 0 && !anios.includes(anioSeleccionado)) {
        setAnioSeleccionado(anios[0]);
      }
    }
  }, [alumnoData, anioSeleccionado]);

  if (isLoadingAlumno) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }

  if (isErrorAlumno) return <div>Alumno no encontrado</div>;

  const dataAlumno = alumnoData?.data;
  if (!dataAlumno?.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }

  // 🔥 SOLUCIÓN: Extraer clases del año seleccionado
  const clasesDelAnio = alumnoData?.data?.inscripciones?.filter(
    insc => insc.clase.anioLectivo === anioSeleccionado
  ) || [];

  // Crear mapa de materiaId -> claseId para búsqueda rápida
  const clasesPorMateria = new Map(
    clasesDelAnio.map(insc => [insc.clase.materiaId, insc.clase.id])
  );

  // Preparar datos para la tabla de notas CON claseId correcto
  const notasParaTabla = notasData?.data?.notasPorMateria?.flatMap(materia => 
    materia.notas.map(nota => ({
      ...nota,
      materia: materia.materia,
      // ✅ Usar claseId de la nota si existe, sino buscar en inscripciones
      claseId: nota.clase?.id || clasesPorMateria.get(materia.materia.id) || null
    }))
  ) || [];

  return (
    <section className="container mx-auto py-10 px-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/alumnos"
        label="Alumnos"
        page="Información"
      />

      {/* Información del alumno */}
      <div className="container mx-auto py-10 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Información del alumno</CardTitle>
          </CardHeader>
          <CardContent>
            <InformacionAlumno dataAlumno={dataAlumno} />
          </CardContent>
        </Card>
      </div>

      {/* Selector de año lectivo */}
      <div className="container mx-auto py-5 px-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notas del Alumno</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Año Lectivo:</span>
                <Select
                  value={anioSeleccionado.toString()}
                  onValueChange={(value) => setAnioSeleccionado(parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    {aniosDisponibles.map(anio => (
                      <SelectItem key={anio} value={anio.toString()}>
                        {anio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de notas */}
      <div className="container md:w-200 mx-auto py-10 px-5">
        {isLoadingNotas ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <TablasNotas
            alumnoId={dataAlumno.id}
            dataNotas={notasParaTabla}
            clasesDelAnio={clasesDelAnio} // ✅ Pasar las clases del año
            onSaved={() => {
              refetchNotas();
              refetchAlumno();
            }}
            anioLectivo={anioSeleccionado}
            dataAlumno={dataAlumno}
          />
        )}
      </div>
    </section>
  );
};

export default Page;