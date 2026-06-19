import { PageHeader } from "@/components/layout/PageHeader"
import MainAllHorarios from '@/components/horarios/allHorarios/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Horarios"
        breadcrumbs={[{ label: "Horarios" }]}
        actions={
          <a href="/dashboard/horarios/nuevo">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Nuevo
            </button>
          </a>
        }
      />
      <MainAllHorarios />
    </>
  )
}

export default page
