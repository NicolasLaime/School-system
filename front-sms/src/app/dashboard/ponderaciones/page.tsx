import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllPonderaciones from '@/components/ponderaciones/allPonderaciones/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/ponderaciones" label="Ponderaciones" page="Listado de Ponderaciones" />
            <MainAllPonderaciones />
    </section>
  )
}

export default page
