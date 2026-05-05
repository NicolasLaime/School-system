"use client"

import { Loader2 } from 'lucide-react'
import { useGetSeccionesQuery } from '@/redux/services/seccionesApi'
import { useGetGradosQuery } from '@/redux/services/gradosApi'
import { DataTable } from './data-table'
import { getColumns } from './columns'
import { useState } from 'react'

const MainAllSecciones = () => {

   const { data, isLoading, isError } = useGetSeccionesQuery()
   const { data: gradosData } = useGetGradosQuery()
   const [filtroGrado, setFiltroGrado] = useState<string>("")
   const [filtroCicloLectivo, setFiltroCicloLectivo] = useState<string>("")

   if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    );
  if (isError) return <p>Error al cargar las secciones.</p>;

  const secciones = data?.data

  const ciclosLectivos = [...new Set(secciones?.map(s => s.cicloLectivo).filter(Boolean))] as string[]

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Filtrar por grado</label>
          <select
            value={filtroGrado}
            onChange={(e) => setFiltroGrado(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background"
          >
            <option value="">Todos</option>
            {gradosData?.data?.map((grado) => (
              <option key={grado.id} value={grado.id}>
                {grado.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Filtrar por ciclo lectivo</label>
          <select
            value={filtroCicloLectivo}
            onChange={(e) => setFiltroCicloLectivo(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-background"
          >
            <option value="">Todos</option>
            {ciclosLectivos.map((ciclo) => (
              <option key={ciclo} value={ciclo}>
                {ciclo}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DataTable 
        columns={getColumns()} 
        data={secciones!} 
        filtroGrado={filtroGrado}
        filtroCicloLectivo={filtroCicloLectivo}
      />
    </div>
  )
}

export default MainAllSecciones
