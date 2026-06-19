"use client"

import React from 'react'
import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetAsignaturasConDocentesQuery } from '@/redux/services/asignatura.Api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllClases = () => {
  const { data, isLoading, isError } = useGetAsignaturasConDocentesQuery()

  if (isError) return <p>Error al cargar las clases.</p>;

  const rows = data?.data?.flatMap((asignatura) => asignatura.docentes ?? []) ?? []

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={rows}
      isLoading={isLoading}
      searchPlaceholder="Buscar clases..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay clases registradas",
        description: "Cree una nueva clase para comenzar.",
      }}
      exportConfig={{
        filename: "clases",
        columns: ["id", "asignaturaNombre", "seccionNombre", "gradoNombre"],
      }}
      primaryAction={
        <Link href="/dashboard/clases/nuevo">
          <Button>Nueva Clase</Button>
        </Link>
      }
    />
  )
}

export default MainAllClases
