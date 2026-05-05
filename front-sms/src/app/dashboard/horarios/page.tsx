import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllHorarios from '@/components/horarios/allHorarios/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/horarios" label="Horarios" page="Listado de Horarios" />
            <MainAllHorarios />
    </section>
  )
}

export default page
