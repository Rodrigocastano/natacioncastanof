export interface Antropometrica {
    id: number;
    id_usuario: any;
    fecha: string;
    peso: number;
    talla: number;
    envergadura: number;
    circuferencia_braquial: number;
    pliegue_cutanio: number;
    perimetro_cintura: number;
    perimetro_cadera: number;
    diametro_sagital: number;
    estado?: boolean;
    nombre?: string;
    apellido?: string;
    cedula?: string;
  }