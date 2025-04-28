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
 
   // Obtener todos los Elasticida
   getAllElasticida(): Observable<Elasticida[]> {
     return this.http.get<Elasticida[]>(`${this.apisUrl}/indexMedidaElasticida`);
   }

     // Obtener todos los Elasticida
     getAllTodoElasticida() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaMedidaElasticida`);
    }
 
   // Obtener un Elasticida por ID
   getElasticidaById(id: number): Observable<Elasticida> {
     return this.http.get<Elasticida>(`${this.apisUrl}/showMedidaElasticida/${id}`);
   }
 
   // Crear un nuevo Elasticida
   createElasticida(elasticida: Elasticida): Observable<any> {
     return this.http.post(`${this.apisUrl}/storeMedidaElasticida`, elasticida);
   }
 
   // Actualizar un Elasticida (requiere PUT y el ID)
   updateElasticida(id: number, elasticida: Elasticida){
     return this.http.put(`${this.apisUrl}/updateMedidaElasticida/${id}`, elasticida);
   }
 
   // Eliminar Elasticida
   deleteElasticida(id: number){
     return this.http.delete(`${this.apisUrl}/destroyMedidaElasticida/${id}`);
   }


 }