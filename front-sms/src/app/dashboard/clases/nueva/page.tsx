import FormNuevaClase from '@/components/clases/formNuevaClase'
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <main className="container mx-auto py-10 px-5">
      <PageHeader title="Nueva Clase" breadcrumbs={[{ label: "Clases", href: "/dashboard/clases" }, { label: "Nueva" }]} />
      <section className="container mx-auto py-10 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Clase</CardTitle>
          </CardHeader>
          <CardContent>
            <FormNuevaClase />
          </CardContent>
        </Card>
      </section>

    </main>
  )
}

export default page