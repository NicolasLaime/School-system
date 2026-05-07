import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllMaestros from '@/components/usuarios/maestros/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/maestros" label="Maestros" page="Listado de maestros" />
            <MainAllMaestros />
    </section>
  )
}

export default page