export interface AbonoPago {
    id: number;
    id_registro_pago: any;
    monto:number;
    fecha: string;
    estado?: boolean;
    nombre?: string;
    apellido?: string
    cedula?: string
}