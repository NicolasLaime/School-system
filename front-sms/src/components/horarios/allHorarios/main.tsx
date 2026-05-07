"use client"

import { Loader2 } from 'lucide-react'
import { useGetHorariosQuery } from '@/redux/services/horariosApi'
import { DataTable } from './data-table'
import { getColumns } from './columns'

const MainAllHorarios = () => {

   const { data, isLoading, isError } = useGetHorariosQuery()

   if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    );
  if (isError) return <p>Error al cargar los horarios.</p>;

  const horarios = data?.data

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns()} data={horarios!} />
    </div>
  )
}

export default MainAllHorarios
