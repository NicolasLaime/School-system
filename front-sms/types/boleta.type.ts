import { Student } from "./alumnos.types";

export type Boleta = {
  alumno: Student;
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
