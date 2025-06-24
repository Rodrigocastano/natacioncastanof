export interface Pago {
    id: number;
    id_usuario: any;
    id_tipo_pago: any;
    id_estado_pago: any;
    fecha: string;
    fecha_vencimiento: string;
    monto:number;
    monto_abonado:number;
    estado?: boolean;
    nombre?: string;
    apellido?: string
    cedula?: string
    tipo_pago?: string;
}