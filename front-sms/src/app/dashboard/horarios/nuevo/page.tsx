import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormNuevoHorario from '@/components/horarios/formNuevoHorario'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/horarios" label="Horarios" page="Crear nuevo horario" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevoHorario />
        </div>
    </section>
  )
}

export default page
