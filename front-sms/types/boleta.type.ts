import { Alumno } from "./alumnos.types";

export type Boleta = {
  alumno: Alumno;
  promedioFinal: number;
  promediosBimestrales: {
    bimestre: number;
    promedio: number;
  }[];
  materias: {
    nombre: string;
    notas: number[];
  }[];
}
