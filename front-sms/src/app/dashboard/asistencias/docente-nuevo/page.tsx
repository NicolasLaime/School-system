import FormAsistenciaDocente from '@/components/asistencias/formAsistenciaDocente'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <PageHeader title="Registrar Asistencia Docente" breadcrumbs={[{ label: "Asistencias", href: "/dashboard/asistencias" }, { label: "Docente" }]} />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormAsistenciaDocente />
        </div>
    </section>
  )
}

export default page
