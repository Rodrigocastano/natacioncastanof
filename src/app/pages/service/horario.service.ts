import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario } from '../interfaces/horario'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

    private apisUrl = environment.apisUrls; 
    
    constructor(private http: HttpClient) {}
   
    getAllHorario(): Observable<Horario[]> {
      return this.http.get<Horario[]>(`${this.apisUrl}/indexHorario`);
    }
  
    createHorario(horario: Horario): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeHorario`, horario);
    }
  
    updateHorario(id: number, horario: Horario): Observable<any> {
      return this.http.put(`${this.apisUrl}/updateHorario/${id}`, horario);
    }
  
    deleteHorario(id: number): Observable<any> {
      return this.http.delete(`${this.apisUrl}/destroyHorario/${id}`);
    }
   
}
