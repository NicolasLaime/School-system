import { PageHeader } from "@/components/layout/PageHeader"
import MainAllClases from '@/components/clases/allClases/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Clases"
        breadcrumbs={[{ label: "Clases" }]}
        actions={
          <a href="/dashboard/clases/nueva">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Nueva
            </button>
          </a>
        }
      />
      <MainAllClases />
    </>
  )
}

export default page
