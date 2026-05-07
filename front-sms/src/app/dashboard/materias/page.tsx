

import MainAllMaterias from '@/components/materias/allMaterias/main'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/materias" label="Materias" page="Listado de Materias" />
            <MainAllMaterias />
    </section>
  )
}

export default page