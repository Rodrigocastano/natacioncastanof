/* export interface PlanPago {
  id: number;
  id_usuario: any;
  id_tipo_pago: any;
  monto: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_cobro: string;
  estado_funcional: number;
  estado?: boolean;
  nombre?: string;
  apellido?: string;
  cedula?: string;
} */

// archivo: planpago.ts
export interface PlanPago {
  id?: number;
  id_usuario: number;
  id_tipo_pago: number;
  monto: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_cobro: {  // Cambia de string a esta estructura
    frecuencia: string;
    dias: any[];  // O puedes usar number[] | string[] según lo que uses
  };
  estado_funcional: number;
    estado?: boolean;
  nombre?: string;
  apellido?: string;
  cedula?: string;
}
