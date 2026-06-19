import FormNuevaNota from '@/components/notas/formNuevaNota'
import { PageHeader } from "@/components/layout/PageHeader"
import React from 'react'

const Page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
      <PageHeader title="Nueva Nota" breadcrumbs={[{ label: "Notas", href: "/dashboard/notas" }, { label: "Nueva" }]} />
      <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
        <FormNuevaNota />
      </div>
    </section>
  )
}

export default Page
