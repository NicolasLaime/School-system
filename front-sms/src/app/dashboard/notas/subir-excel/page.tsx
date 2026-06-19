import FormSubirExcel from '@/components/notas/formSubirExcel'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const Page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
      <PageHeader title="Subir Notas desde Excel" breadcrumbs={[{ label: "Notas", href: "/dashboard/notas" }, { label: "Subir Excel" }]} />
      <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
        <FormSubirExcel />
      </div>
    </section>
  )
}

export default Page
