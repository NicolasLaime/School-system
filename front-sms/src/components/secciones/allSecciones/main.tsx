"use client"

import { useState, useMemo } from 'react'
import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getColumns } from './columns'
import { useGetSeccionesQuery } from '@/redux/services/seccionesApi'
import { useGetGradosQuery } from '@/redux/services/gradosApi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MainAllSecciones = () => {
  const { data, isLoading, isError } = useGetSeccionesQuery()
  const { data: gradosData } = useGetGradosQuery()
  const [filtroGrado, setFiltroGrado] = useState<string>("")
  const [filtroCicloLectivo, setFiltroCicloLectivo] = useState<string>("")
  const secciones = useMemo(() => data?.data ?? [], [data])

  const ciclosLectivos = useMemo(
    () => [...new Set(secciones.map(s => s.cicloLectivo).filter(Boolean))] as string[],
    [secciones]
  )

  const filteredData = useMemo(() => {
    let filtered = [...secciones]
    if (filtroGrado) {
      filtered = filtered.filter((item) => String(item.gradoId) === filtroGrado)
    }
    if (filtroCicloLectivo) {
      filtered = filtered.filter((item) => item.cicloLectivo === filtroCicloLectivo)
    }
    return filtered
  }, [secciones, filtroGrado, filtroCicloLectivo])

  if (isError) return <p className="text-destructive text-center py-4">Error al cargar las secciones.</p>;

  const toolbarActions = (
    <div className="flex flex-wrap gap-2">
      <select
        value={filtroGrado}
        onChange={(e) => setFiltroGrado(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm bg-background"
      >
        <option value="">Todos los grados</option>
        {gradosData?.data?.map((grado) => (
          <option key={grado.id} value={grado.id}>
            {grado.nombre}
          </option>
        ))}
      </select>
      <select
        value={filtroCicloLectivo}
        onChange={(e) => setFiltroCicloLectivo(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm bg-background"
      >
        <option value="">Todos los ciclos</option>
        {ciclosLectivos.map((ciclo) => (
          <option key={ciclo} value={ciclo}>
            {ciclo}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <DataTableEnhanced
      columns={getColumns()}
      data={filteredData}
      isLoading={isLoading}
      searchPlaceholder="Buscar secciones..."
      globalSearch={true}
      emptyStateProps={{
        title: "No hay secciones registradas",
        description: "Cree una nueva sección para comenzar.",
      }}
      exportConfig={{
        filename: "secciones",
        columns: ["id", "nombre", "gradoNombre", "cicloEducativoNombre", "cicloLectivo"],
      }}
      toolbarActions={toolbarActions}
      primaryAction={
        <Link href="/dashboard/secciones/nuevo">
          <Button>Nueva Sección</Button>
        </Link>
      }
    />
  )
}

export default MainAllSecciones
