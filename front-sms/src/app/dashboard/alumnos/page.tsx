

import MainAllAlumnos from '@/components/alumnos/allAlumnos/main'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/alumnos" label="Alumnos" page="Listado de Alumnos" />
            <MainAllAlumnos />
    </section>
  )
}

export default page