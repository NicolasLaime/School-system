"use client"

import React from 'react'
import { DataTable } from './data-table'
import { getColumns } from './columns'
import { Loader2 } from 'lucide-react'
import { useGetAsignaturasConDocentesQuery } from '@/redux/services/asignatura.Api'
import { DocenteAsignado } from '../../../../types/materia.types'

const MainAllClases = () => {
  const { data, isLoading, isError } = useGetAsignaturasConDocentesQuery()

  if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    );
  if (isError) return <p>Error al cargar las clases.</p>;

  const rows: DocenteAsignado[] =
    data?.data?.flatMap((asignatura) => asignatura.docentes ?? []) ?? []

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns()} data={rows} />
    </div>
  )
}

export default MainAllClases
