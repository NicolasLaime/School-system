import FormNuevoAlumno from '@/components/alumnos/formNuevoAlumno'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto py-10 px-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/alumnos" label="alumnos" page="Nuevo alumno" />
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