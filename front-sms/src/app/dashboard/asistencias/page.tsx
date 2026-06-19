import { PageHeader } from "@/components/layout/PageHeader"
import MainAllAsistencias from '@/components/asistencias/allAsistencias/main'

const page = () => {
  return (
    <>
      <PageHeader title="Asistencias" breadcrumbs={[{ label: "Asistencias" }]} />
      <MainAllAsistencias />
    </>
  )
}

export default page
