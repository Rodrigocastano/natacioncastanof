export interface HistorialUsuario {
    id: number;
    id_usuario: number;
    nombre: string;
    apellido: string;
    cedula: string;
    id_grupo: number;
    turno: 'mañana' | 'tarde' | 'noche' | null;
    grupo: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    estado_funcional: number;
    estado: number;
}