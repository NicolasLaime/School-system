"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormEditGrado from '@/components/grados/formEditGrado'
import InformacionGrado from '@/components/grados/informacionGrado'
import { useGetGradoByIdQuery } from '@/redux/services/gradosApi'
import { Loader2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id as string
  const [editarGrado, setEditarGrado] = React.useState(false)

 if(!id){
    notFound()
 } 

 const {data , isLoading, isError} = useGetGradoByIdQuery(id)

 if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  
  if (isError) return <div>Grado no encontrado</div>;


  const dataGrado = data?.data

  if (!dataGrado || !dataGrado.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }

  const handleEditarGrado = () => {
    setEditarGrado(!editarGrado)
  }

  
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/grados"
        label="grados"
        page="Editar grado"
      />
      <section className="container mx-auto py-10 px-5">
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>Datos del grado</CardTitle>
        </CardHeader>
        <CardContent>
      { editarGrado ? 
        <FormEditGrado
          dataGrado={dataGrado}
        />
        :
        <InformacionGrado dataGrado={dataGrado} />
      }
        </CardContent>
        </Card>
        <Button onClick={handleEditarGrado} className="mt-5 cursor-pointer justify-content-end">
          { editarGrado ? "Cancelar" : "Editar "}
        </Button>
      </section>
    </section>
  );
}

export default Page
