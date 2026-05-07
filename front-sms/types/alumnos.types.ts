import { Nota } from "./nota.type";


export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  grado: number; // Ej: "1ro, 2do"
  seccion: string; // Ej: "A, B"
  notas: Nota[];
  inscripciones: Nota[];
}

export interface AlumnoList {
activo: boolean
apellido: string
cicloEducativoId?: number
cicloEducativoNombre?: string
cicloLectivo?: string
codigo: string
gradoId: number
gradoNombre: string
id: number
nombre: string
seccionId: number
seccionNombre: string
documento: string
telefono: string
direccion: string
}