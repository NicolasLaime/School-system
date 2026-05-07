import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormNuevoCiclo from '@/components/ciclos/formNuevoCiclo'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/ciclos" label="Ciclos" page="Crear nuevo ciclo" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormNuevoCiclo />
        </div>
    </section>
  )
}

export default page
