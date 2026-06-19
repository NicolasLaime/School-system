"use client"
import { PageHeader } from "@/components/layout/PageHeader"
import { useParams } from 'next/navigation'
import React from 'react'
import { useGetAsignaturasConDocentesQuery } from '@/redux/services/asignatura.Api'
import { Loader2 } from 'lucide-react'
import MateriaInfo from '@/components/materias/materiaInfo'

const Page = () => {
  const params = useParams()
  const id = Number(params.id)

  const { data, isLoading, isError } = useGetAsignaturasConDocentesQuery()

  if (isLoading) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    )
  }

  if (isError || !data?.data) {
    return (
      <section className="container mx-auto py-10 px-5">
        <p className="text-destructive text-center">Error al cargar la asignatura</p>
      </section>
    )
  }

  const materia = data.data.find((m) => m.id === id)

  if (!materia) {
    return (
      <section className="container mx-auto py-10 px-5">
        <p className="text-destructive text-center">Asignatura no encontrada</p>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-10 py-5">
      <PageHeader title="Detalle de Materia" breadcrumbs={[{ label: "Materias", href: "/dashboard/materias" }, { label: "Detalle" }]} />
      <MateriaInfo materia={materia} />
    </section>
  )
}

export default Page
