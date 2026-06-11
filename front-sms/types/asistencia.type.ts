export type EstadoAsistencia = 'JUSTIFICADO' | 'PRESENTE' | 'TARDE' | 'AUSENTE';

export interface AsistenciaDocente {
  id: string | number;
  fecha: string;
  estado: EstadoAsistencia;
  docenteId: number;
  docenteNombre?: string;
}

export interface AsistenciaAlumno {
  id: string | number;
  fecha: string;
  estado: EstadoAsistencia;
  alumnoId: number;
  seccionId: number;
  alumnoNombre?: string;
}

export interface CreateAsistenciaDocenteDto {
  fecha: string;
  estado: EstadoAsistencia;
  docenteId: number;
}

export interface CreateAsistenciaAlumnoDto {
  fecha: string;
  estado: EstadoAsistencia;
  alumnoId: number;
  seccionId: number;
}
