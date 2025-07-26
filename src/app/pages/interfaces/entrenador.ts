export interface Entrenador {
    id: number;
   /*  id_grupo: any; */
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