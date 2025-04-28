import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrenador } from '../interfaces/entrenador'; 
import { Grupo } from '../interfaces/grupo'; 
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EntrenadorService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient, private router: Router) {}

  getAllEntrenadore(): Observable<Entrenador[]> {
    return this.http.get<Entrenador[]>(`${this.apisUrl}/indexEntrenadore`);
  }
  
  createEntrenadore(entrenador: Entrenador): Observable<any> {
    return this.http.post(`${this.apisUrl}/storeEntrenadore`, entrenador);
  }

  updateEntrenadore(id: number, usuario: Entrenador): Observable<any> {
    return this.http.put(`${this.apisUrl}/updateEntrenadore/${id}`, usuario);
  }

  deleteEntrenadore(id: number): Observable<any> {
    return this.http.delete(`${this.apisUrl}/destroyEntrenadore/${id}`);
  }

  getAllGrupo(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.apisUrl}/indexGrupo`);
  }

}
