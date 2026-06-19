import { PageHeader } from "@/components/layout/PageHeader"
import MainAllPonderaciones from '@/components/ponderaciones/allPonderaciones/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Ponderaciones"
        breadcrumbs={[{ label: "Ponderaciones" }]}
        actions={
          <a href="/dashboard/ponderaciones/nuevo">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Nueva
            </button>
          </a>
        }
      />
      <MainAllPonderaciones />
    </>
  )
}

export default page
