"use client"

import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetNotasQuery } from '@/redux/services/notasApi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllNotas = () => {
  const { data, isLoading, isError } = useGetNotasQuery()

  if (isError) return <p>Error al cargar las notas.</p>;

  const notas = data?.data || []

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={notas}
      isLoading={isLoading}
      searchPlaceholder="Buscar notas..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay notas registradas",
        description: "Cree una nueva nota para comenzar.",
      }}
      exportConfig={{
        filename: "notas",
        columns: ["id", "alumnoNombre", "asignaturaNombre", "bimestre", "tipoNota", "valor"],
      }}
      primaryAction={
        <Link href="/dashboard/notas/nuevo">
          <Button>Nueva Nota</Button>
        </Link>
      }
    />
  )
}

export default MainAllNotas
