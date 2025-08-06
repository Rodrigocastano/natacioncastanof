export interface Medico {
    id: number;
    id_usuario: any;
    fecha?: string;
    diagnostico: string;
    apto: number;
    estado?: boolean;
    nombre?: string;
    apellido?: string
    cedula?: string
}

export interface registroMedicos {
    id: number;
    id_rol: number;
    id_ciudad: any;
    id_genero: any;
    nombre: string;
    apellido: string;
    email: string
    password?:string
    cedula: string;
    telefono: string;
    direccion: string;
    edad?: number;
    fechaNacimiento: string;
    fechaInscripcion?: string;
    estado?: boolean;
   
}