import { PageHeader } from "@/components/layout/PageHeader"
import FormEditPonderacion from '@/components/ponderaciones/formEditPonderacion'
import { useGetPonderacionByIdQuery } from '@/redux/services/ponderacionesApi'
import { Loader2 } from 'lucide-react'
import React from 'react'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params)
  const { data, isLoading } = useGetPonderacionByIdQuery(id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    )
  }

  return (
    <>
        <PageHeader title="Editar ponderación" breadcrumbs={[{ label: "Ponderaciones", href: "/dashboard/ponderaciones" }, { label: "Editar" }]} />
        <FormEditPonderacion dataPonderacion={data?.data} />
    </>
  )
}

export default Page
