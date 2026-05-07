
import MainMisClases from '@/components/clases/mis-clases/main'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/clases" label="Clases" page="Mis Clases" />
            <MainMisClases />
    </section>
  )
}

export default page