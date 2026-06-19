import { PageHeader } from "@/components/layout/PageHeader"
import MainAllSecciones from '@/components/secciones/allSecciones/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Secciones"
        breadcrumbs={[{ label: "Secciones" }]}
        actions={
          <a href="/dashboard/secciones/nuevo">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Nueva
            </button>
          </a>
        }
      />
      <MainAllSecciones />
    </>
  )
}

export default page
