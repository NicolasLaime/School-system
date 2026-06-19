import FormNuevaSeccion from '@/components/secciones/formNuevaSeccion'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <PageHeader title="Nueva Sección" breadcrumbs={[{ label: "Secciones", href: "/dashboard/secciones" }, { label: "Nueva" }]} />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevaSeccion />
        </div>
    </section>
  )
}

export default page
