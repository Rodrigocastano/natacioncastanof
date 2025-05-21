import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PruebaTorneo } from '../interfaces/pruebatorneo'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PruebatorneoService {

  private apisUrl = environment.apisUrls; 
  
     constructor(private http: HttpClient) {}
  
    getAllPruebaTorneo(): Observable<PruebaTorneo[]> {
      return this.http.get<PruebaTorneo[]>(`${this.apisUrl}/indexPruebaTorneo`);
    }
  
    createPruebaTorneo(torneo: PruebaTorneo): Observable<any> {
      return this.http.post(`${this.apisUrl}/storePruebaTorneo`, torneo);
    }
  
    updatePruebaTorneo(id: number, torneo: PruebaTorneo): Observable<any> {
      return this.http.put(`${this.apisUrl}/updatePruebaTorneo/${id}`, torneo);
    }
  
    deletePruebaTorneo(id: number): Observable<any> {
      return this.http.delete(`${this.apisUrl}/destroyPruebaTorneo/${id}`);
    }
  
}
