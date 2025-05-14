export interface Usuario {
    id: number;
    id_ciudad: any;
    id_genero: any;
    id_grupo: any;
    id_rol: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    direccion: string;
    edad: number;
    fechaNacimiento: string;
    fechaInscripcion: string;
    estado?: boolean;
   
}