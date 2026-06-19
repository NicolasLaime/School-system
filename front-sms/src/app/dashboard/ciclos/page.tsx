import { PageHeader } from "@/components/layout/PageHeader"
import MainAllCiclos from '@/components/ciclos/allCiclos/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Ciclos"
        breadcrumbs={[{ label: "Ciclos" }]}
        actions={
          <a href="/dashboard/ciclos/nuevo">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Nuevo
            </button>
          </a>
        }
      />
      <MainAllCiclos />
    </>
  )
}

export default page
