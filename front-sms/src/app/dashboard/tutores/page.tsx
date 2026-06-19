import { PageHeader } from "@/components/layout/PageHeader"
import Link from "next/link"
import MainAllTutores from '@/components/tutores/allTutores/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Tutores"
        breadcrumbs={[{ label: "Tutores" }]}
        actions={
          <Link
            href="/dashboard/tutores/nuevo"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Nuevo
          </Link>
        }
      />
      <MainAllTutores />
    </>
  )
}

export default page
