import FormAsistenciaAlumno from '@/components/asistencias/formAsistenciaAlumno'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <PageHeader title="Registrar Asistencia" breadcrumbs={[{ label: "Asistencias", href: "/dashboard/asistencias" }, { label: "Nuevo" }]} />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormAsistenciaAlumno />
        </div>
    </section>
  )
}

export default page
