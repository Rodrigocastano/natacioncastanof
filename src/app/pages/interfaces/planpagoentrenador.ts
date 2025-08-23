// archivo: planpago.ts
export interface PlanPagoEntrenador {
  id?: number;
  id_usuario: number;
  monto: number;
  fecha_inicio: string;
  fecha_fin: string;
  anio: string;
  fecha_cobro: {
    frecuencia: string;
    dias: any[];
  };
  estado_funcional: number;
  estado?: boolean;
  nombre?: string;
  apellido?: string;
  cedula?: string;
}