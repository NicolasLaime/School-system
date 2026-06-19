"use client"

import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetCiclosQuery } from '@/redux/services/ciclosApi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllCiclos = () => {
  const { data, isLoading, isError } = useGetCiclosQuery()

  if (isError) return <p>Error al cargar los ciclos.</p>;

  const ciclos = data?.data

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={ciclos ?? []}
      isLoading={isLoading}
      searchPlaceholder="Buscar ciclos..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay ciclos registrados",
        description: "Cree un nuevo ciclo para comenzar.",
      }}
      exportConfig={{
        filename: "ciclos",
        columns: ["id", "nombre"],
      }}
      primaryAction={
        <Link href="/dashboard/ciclos/nuevo">
          <Button>Nuevo Ciclo</Button>
        </Link>
      }
    />
  )
}

export default MainAllCiclos
