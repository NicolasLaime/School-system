import React from 'react'
import { Ciclo } from '../../../types/ciclo.type'

interface Props {
  dataCiclo: Ciclo | undefined
}

const InformacionCiclo = ({ dataCiclo }: Props) => {
  if (!dataCiclo) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4">
        <p className="text-lg"><strong>ID:</strong> {dataCiclo.id}</p>
        <p className="text-lg"><strong>Nombre:</strong> {dataCiclo.nombre}</p>
    </div>
  )
}

export default InformacionCiclo
