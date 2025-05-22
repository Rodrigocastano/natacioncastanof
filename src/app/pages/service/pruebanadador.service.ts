import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PruebaNadador } from '../interfaces/pruebanadador';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PruebanadadorService {

  private apisUrl = environment.apisUrls; 
  
    constructor(private http: HttpClient) {}
  
       getAllTodoPruebaNadador() {
        return this.http.get<any>(`${this.apisUrl}/indexPruebaNadador`);
      }
   
      createPruebaNadador(pruebaNadador: PruebaNadador): Observable<any> {
        return this.http.post(`${this.apisUrl}/storePruebaNadador`, pruebaNadador);
      }
   
      updatePruebaNadador(id: number, pruebaNadador: PruebaNadador){
        return this.http.put(`${this.apisUrl}/updatePruebaNadador/${id}`, pruebaNadador);
      }
   
      deletePruebaNadador(id: number){
        return this.http.delete(`${this.apisUrl}/destroyPruebaNadador/${id}`);
      }
}
