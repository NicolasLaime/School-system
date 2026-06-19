import { PageHeader } from "@/components/layout/PageHeader"
import MainAllAlumnos from '@/components/alumnos/allAlumnos/main'

const page = () => {
  return (
    <>
      <PageHeader title="Alumnos" breadcrumbs={[{ label: "Alumnos" }]} />
      <MainAllAlumnos />
    </>
  )
}

export default page
