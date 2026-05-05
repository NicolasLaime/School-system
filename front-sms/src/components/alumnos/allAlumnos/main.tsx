"use client"

import React from 'react'
import { DataTable } from './data-table'
import { getColumns } from './columns'
import { Loader2 } from 'lucide-react'
import { useGetAlumnosQuery } from '@/redux/services/alumnosApi'

const MainAllAlumnos = () => {


   const { data, isLoading, isError } = useGetAlumnosQuery()


   

   if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    );
  if (isError) return <p>Error al cargar los alumnos.</p>;


  console.log("data clases", data?.data)

  const alumnos = data?.data

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns()} data={alumnos!} />
    </div>
  )
}

export default MainAllAlumnos