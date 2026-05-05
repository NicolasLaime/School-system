import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormNuevoPonderacion from '@/components/ponderaciones/formNuevoPonderacion'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/ponderaciones" label="Ponderaciones" page="Crear nueva ponderacion" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevoPonderacion />
        </div>
    </section>
  )
}

export default page
