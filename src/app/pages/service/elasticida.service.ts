import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Elasticida } from '../interfaces/elasticida';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ElasticidaService {

  private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}
 
   getAllElasticida(): Observable<Elasticida[]> {
     return this.http.get<Elasticida[]>(`${this.apisUrl}/indexMedidaElasticida`);
   }

     getAllTodoElasticida() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaMedidaElasticida`);
    }
 
   getElasticidaById(id: number): Observable<Elasticida> {
     return this.http.get<Elasticida>(`${this.apisUrl}/showMedidaElasticida/${id}`);
   }
 
   createElasticida(elasticida: Elasticida): Observable<any> {
     return this.http.post(`${this.apisUrl}/storeMedidaElasticida`, elasticida);
   }
 
   updateElasticida(id: number, elasticida: Elasticida){
     return this.http.put(`${this.apisUrl}/updateMedidaElasticida/${id}`, elasticida);
   }
 
   deleteElasticida(id: number){
     return this.http.delete(`${this.apisUrl}/destroyMedidaElasticida/${id}`);
   }


 }