import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad } from '../interfaces/ciudad'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {

 private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}
 
   getAllCiudad(): Observable<Ciudad[]> {
     return this.http.get<Ciudad[]>(`${this.apisUrl}/indexCiudad`);
   }
 
   createCiudad(ciudad: Ciudad): Observable<any> {
     return this.http.post(`${this.apisUrl}/storeCiudad`, ciudad);
   }
 
   updateCiudad(id: number, ciudad: Ciudad): Observable<any> {
     return this.http.put(`${this.apisUrl}/updateCiudad/${id}`, ciudad);
   }
 
   deleteCiudad(id: number): Observable<any> {
     return this.http.delete(`${this.apisUrl}/destroyCiudad/${id}`);
   }
 
}
