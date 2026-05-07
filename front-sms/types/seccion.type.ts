export interface Seccion {
  id: string | number;
  nombre: string;
  gradoId: number;
  cicloLectivo: string;
}


export interface SeccionList {
  cicloEducativoId: number;
  cicloEducativoNombre: string;
  cicloLectivo: string;
  gradoId: number;
  gradoNombre: string;
  id: string | number;
  nombre: string;
}