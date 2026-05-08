"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormEditNota from '@/components/notas/formEditNota'
import InformacionNota from '@/components/notas/informacionNota'
import { useGetNotaByIdQuery } from '@/redux/services/notasApi'
import { Loader2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const params = useParams()
  const id = params.id as string
  const [editarNota, setEditarNota] = React.useState(false)

  if (!id) { notFound() }

  const { data, isLoading, isError } = useGetNotaByIdQuery(id)

  if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    )

  if (isError) return <div>Nota no encontrada</div>

  const dataNota = data?.data

  if (!dataNota || !dataNota.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    )
  }

  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator href="/dashboard/notas" label="notas" page="Editar nota" />
      <section className="container mx-auto py-10 px-5">
        <Card className='shadow-md'>
          <CardHeader>
            <CardTitle>Datos de la nota</CardTitle>
          </CardHeader>
          <CardContent>
            {editarNota ? (
              <FormEditNota dataNota={dataNota} />
            ) : (
              <InformacionNota dataNota={dataNota} />
            )}
          </CardContent>
        </Card>
        <Button onClick={() => setEditarNota(!editarNota)} className="mt-5 cursor-pointer">
          {editarNota ? "Cancelar" : "Editar"}
        </Button>
      </section>
    </section>
  )
}

export default Page
