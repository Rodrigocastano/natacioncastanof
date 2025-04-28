import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepresentanteNadador } from '../interfaces/representantenadador'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RepresentantenadadorService {

  private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}
 
   getAllRepresentanteNadador(){
     return this.http.get<any>(`${this.apisUrl}/indexTodaRepresentanteNadador`);
   }
 
   createRepresentanteNadador(representanteNadador: RepresentanteNadador): Observable<any> {
     return this.http.post(`${this.apisUrl}/storeRepresentanteNadador`, representanteNadador);
   }
 
   updateRepresentanteNadador(id: number, representanteNadador: RepresentanteNadador){
     return this.http.put(`${this.apisUrl}/updateRepresentanteNadador/${id}`, representanteNadador);
   }
 
   deleteRepresentanteNadador(id: number) {
     return this.http.delete(`${this.apisUrl}/destroyRepresentanteNadador/${id}`);
   }
 
 }
 