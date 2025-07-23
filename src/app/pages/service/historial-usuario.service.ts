import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialUsuario } from '../interfaces/historialusuario'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HistorialUsuarioService {

    private apisUrl = environment.apisUrls; 

    constructor(private http: HttpClient) {}

    getAllUsuarioGrupo(): Observable<HistorialUsuario[]> {
      return this.http.get<HistorialUsuario[]>(`${this.apisUrl}/indexHistorialUsuario`);
    }

    createUsuarioGrupos(historialUsuario: HistorialUsuario): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeUsuarioGrupo`, historialUsuario);
    }

    updateUsuarioGrupos(id: number, historialUsuario: any): Observable<any> {
      return this.http.put(`${this.apisUrl}/updateUsuarioGrupo/${id}`, historialUsuario);
    }

    destroyUsuarioGrupo(id: number): Observable<any> {
      return this.http.delete(`${this.apisUrl}/destroyUsuarioGrupos/${id}`);
    }

    cancelarMatricula(id: number): Observable<any> {
      return this.http.put(`${this.apisUrl}/cancelarMatricula/${id}`, {});
    }


}
