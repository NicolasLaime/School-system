"use client"

import { Loader2 } from 'lucide-react'
import { useGetNotasQuery } from '@/redux/services/notasApi'
import { DataTable } from './data-table'
import { getColumns } from './columns'

const MainAllNotas = () => {
  const { data, isLoading, isError } = useGetNotasQuery()

  console.log("data", data)

  if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    )
  if (isError) return <p>Error al cargar las notas.</p>

  const notas = data?.data || []

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns()} data={notas} />
    </div>
  )
}

export default MainAllNotas
