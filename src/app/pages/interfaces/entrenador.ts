export interface Grupo { 
    nombre: string;
}

export interface Entrenador {
    id: number;
    id_grupo: any;
    id_rol: number;
    nombre: string;
    apellido: string;
    email: string
    password:string
    cedula: string;
    ciudad: string;
    telefono: string;
    direccion: string;
    genero: string;
    edad: number;
    fechaNacimiento: string;
    fechaInscripcion: string;
    estado?: boolean;
   
}