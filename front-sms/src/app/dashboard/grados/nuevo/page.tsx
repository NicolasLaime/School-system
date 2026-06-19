import FormNuevoGrado from '@/components/grados/formNuevoGrado'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <PageHeader title="Nuevo Grado" breadcrumbs={[{ label: "Grados", href: "/dashboard/grados" }, { label: "Nuevo" }]} />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevoGrado />
        </div>
    </section>
  )
}

export default page
