"use client"

import { useState } from "react"
import { useGetPonderacionesQuery, useDeletePonderacionMutation } from "@/redux/services/ponderacionesApi"
import { Loader2 } from "lucide-react"
import { DataTable } from "./data-table"
import { getColumns } from "./columns"

const MainAllPonderaciones = () => {
  const { data, isLoading, isError } = useGetPonderacionesQuery()
  const [deletePonderacion] = useDeletePonderacionMutation()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    )
  if (isError) return <p>Error al cargar las ponderaciones.</p>

  const ponderaciones = data?.data || []

  const handleDelete = async (id: string) => {
    if (confirm("Estas seguro de eliminar esta ponderacion?")) {
      try {
        await deletePonderacion(id).unwrap()
      } catch (error) {
        console.error("Error al eliminar ponderacion:", error)
      }
    }
  }

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns(handleDelete)} data={ponderaciones!} />
    </div>
  )
}

export default MainAllPonderaciones
