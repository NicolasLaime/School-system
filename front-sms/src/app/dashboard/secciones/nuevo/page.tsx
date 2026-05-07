import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormNuevaSeccion from '@/components/secciones/formNuevaSeccion'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/secciones" label="Secciones" page="Crear nueva seccion" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevaSeccion />
        </div>
    </section>
  )
}

export default page
