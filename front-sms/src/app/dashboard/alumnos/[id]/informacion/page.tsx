"use client";
import InformacionAlumno from '@/components/alumnos/informacionAlumno';
import TablasNotas from '@/components/alumnos/tablasNotas';
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator';
import { useGetAlumnobyIdQuery } from '@/redux/services/alumnosApi';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(2026);
  const [aniosDisponibles, setAniosDisponibles] = useState<number[]>([]);

  const { data: alumnoData, isLoading: isLoadingAlumno, isError: isErrorAlumno } = useGetAlumnobyIdQuery(id);


 

  useEffect(() => {
    const inscripciones = (alumnoData?.data as unknown as { inscripciones?: Array<{ clase: { anioLectivo: number } }> })?.inscripciones;
    if (inscripciones) {
      const anios = inscripciones
        .map(insc => insc.clase.anioLectivo)
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => b - a);

      setAniosDisponibles(anios);

      if (anios.length > 0 && !anios.includes(anioSeleccionado)) {
        const nuevoAnio = anios[0];
        setAnioSeleccionado(nuevoAnio);
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

  const seccionId = (dataAlumno as unknown as { seccionId?: number })?.seccionId;

  return (
    <section className="container mx-auto py-10 px-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/alumnos"
        label="Alumnos"
        page="Información"
      />

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

      <div className="container md:w-200 mx-auto py-10 px-5">
        <TablasNotas
          alumnoId={id}
          onSaved={() => {}}
          anioLectivo={anioSeleccionado}
          aniosDisponibles={aniosDisponibles}
          seccionId={seccionId}
          dataAlumno={{
            nombre: dataAlumno.nombre,
            apellido: dataAlumno.apellido,
            dni: (dataAlumno as unknown as { documento?: string })?.documento,
            direccion: (dataAlumno as unknown as { direccion?: string })?.direccion,
            grado: dataAlumno.gradoNombre,
            seccion: dataAlumno.seccionNombre,
          }}
        />
      </div>
    </section>
  );
};

export default Page;
