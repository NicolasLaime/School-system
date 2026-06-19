import FormnuevaMateria from '@/components/materias/formnuevaMateria'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <div>
        <PageHeader title="Nueva Materia" breadcrumbs={[{ label: "Materias", href: "/dashboard/materias" }, { label: "Nueva" }]} />
        <div className="container mx-auto px-5 py-10 w-[60vw]">

        <FormnuevaMateria />
        </div>
    </div>
  )
}

export default page