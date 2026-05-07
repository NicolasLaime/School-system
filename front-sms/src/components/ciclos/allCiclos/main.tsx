"use client"

import { Loader2 } from 'lucide-react'
import { useGetCiclosQuery } from '@/redux/services/ciclosApi'
import { DataTable } from './data-table'
import { getColumns } from './columns'

const MainAllCiclos = () => {

   const { data, isLoading, isError } = useGetCiclosQuery()

   if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    );
  if (isError) return <p>Error al cargar los ciclos.</p>;


  console.log("data ciclos", data?.data)

  const ciclos = data?.data

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns()} data={ciclos!} />
    </div>
  )
}

export default MainAllCiclos
