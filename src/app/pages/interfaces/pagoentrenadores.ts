export interface pagoEntrenadores {
  id: number;
  id_usuario: any;
  id_estado_pago:any;
  monto: number;
  monto_abonado: number;
  fecha_vencimiento: string;
  fecha: string;
  estado?: boolean;
  nombre?: string;
  apellido?: string;
  cedula?: string;
  genero?: string; 
  id_pago_entrenador?: any;
}