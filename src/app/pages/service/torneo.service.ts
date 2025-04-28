import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Torneo } from '../interfaces/torneo'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {

private apisUrl = environment.apisUrls; 

   constructor(private http: HttpClient) {}

  getAllTorneo(): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(`${this.apisUrl}/indexTorneo`);
  }

  createTorneo(torneo: Torneo): Observable<any> {
    return this.http.post(`${this.apisUrl}/storeTorneo`, torneo);
  }

  updateTorneo(id: number, torneo: Torneo): Observable<any> {
    return this.http.put(`${this.apisUrl}/updateTorneo/${id}`, torneo);
  }

  deleteTorneo(id: number): Observable<any> {
    return this.http.delete(`${this.apisUrl}/destroyTorneo/${id}`);
  }

}
