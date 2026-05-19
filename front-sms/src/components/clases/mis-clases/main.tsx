"use client"
import { skipToken } from '@reduxjs/toolkit/query'
import { selectUserLogin } from '@/redux/features/userSlice'
import React from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from './data-table'
import { getColumns } from './columns'
import { useGetAsignaturasByDocenteQuery } from '@/redux/services/asignatura.Api'
import { Loader2 } from 'lucide-react'

const MainMisClases = () => {

    const userLogin = useSelector(selectUserLogin)

   const { data, isLoading, isError } = useGetAsignaturasByDocenteQuery(userLogin?.userId ?? skipToken)


   console.log("dataaa", data)

   if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    );
  if (isError) return <p>Error al cargar las clases.</p>;


  console.log("data clases", data?.data)

  const clases = data?.data

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns()} data={clases!} />
    </div>
  )
}

export default MainMisClases