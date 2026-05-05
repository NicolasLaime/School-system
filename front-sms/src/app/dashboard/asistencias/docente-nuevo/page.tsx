import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormAsistenciaDocente from '@/components/asistencias/formAsistenciaDocente'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/asistencias" label="Asistencias" page="Registrar asistencia docente" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormAsistenciaDocente />
        </div>
    </section>
  )
}

export default page
