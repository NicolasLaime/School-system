"use client"
import InformacionDocente from '@/components/clases/informacionDocente'
import TablasAlumnosClases from '@/components/clases/tablasAlumnosClases'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { useGetClasesbyIdQuery } from '@/redux/services/clasesApi'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id as string
  const { data, isLoading, isError, refetch } = useGetClasesbyIdQuery(id)

  // Destructuring con valores por defecto
  const { 
    docente, 
    anioLectivo, 
    docenteId, 
    materiaId, 
    materia, 
    estudiantes: AlumnosClase,
    id: claseId 
  } = data?.data || {}

  const { nombre: materiaNombre } = materia || {}

  if (!id) return <div>No se ha encontrado la clase</div>

  if (isLoading) return (
    <section className="container mx-auto py-10">
      <Loader2 className="mx-auto h-48 w-48 animate-spin" />
    </section>
  )

  if (isError) return <div>Clase no encontrada</div>

  // Validaciones agrupadas
  const missingData = []
  if (!docente) missingData.push("docente")
  if (!anioLectivo) missingData.push("año lectivo")
  if (!docenteId) missingData.push("ID del docente")
  if (!materiaId) missingData.push("ID de la materia")
  if (!claseId) missingData.push("ID de la clase")
  if (!materiaNombre) missingData.push("nombre de la materia")

  if (missingData.length > 0) {
    return (
      <div className='text-red-500 container mx-auto py-10 px-5'>
        Faltan datos: {missingData.join(', ')}
      </div>
    )
  }

  const handleDocenteUpdated = () => {
    console.log("✅ Docente actualizado, recargando datos...")
    refetch()
  }

  // Props agrupadas por componente
  const infoDocenteProps = {
    docente: docente!,
    anioLectivo: anioLectivo!,
    claseId: claseId!,
    docenteId: docenteId!,
    onDocenteUpdated: handleDocenteUpdated
  }

  const tablasAlumnosProps = {
    AlumnosClase: AlumnosClase!,
    docenteId: docenteId!,
    materiaId: materiaId!,
    claseId: claseId!,
    anioLectivo: anioLectivo!,
    materiaNombre: materiaNombre!,
    refetch
  }

  return (
    <main className="container mx-auto py-10 px-5">
      <BreadcrumbWithCustomSeparator 
        href="/dashboard/clases" 
        label="Clases" 
        page="Informacion" 
      />
      
      <section className="container mx-auto py-10 px-5">
        <InformacionDocente {...infoDocenteProps} />
      </section>
      
      <section className="container mx-auto py-10 px-5">
        <TablasAlumnosClases {...tablasAlumnosProps} />
      </section>
    </main>
  )
}

export default Page