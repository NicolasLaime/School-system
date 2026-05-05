import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormNuevoGrado from '@/components/grados/formNuevoGrado'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/grados" label="Grados" page="Crear nuevo grado" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevoGrado />
        </div>
    </section>
  )
}

export default page
