import FormNuevoUsuario from '@/components/usuarios/formNuevoUsuario'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <PageHeader title="Nuevo Usuario" breadcrumbs={[{ label: "Usuarios", href: "/dashboard/usuarios" }, { label: "Nuevo" }]} />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">

            <FormNuevoUsuario />
        </div>
    </section>
  )
}

export default page