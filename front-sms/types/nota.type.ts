import { Materia } from "./materia.types";
import { Clase } from "./Usuario.type";

type Bimestre = 1 | 2 | 3 | 4;

export interface Nota {
  id: string;
  clase: Clase,
  valor: number;
  bimestre: Bimestre;
  alumnoId: string;
  materia: Materia;
  createdAt: string;
  updatedAt: string;
}

export interface Ponderacion {
  id: string;
  ciclo: 'PRIMARIA' | 'SECUNDARIA';
  bimestre: Bimestre;
  peso: number;
}

export interface NotaParcial {
  id?: string;
  valor: number;
  bimestre: number;
  alumnoId?: string;
  materia?: Materia;
}

export interface CreateNotaRequest {
  alumnoId: number;
  asignaturaId: number;
  seccionId: number;
  bimestre: string;
  cicloLectivo: string;
  tipoNota: string;
  valor: number;
  docenteId: number;
}

export interface NotaData {
  id: string;
  alumnoId: number;
  asignaturaId: number;
  seccionId: number;
  bimestre: string;
  cicloLectivo: string;
  tipoNota: string;
  valor: number;
  docenteId: number;
  createdAt: string;
  updatedAt: string;
  alumnoNombre?: string;
  alumnoApellido?: string;
  asignaturaNombre?: string;
}

export interface NotasResponse {
  message: string;
  data: NotaData[];
  error?: string;
}

export interface NotaResponse {
  message: string;
  data: NotaData;
  error?: string;
}

export interface NotaResumenAsignatura {
  asignaturaId: number;
  asignaturaNombre: string;
  promediosPorBimestre: Record<string, number>;
  promedioFinal: number;
}

export interface NotaResumenData {
  alumnoId: number;
  alumnoCodigo: string;
  alumnoNombre: string;
  alumnoApellido: string;
  seccionNombre: string;
  gradoNombre: string;
  cicloLectivo: string;
  asignaturas: NotaResumenAsignatura[];
  promedioGeneral: number;
}

export interface NotaResumenResponse {
  success: boolean;
  message: string;
  data: NotaResumenData;
}
