"use client"

import React, { useState } from 'react'
import { DataTableEnhanced } from '@/components/shared/DataTableEnhanced'
import { getTutorColumns } from './columns'
import { Search } from 'lucide-react'
import { useGetTutoresByAlumnoQuery } from '@/redux/services/tutoresApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const MainAllTutores = () => {
  const [codigoBusqueda, setCodigoBusqueda] = useState("");
  const [codigoConsultado, setCodigoConsultado] = useState("");

  const { data, isLoading, isError } = useGetTutoresByAlumnoQuery(codigoConsultado, {
    skip: !codigoConsultado,
  });

  const handleBuscar = () => {
    if (!codigoBusqueda.trim()) return;
    setCodigoConsultado(codigoBusqueda.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBuscar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Buscar tutores por alumno</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Código del alumno (ej: ALU-0001)"
              value={codigoBusqueda}
              onChange={(e) => setCodigoBusqueda(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button
            onClick={handleBuscar}
            disabled={!codigoBusqueda.trim()}
            className="cursor-pointer"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
        {codigoConsultado && (
          <p className="text-sm text-muted-foreground">
            Mostrando tutores de: <span className="font-medium text-foreground">{codigoConsultado}</span>
          </p>
        )}
      </div>

      {!codigoConsultado && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">Ingrese el código de un alumno para ver sus tutores asociados.</p>
        </div>
      )}

      {codigoConsultado && (
        <DataTableEnhanced
          columns={getTutorColumns()}
          data={data?.data ?? []}
          isLoading={isLoading}
          searchPlaceholder="Buscar tutores..."
          globalSearch={true}
          emptyStateProps={{
            title: "No hay tutores registrados",
            description: "No se encontraron tutores para el alumno especificado.",
          }}
          exportConfig={{
            filename: "tutores",
            columns: ["id", "nombre", "apellido", "email", "telefono", "parentesco"],
          }}
        />
      )}

      {isError && codigoConsultado && (
        <p className="text-destructive text-center py-4">Error al cargar los tutores del alumno.</p>
      )}
    </div>
  )
}

export default MainAllTutores
