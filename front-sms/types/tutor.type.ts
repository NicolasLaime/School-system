export interface TutorAlumno {
  codigoAlumno: string;
  nombreAlumno: string;
}

export interface Tutor {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  parentesco: string;
  alumnos: TutorAlumno[];
}

export interface CreateTutorRequest {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  parentesco: string;
  alumnoIds: number[];
}
