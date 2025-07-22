export interface AbonoEntrenador {
    id: number;
    id_pago_entrenador: any;
    monto:number;
    fecha: string;
    estado?: boolean;
    nombre?: string;
    apellido?: string
    cedula?: string
}