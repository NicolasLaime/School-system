"use client"

import React from 'react'
import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetAsignaturasQuery } from '@/redux/services/asignatura.Api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllMaterias = () => {
  const { data, isLoading, isError } = useGetAsignaturasQuery()

  if (isError) return <p>Error al cargar las asignaturas.</p>;

  const asignaturas = data?.data

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={asignaturas ?? []}
      isLoading={isLoading}
      searchPlaceholder="Buscar materias..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay materias registradas",
        description: "Cree una nueva materia para comenzar.",
      }}
      exportConfig={{
        filename: "materias",
        columns: ["id", "nombre", "codigo"],
      }}
      primaryAction={
        <Link href="/dashboard/materias/nuevo">
          <Button>Nueva Materia</Button>
        </Link>
      }
    />
  )
}

export default MainAllMaterias
