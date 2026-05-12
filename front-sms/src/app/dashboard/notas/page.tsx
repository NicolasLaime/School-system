import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllNotas from '@/components/notas/allNotas/main'
import React from 'react'

const Page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator href="/dashboard/notas" label="Notas" page="Listado de Notas" />
      <MainAllNotas />
    </section>
  )
}

export default Page
