import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialEntrenador } from '../interfaces/historial-entrenador'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EntrenadorgrupoService {

   private apisUrl = environment.apisUrls; 

    constructor(private http: HttpClient) {}

    getAllEntrenadorGrupos(): Observable<HistorialEntrenador[]> {
      return this.http.get<HistorialEntrenador[]>(`${this.apisUrl}/indexEntrenadorGrupo`);
    }

    createEntrenadorGrupos(historialUsuario: HistorialEntrenador): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeEntrenadorGrupo`, historialUsuario);
    }

    updateEntrenadorGrupos(id: number, historialUsuario: any): Observable<any> {
      return this.http.put(`${this.apisUrl}/updateEntrenadorGrupo/${id}`, historialUsuario);
    }

    destroyEntrenadorGrupo(id: number): Observable<any> {
      return this.http.delete(`${this.apisUrl}/destroyEntrenadorGrupo/${id}`);
    }

    verEntrenadoresUsuario(entrenadorId: number): Observable<any> {
      return this.http.get(`${this.apisUrl}/entrenadores/${entrenadorId}`);
    }


}
