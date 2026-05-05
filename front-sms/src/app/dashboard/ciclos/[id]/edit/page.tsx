"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormEditCiclo from '@/components/ciclos/formEditCiclo'
import InformacionCiclo from '@/components/ciclos/informacionCiclo'
import { useGetCicloByIdQuery } from '@/redux/services/ciclosApi'
import { Loader2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id as string
  const [editarCiclo, setEditarCiclo] = React.useState(false)

 if(!id){
    notFound()
 } 

 const {data , isLoading, isError} = useGetCicloByIdQuery(id)

 if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  
  if (isError) return <div>Ciclo no encontrado</div>;


  const dataCiclo = data?.data

  console.log("dataCiclo", dataCiclo) 

  if (!dataCiclo || !dataCiclo.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }

  const handleEditarCiclo = () => {
    setEditarCiclo(!editarCiclo)
  }

  
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/ciclos"
        label="ciclos"
        page="Editar ciclo"
      />
      <section className="container mx-auto py-10 px-5">
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>Datos del ciclo</CardTitle>
        </CardHeader>
        <CardContent>
      { editarCiclo ? 
        <FormEditCiclo
          dataCiclo={dataCiclo}
        />
        :
        <InformacionCiclo dataCiclo={dataCiclo} />
      }
        </CardContent>
        </Card>
        <Button onClick={handleEditarCiclo} className="mt-5 cursor-pointer justify-content-end">
          { editarCiclo ? "Cancelar" : "Editar "}
        </Button>
      </section>
    </section>
  );
}

export default Page
