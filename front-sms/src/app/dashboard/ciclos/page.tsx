import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllCiclos from '@/components/ciclos/allCiclos/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/ciclos" label="Ciclos" page="Listado de Ciclos" />
            <MainAllCiclos />
    </section>
  )
}

export default page
