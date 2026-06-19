import { PageHeader } from "@/components/layout/PageHeader"
import MainAllUsuarios from '@/components/usuarios/allUsuarios/main'

const page = () => {
  return (
    <>
      <PageHeader
        title="Usuarios"
        breadcrumbs={[{ label: "Usuarios" }]}
        actions={
          <a href="/dashboard/usuarios/nuevo">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Nuevo
            </button>
          </a>
        }
      />
      <MainAllUsuarios />
    </>
  )
}

export default page
