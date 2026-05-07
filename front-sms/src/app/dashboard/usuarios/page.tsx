import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllUsuarios from '@/components/usuarios/allUsuarios/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/usuarios" label="Usuarios" page="Listado de Usuarios" />
            <MainAllUsuarios />
    </section>
  )
}

export default page