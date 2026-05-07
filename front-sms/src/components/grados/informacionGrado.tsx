import React from 'react'
import { Grado } from '../../../types/grado.type'

interface Props {
  dataGrado: Grado | undefined
}

const InformacionGrado = ({ dataGrado }: Props) => {
  if (!dataGrado) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4">
        <p className="text-lg"><strong>ID:</strong> {dataGrado.id}</p>
        <p className="text-lg"><strong>Nombre:</strong> {dataGrado.nombre}</p>
    </div>
  )
}

export default InformacionGrado
