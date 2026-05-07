export interface Ponderacion {
  id: string | number;
  cicloEducativoId: number;
  nombre: string;
  porcentaje: number;
}

export interface CreatePonderacionDto {
  cicloEducativoId: number;
  nombre: string;
  porcentaje: number;
}

export interface UpdatePonderacionDto {
  cicloEducativoId?: number;
  nombre?: string;
  porcentaje?: number;
}

export interface PonderacionResumen {
  cicloEducativoId: number;
  cicloEducativoNombre: string;
  totalPorcentaje: number;
  ponderaciones: Ponderacion[];
}
