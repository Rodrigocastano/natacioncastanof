import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Antropometrica } from '../interfaces/antropometrica';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AntropometricaService {

  private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}
 
     getAllTodoAntropometrica() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaMedidaAntropometrica`);
    }
 
   createAntropometrica(antropometrica: Antropometrica): Observable<any> {
     return this.http.post(`${this.apisUrl}/storeMedidaAntropometrica`, antropometrica);
   }
 
   updateAntropometrica(id: number, elasticida: Antropometrica){
     return this.http.put(`${this.apisUrl}/updateMedidaAntropometrica/${id}`, elasticida);
   }
 
   deleteAntropometrica(id: number){
     return this.http.delete(`${this.apisUrl}/destroyMedidaAntropometrica/${id}`);
   }


 }