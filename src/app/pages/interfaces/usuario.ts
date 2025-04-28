export interface Grupo { 
    nombre: string;
}

export interface Usuario {
    id: number;
    id_grupo: any;
    id_rol: number;
    nombre: string;
    apellido: string;
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