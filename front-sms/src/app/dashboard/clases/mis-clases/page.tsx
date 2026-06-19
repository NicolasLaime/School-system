import { PageHeader } from "@/components/layout/PageHeader"
import MainMisClases from '@/components/clases/mis-clases/main'

const page = () => {
  return (
    <>
      <PageHeader title="Mis Clases" breadcrumbs={[{ label: "Clases" }, { label: "Mis Clases" }]} />
      <MainMisClases />
    </>
  )
}

export default page
