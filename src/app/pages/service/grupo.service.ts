import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grupo } from '../interfaces/grupo'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

private apisUrl = environment.apisUrls; 

   constructor(private http: HttpClient) {}

  getAllGrupo(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.apisUrl}/indexGrupo`);
  }

  createGrupo(grupo: Grupo): Observable<any> {
    return this.http.post(`${this.apisUrl}/storeGrupo`, grupo);
  }

  updateGrupo(id: number, grupo: Grupo): Observable<any> {
    return this.http.put(`${this.apisUrl}/updateGrupo/${id}`, grupo);
  }

  deleteGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apisUrl}/destroyGrupo/${id}`);
  }

  getGruposByEntrenador(idGrupo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apisUrl}/getGruposByEntrenado/${idGrupo}`);
  }

}

