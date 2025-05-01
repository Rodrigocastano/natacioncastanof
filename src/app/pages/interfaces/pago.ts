export interface Pago {
    id: number;
    id_usuario: any;
    id_tipo_pago: any;
    id_estado_pago: any;
    fecha: string;
    monto:number;
    estado?: boolean;
    nombre?: string;
    apellido?: string
    cedula?: string
}