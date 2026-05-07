import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllSecciones from '@/components/secciones/allSecciones/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/secciones" label="Secciones" page="Listado de Secciones" />
            <MainAllSecciones />
    </section>
  )
}

export default page
