"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormEditSeccion from '@/components/secciones/formEditSeccion'
import InformacionSeccion from '@/components/secciones/informacionSeccion'
import { useGetSeccionByIdQuery } from '@/redux/services/seccionesApi'
import { Loader2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id as string
  const [editarSeccion, setEditarSeccion] = React.useState(false)

 if(!id){
    notFound()
 } 

 const {data , isLoading, isError} = useGetSeccionByIdQuery(id)

 if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  
  if (isError) return <div>Seccion no encontrada</div>;


  const dataSeccion = data?.data

  if (!dataSeccion || !dataSeccion.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }

  const handleEditarSeccion = () => {
    setEditarSeccion(!editarSeccion)
  }

  
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/secciones"
        label="secciones"
        page="Editar seccion"
      />
      <section className="container mx-auto py-10 px-5">
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>Datos de la seccion</CardTitle>
        </CardHeader>
        <CardContent>
      { editarSeccion ? 
        <FormEditSeccion
          dataSeccion={dataSeccion}
        />
        :
        <InformacionSeccion dataSeccion={dataSeccion} />
      }
        </CardContent>
        </Card>
        <Button onClick={handleEditarSeccion} className="mt-5 cursor-pointer justify-content-end">
          { editarSeccion ? "Cancelar" : "Editar "}
        </Button>
      </section>
    </section>
  );
}

export default Page
