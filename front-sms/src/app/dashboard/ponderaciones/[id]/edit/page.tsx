import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import FormEditPonderacion from '@/components/ponderaciones/formEditPonderacion'
import { useGetPonderacionByIdQuery } from '@/redux/services/ponderacionesApi'
import { Loader2 } from 'lucide-react'
import React from 'react'

const Page = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useGetPonderacionByIdQuery(params.id)

  if (isLoading) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="animate-spin h-48 w-48 mx-auto" />
      </section>
    )
  }

  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/ponderaciones" label="Ponderaciones" page="Editar ponderacion" />
        <div className="flex flex-col gap-4 px-5 py-8 w-[80vw] mx-auto">
            <FormEditPonderacion dataPonderacion={data?.data} />
        </div>
    </section>
  )
}

export default Page
