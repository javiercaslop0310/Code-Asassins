export interface Proyecto {
  id?: number;
  nombre: string;
  descripcion?: string;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  tareas?: Tarea[];
}

export interface Tarea {
  id?: number;
  titulo: string;
  descripcion?: string;
  estado?: string;
  prioridad?: string;
  fechaLimite?: string;
  completadaEn?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  proyecto?: {
    id: number;
  };
}