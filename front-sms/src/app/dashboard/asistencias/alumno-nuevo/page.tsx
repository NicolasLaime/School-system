import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormAsistenciaAlumno from '@/components/asistencias/formAsistenciaAlumno'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/asistencias" label="Asistencias" page="Registrar asistencia alumnos" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormAsistenciaAlumno />
        </div>
    </section>
  )
}

export default page
