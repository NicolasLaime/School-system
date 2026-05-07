import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllGrados from '@/components/grados/allGrados/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/grados" label="Grados" page="Listado de Grados" />
            <MainAllGrados />
    </section>
  )
}

export default page
