

import MainAllTutores from '@/components/tutores/allTutores/main'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/tutores" label="Tutores" page="Listado de Tutores" />
            <MainAllTutores />
    </section>
  )
}

export default page
