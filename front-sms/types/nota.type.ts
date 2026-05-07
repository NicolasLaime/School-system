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
  peso: number; // porcentaje (ej: 0.25)
}

export interface NotaParcial {
  id?: string;
  valor: number;
  bimestre: number;
  alumnoId?: string;
  materia?: Materia;
}

