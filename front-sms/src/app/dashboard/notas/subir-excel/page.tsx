import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormSubirExcel from '@/components/notas/formSubirExcel'
import React from 'react'

const Page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator href="/dashboard/notas" label="Notas" page="Subir notas desde Excel" />
      <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
        <FormSubirExcel />
      </div>
    </section>
  )
}

export default Page
