import FormNuevoHorario from '@/components/horarios/formNuevoHorario'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <PageHeader title="Nuevo Horario" breadcrumbs={[{ label: "Horarios", href: "/dashboard/horarios" }, { label: "Nuevo" }]} />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevoHorario />
        </div>
    </section>
  )
}

export default page
