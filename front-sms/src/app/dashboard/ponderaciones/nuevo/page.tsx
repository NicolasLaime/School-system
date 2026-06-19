import FormNuevoPonderacion from '@/components/ponderaciones/formNuevoPonderacion'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <PageHeader title="Nueva Ponderación" breadcrumbs={[{ label: "Ponderaciones", href: "/dashboard/ponderaciones" }, { label: "Nueva" }]} />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevoPonderacion />
        </div>
    </section>
  )
}

export default page
