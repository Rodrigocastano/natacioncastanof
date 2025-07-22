export interface Asistencia {
    id: number;
    id_usuario: any;
    fecha: string;
    presente: number;
    estado?: boolean;
    nombre?: string;
    apellido?: string
    cedula?: string
    grupo?: string;
    turno?: string;
}