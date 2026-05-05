
import MainAllClases from '@/components/clases/allClases/main'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/clases" label="Clases" page="Listado de Clases" />
            <MainAllClases />
    </section>
  )
}

export default page