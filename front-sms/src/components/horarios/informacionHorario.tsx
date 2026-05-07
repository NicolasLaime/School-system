import React from 'react'
import { Horario } from '../../../types/horario.type'

interface Props {
  dataHorario: Horario | undefined
}

const formatHora = (hora: { hour: number; minute: number } | string): string => {
  if (typeof hora === "string") return hora;
  return `${hora.hour.toString().padStart(2, "0")}:${hora.minute.toString().padStart(2, "0")}`;
};

const InformacionHorario = ({ dataHorario }: Props) => {
  if (!dataHorario) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-4">
        <p className="text-lg"><strong>ID:</strong> {dataHorario.id}</p>
        <p className="text-lg"><strong>Dia:</strong> {dataHorario.diaSemana}</p>
        <p className="text-lg"><strong>Hora Inicio:</strong> {formatHora(dataHorario.horaInicio)}</p>
        <p className="text-lg"><strong>Hora Fin:</strong> {formatHora(dataHorario.horaFin)}</p>
        <p className="text-lg"><strong>Asignatura ID:</strong> {dataHorario.asignaturaId}</p>
        <p className="text-lg"><strong>Seccion ID:</strong> {dataHorario.seccionId}</p>
    </div>
  )
}

export default InformacionHorario
