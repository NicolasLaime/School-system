import React from 'react'
import { NotaData } from '../../../types/nota.type'

interface Props {
  dataNota: NotaData | undefined
}

const InformacionNota = ({ dataNota }: Props) => {
  if (!dataNota) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4">
      <p className="text-lg"><strong>ID:</strong> {dataNota.id}</p>
      <p className="text-lg"><strong>Alumno ID:</strong> {dataNota.alumnoId}</p>
      {dataNota.alumnoNombre && (
        <p className="text-lg"><strong>Alumno:</strong> {dataNota.alumnoNombre} {dataNota.alumnoApellido}</p>
      )}
      <p className="text-lg"><strong>Asignatura ID:</strong> {dataNota.asignaturaId}</p>
      {dataNota.asignaturaNombre && (
        <p className="text-lg"><strong>Asignatura:</strong> {dataNota.asignaturaNombre}</p>
      )}
      <p className="text-lg"><strong>Seccion ID:</strong> {dataNota.seccionId}</p>
      <p className="text-lg"><strong>Bimestre:</strong> {dataNota.bimestre}</p>
      <p className="text-lg"><strong>Ciclo Lectivo:</strong> {dataNota.cicloLectivo}</p>
      <p className="text-lg"><strong>Tipo de Nota:</strong> {dataNota.tipoNota}</p>
      <p className="text-lg"><strong>Valor:</strong> {dataNota.valor}</p>
      <p className="text-lg"><strong>Docente ID:</strong> {dataNota.docenteId}</p>
    </div>
  )
}

export default InformacionNota
