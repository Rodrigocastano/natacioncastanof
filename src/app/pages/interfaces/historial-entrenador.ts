export interface HistorialEntrenador {
    id: number;
    id_usuario: number;
    nombre: string;
    apellido: string;
    cedula: string;
    id_grupo: number;
    grupo: string;
    turno: 'mañana' | 'tarde' | 'noche' | null;
    fecha_inicio: string;
    fecha_fin: string | null;
    estado_funcional: number;
    estado: number;
}