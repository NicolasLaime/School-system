"use client"

import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetHorariosQuery } from '@/redux/services/horariosApi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllHorarios = () => {
  const { data, isLoading, isError } = useGetHorariosQuery()

  if (isError) return <p>Error al cargar los horarios.</p>;

  const horarios = data?.data

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={horarios ?? []}
      isLoading={isLoading}
      searchPlaceholder="Buscar horarios..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay horarios registrados",
        description: "Cree un nuevo horario para comenzar.",
      }}
      exportConfig={{
        filename: "horarios",
        columns: ["id", "diaSemana", "horaInicio", "horaFin", "asignaturaId", "seccionId"],
      }}
      primaryAction={
        <Link href="/dashboard/horarios/nuevo">
          <Button>Nuevo Horario</Button>
        </Link>
      }
    />
  )
}

export default MainAllHorarios
