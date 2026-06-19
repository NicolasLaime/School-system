"use client"
import FormEditarTutor from '@/components/tutores/formEditarTutor'
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetTutorByIdQuery } from '@/redux/services/tutoresApi'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = Number(params.id)

  const { data: tutorData, isLoading, isError } = useGetTutorByIdQuery(id)

  if (isLoading) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    )
  }

  if (isError || !tutorData?.data) {
    return (
      <section className="container mx-auto py-10 px-5">
        <p className="text-destructive text-center">Tutor no encontrado</p>
      </section>
    )
  }

  return (
    <section className="container mx-auto py-10 px-5">
      <PageHeader title="Detalle del Tutor" breadcrumbs={[{ label: "Tutores", href: "/dashboard/tutores" }, { label: "Detalle" }]} />
      <section className="container mx-auto py-10 px-5 w-200">
        <Card>
          <CardHeader>
            <CardTitle>Editar tutor</CardTitle>
          </CardHeader>
          <CardContent>
            <FormEditarTutor tutor={tutorData.data} />
          </CardContent>
        </Card>
      </section>
    </section>
  )
}

export default Page
