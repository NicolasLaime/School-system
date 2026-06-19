import { PageHeader } from "@/components/layout/PageHeader"
import MainAllGrados from '@/components/grados/allGrados/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Grados"
        breadcrumbs={[{ label: "Grados" }]}
        actions={
          <a href="/dashboard/grados/nuevo">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Nuevo
            </button>
          </a>
        }
      />
      <MainAllGrados />
    </>
  )
}

export default page
