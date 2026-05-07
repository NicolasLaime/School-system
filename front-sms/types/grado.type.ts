export interface Grado {
  id: string | number;
  nombre: string;
  ciclo_id: number;
}


export interface GradoList {
  id: string | number;
  nombre: string;
  cicloEducativoId: number;
  cicloEducativoNombre: string;
}