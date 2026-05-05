import React from 'react'
import { Seccion } from '../../../types/seccion.type'

interface Props {
  dataSeccion: Seccion | undefined
}

const InformacionSeccion = ({ dataSeccion }: Props) => {
  if (!dataSeccion) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4">
        <p className="text-lg"><strong>ID:</strong> {dataSeccion.id}</p>
        <p className="text-lg"><strong>Nombre:</strong> {dataSeccion.nombre}</p>
        <p className="text-lg"><strong>Grado ID:</strong> {dataSeccion.gradoId}</p>
        <p className="text-lg"><strong>Ciclo Lectivo:</strong> {dataSeccion.cicloLectivo}</p>
    </div>
  )
}

export default InformacionSeccion
