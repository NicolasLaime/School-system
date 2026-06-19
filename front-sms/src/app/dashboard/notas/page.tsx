import { PageHeader } from "@/components/layout/PageHeader"
import MainAllNotas from '@/components/notas/allNotas/main'

const Page = () => {
  return (
    <>
      <PageHeader
        title="Notas"
        breadcrumbs={[{ label: "Notas" }]}
        actions={
          <a href="/dashboard/notas/nuevo">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Nueva
            </button>
          </a>
        }
      />
      <MainAllNotas />
    </>
  )
}

export default Page
