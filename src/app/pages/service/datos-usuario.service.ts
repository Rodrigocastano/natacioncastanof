import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}

      obtenerUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apisUrl}/usuarios`);
      }

      obtenerPruebasUsuarios(idUsuario: number): Observable<any> {
        return this.http.get(`${this.apisUrl}/obtenerPruebasPorUsuario/${idUsuario}`);
      }

      obtenerDatoMedicoUsuario(idUsuario: number): Observable<any> {
        return this.http.get(`${this.apisUrl}/obtenerDatoMedicoPorUsuario/${idUsuario}`);
      }

      obtenerDatosPagoUsuario(idUsuario: number): Observable<any> {
        return this.http.get(`${this.apisUrl}/obtenerDatosPago/${idUsuario}`);
      }

      obtenerTiemposPorUsuario(idUsuario: number): Observable<any> {
        return this.http.get(`${this.apisUrl}/obtenerTiemposPorUsuario/${idUsuario}`);
      }

      obtenerMedidasPorUsuario(idUsuario: number): Observable<any> {
        return this.http.get(`${this.apisUrl}/medidasCompletas/${idUsuario}`);
      }

      obtenerTodosLosDatosUsuarios(idUsuario: number): Observable<any> {
        return this.http.get(`${this.apisUrl}/obtenerTodosLosDatosUsuario/${idUsuario}`);
      }
  
}
