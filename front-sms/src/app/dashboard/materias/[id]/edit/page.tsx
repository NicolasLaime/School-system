"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { useParams } from 'next/navigation'
import React from 'react'
import NotFound from './not-found'
import { useGetAsignaturaByIdQuery } from '@/redux/services/asignatura.Api'
import { Loader2 } from 'lucide-react'
import FormEditarAsignatura from '@/components/materias/formEditarMateria'

const Page = () => {

    const params = useParams()
    const id = params.id as string

 if(!id){
     NotFound()
 } 

 const {data , isLoading, isError} = useGetAsignaturaByIdQuery(id)

 if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  
  if (isError) return <div>Asignatura no encontrada</div>;


  const dataAsignatura = data?.data

  if (!dataAsignatura || !dataAsignatura?.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }


  return (
    <div className="container mx-auto py-10 px-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/materias" label="asignaturas" page="Editar asignatura" />
        <div className="container mx-auto py-10 px-5">
            <FormEditarAsignatura dataAsignatura={dataAsignatura} />
        </div>
    </div>
  )
}

export default Page
