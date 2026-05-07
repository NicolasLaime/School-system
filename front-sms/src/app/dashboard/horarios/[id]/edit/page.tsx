"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormEditHorario from '@/components/horarios/formEditHorario'
import InformacionHorario from '@/components/horarios/informacionHorario'
import { useGetHorarioByIdQuery } from '@/redux/services/horariosApi'
import { Loader2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id as string
  const [editarHorario, setEditarHorario] = React.useState(false)

 if(!id){
    notFound()
 } 

 const {data , isLoading, isError} = useGetHorarioByIdQuery(id)

 if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  
  if (isError) return <div>Horario no encontrado</div>;


  const dataHorario = data?.data

  if (!dataHorario || !dataHorario.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }

  const handleEditarHorario = () => {
    setEditarHorario(!editarHorario)
  }

  
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/horarios"
        label="horarios"
        page="Editar horario"
      />
      <section className="container mx-auto py-10 px-5">
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>Datos del horario</CardTitle>
        </CardHeader>
        <CardContent>
      { editarHorario ? 
        <FormEditHorario
          dataHorario={dataHorario}
        />
        :
        <InformacionHorario dataHorario={dataHorario} />
      }
        </CardContent>
        </Card>
        <Button onClick={handleEditarHorario} className="mt-5 cursor-pointer justify-content-end">
          { editarHorario ? "Cancelar" : "Editar "}
        </Button>
      </section>
    </section>
  );
}

export default Page
