"use client"

import React from 'react'
import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetAlumnosQuery } from '@/redux/services/alumnosApi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllAlumnos = () => {
  const { data, isLoading, isError } = useGetAlumnosQuery()

  if (isError) return <p>Error al cargar los alumnos.</p>;

  const alumnos = data?.data ?? []

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={alumnos}
      isLoading={isLoading}
      searchPlaceholder="Buscar alumnos..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay alumnos registrados",
        description: "Cree un nuevo alumno para comenzar.",
      }}
      exportConfig={{
        filename: "alumnos",
        columns: ["id", "codigo", "nombre", "apellido", "documento", "gradoNombre", "seccionNombre"],
      }}
      primaryAction={
        <Link href="/dashboard/alumnos/nuevo">
          <Button>Nuevo Alumno</Button>
        </Link>
      }
    />
  )
}

export default MainAllAlumnos