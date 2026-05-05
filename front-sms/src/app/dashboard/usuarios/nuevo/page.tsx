import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormNuevoUsuario from '@/components/usuarios/formNuevoUsuario'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/usuarios" label="Usuarios" page="Crear nuevo usuario" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">

            <FormNuevoUsuario />
        </div>
    </section>
  )
}

export default page