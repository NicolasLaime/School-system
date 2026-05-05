"use client"

import React from 'react'
import { DataTable } from '../allUsuarios/data-table'
import { Loader2 } from 'lucide-react'
import { useGetUsersQuery } from '@/redux/services/authApi'
import { getColumns } from '../allUsuarios/columns'

const MainAllMaestros = () => {


   const { data, isLoading, isError } = useGetUsersQuery()


   

   if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    );
  if (isError) return <p>Error al cargar los maestros.</p>;


  console.log("data MAESTROS", data?.data)

  const maestros = data?.data.filter((user) => user.rol === "DOCENTE")

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns()} data={maestros!} />
    </div>
  )
}

export default MainAllMaestros