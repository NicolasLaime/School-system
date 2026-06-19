import { PageHeader } from "@/components/layout/PageHeader"
import Link from "next/link"
import MainAllMaterias from '@/components/materias/allMaterias/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Asignaturas"
        breadcrumbs={[{ label: "Asignaturas" }]}
        actions={
          <Link
            href="/dashboard/materias/nueva"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Nueva
          </Link>
        }
      />
      <MainAllMaterias />
    </>
  )
}

export default page
