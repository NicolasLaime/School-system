import MainAllMaestros from '@/components/usuarios/maestros/main'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <PageHeader title="Maestros" breadcrumbs={[{ label: "Usuarios", href: "/dashboard/usuarios" }, { label: "Maestros" }]} />
            <MainAllMaestros />
    </section>
  )
}

export default page