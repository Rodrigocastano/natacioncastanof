import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AreaNado } from '../interfaces/areanado'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AreanadoService {

 private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}
 
   getAllAreaNado(): Observable<AreaNado[]> {
     return this.http.get<AreaNado[]>(`${this.apisUrl}/indexAreaNado`);
   }
 
   createAreaNado(areaNado: AreaNado): Observable<any> {
     return this.http.post(`${this.apisUrl}/storeAreaNado`, areaNado);
   }
 
   updateAreaNado(id: number, areaNado: AreaNado): Observable<any> {
     return this.http.put(`${this.apisUrl}/updateAreaNado/${id}`, areaNado);
   }
 
   deleteAreaNado(id: number): Observable<any> {
     return this.http.delete(`${this.apisUrl}/destroyAreaNado/${id}`);
   }
   
}
