import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllAsistencias from '@/components/asistencias/allAsistencias/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/asistencias" label="Asistencias" page="Listado de Asistencias" />
            <MainAllAsistencias />
    </section>
  )
}

export default page
