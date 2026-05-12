import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormNuevaNota from '@/components/notas/formNuevaNota'
import React from 'react'

const Page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator href="/dashboard/notas" label="Notas" page="Crear nueva nota" />
      <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
        <FormNuevaNota />
      </div>
    </section>
  )
}

export default Page
