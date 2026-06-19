"use client"

import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetUsersQuery } from '@/redux/services/authApi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllUsuarios = () => {
  const { data, isLoading, isError } = useGetUsersQuery()

  if (isError) return <p>Error al cargar los usuarios.</p>;

  const usuarios = data?.data

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={usuarios ?? []}
      isLoading={isLoading}
      searchPlaceholder="Buscar usuarios..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay usuarios registrados",
        description: "Cree un nuevo usuario para comenzar.",
      }}
      exportConfig={{
        filename: "usuarios",
        columns: ["id", "nombre", "apellido", "email", "telefono", "direccion", "rol"],
      }}
      primaryAction={
        <Link href="/dashboard/usuarios/nuevo">
          <Button>Nuevo Usuario</Button>
        </Link>
      }
    />
  )
}

export default MainAllUsuarios
