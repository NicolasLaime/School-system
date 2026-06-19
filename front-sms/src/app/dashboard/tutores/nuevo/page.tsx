import FormNuevoTutor from '@/components/tutores/formNuevoTutor'
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto py-10 px-5">
        <PageHeader title="Nuevo Tutor" breadcrumbs={[{ label: "Tutores", href: "/dashboard/tutores" }, { label: "Nuevo" }]} />
        <section className="container mx-auto py-10 px-5 w-200">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo tutor</CardTitle>
          </CardHeader>
          <CardContent>
           
            <FormNuevoTutor />
          </CardContent>
        </Card>
      </section>
    </section>
  )
}

export default page
