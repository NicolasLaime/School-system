"use client"

import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetGradosQuery } from '@/redux/services/gradosApi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllGrados = () => {
  const { data, isLoading, isError } = useGetGradosQuery()

  if (isError) return <p>Error al cargar los grados.</p>;

  const grados = data?.data

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={grados ?? []}
      isLoading={isLoading}
      searchPlaceholder="Buscar grados..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay grados registrados",
        description: "Cree un nuevo grado para comenzar.",
      }}
      exportConfig={{
        filename: "grados",
        columns: ["id", "nombre", "cicloEducativoNombre"],
      }}
      primaryAction={
        <Link href="/dashboard/grados/nuevo">
          <Button>Nuevo Grado</Button>
        </Link>
      }
    />
  )
}

export default MainAllGrados
