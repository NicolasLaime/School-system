import FormNuevoAlumno from '@/components/alumnos/formNuevoAlumno'
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto py-10 px-5">
        <PageHeader title="Nuevo Alumno" breadcrumbs={[{ label: "Alumnos", href: "/dashboard/alumnos" }, { label: "Nuevo" }]} />
        <section className="container mx-auto py-10 px-5 w-200">
        <Card>
          <CardHeader>
            <CardTitle>Nuevo alumno</CardTitle>
          </CardHeader>
          <CardContent>
           
            <FormNuevoAlumno />
          </CardContent>
        </Card>
      </section>
    </section>
  )
}

export default page