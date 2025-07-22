import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TiempoNadador } from '../interfaces/tiemponadador';
import { environment } from '../../../environments/environments';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
}
export interface TiempoNado {
  x: string;
  y: number;
  distancia: string;
  tiempo_formateado: string;
  fecha_formateada: string;
}

export interface SerieNado {
  tipo_nado_id: number;
  name: string;
  data: TiempoNado[];
}


export interface DatosUsuario {
  success: boolean;
  usuario: string;
  series: SerieNado[];
}


@Injectable({
  providedIn: 'root'
})
export class TiemponadadorService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerMisTiempos(): Observable<DatosUsuario> {
    const headers = this.getAuthHeaders();
    return this.http.get<DatosUsuario>(`${this.apisUrl}/miTiempos`, { headers });
  }


     getAllTodoTiemposNado() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaTiemposNado`);
    }
 
    createTiemposNado(tiempoNadador: TiempoNadador): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeTiemposNado`, tiempoNadador);
    }
 
    updateTiemposNado(id: number, tiempoNadador: TiempoNadador){
      return this.http.put(`${this.apisUrl}/updateTiemposNado/${id}`, tiempoNadador);
    }
 
    deleteTiemposNado(id: number){
      return this.http.delete(`${this.apisUrl}/destroyTiemposNado/${id}`);
    }

    getGraficaByGrupo(idGrupo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apisUrl}/obtenerTiemposPorUsuario/${idGrupo}`);
  }

    obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apisUrl}/usuarios`);

}



}