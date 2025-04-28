import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nutricionales } from '../interfaces/nutricionales';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class NutricionaleService {

    private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}

    getAllTodoNutricionale() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaMedidaNutricionale`);
    }
 
   createNutricionale(elasticida: Nutricionales): Observable<any> {
     return this.http.post(`${this.apisUrl}/storeMedidaNutricionale`, elasticida);
   }
 
   updateNutricionale(id: number, elasticida: Nutricionales){
     return this.http.put(`${this.apisUrl}/updateMedidaNutricionale/${id}`, elasticida);
   }
 
   deleteNutricionale(id: number){
     return this.http.delete(`${this.apisUrl}/destroyMedidaNutricionale/${id}`);
   }

}
