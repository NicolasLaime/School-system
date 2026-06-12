import { Ciclo } from "./ciclo.type";

export interface Asignatura {
  id: string;
  nombre: string;
  ciclo: Ciclo;
  docenteId: string;
  codigo : string;
  grado: string;
}

export interface AsignaturaEdit{
  id: number;
  cicloEducativoId: number;
cicloEducativoNombre: string;
codigo: string;
gradoId: number;
gradoNombre: string;
nombre: string;
}


export interface AsignaturaByDocente{
      id: number;
      docenteId: number;
      docenteNombre: string;
      docenteApellido: string;
      asignaturaId: number;
      asignaturaNombre: string;
      seccionId: number;
      seccionNombre: string;
      gradoNombre: string;
}

export interface DocenteAsignado {
  id: number;
  docenteId: number;
  docenteNombre: string;
  docenteApellido: string;
  asignaturaId: number;
  asignaturaNombre: string;
  seccionId: number;
  seccionNombre: string;
  gradoNombre: string;
  docentes: null;
}

export interface AsignaturaConDocentes {
  id: number;
  nombre: string;
  codigo: string;
  gradoId: number;
  gradoNombre: string;
  cicloEducativoId: number;
  cicloEducativoNombre: string;
  docenteId: number;
  docenteNombre: string;
  docenteApellido: string;
  docentes: DocenteAsignado[];
}