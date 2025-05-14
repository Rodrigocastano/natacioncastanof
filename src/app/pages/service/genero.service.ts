import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genero } from '../interfaces/genero'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

   private apisUrl = environment.apisUrls; 
   
      constructor(private http: HttpClient) {}
   
     getAllGenero(): Observable<Genero[]> {
       return this.http.get<Genero[]>(`${this.apisUrl}/indexGenero`);
     }
   
     createGenero(genero: Genero): Observable<any> {
       return this.http.post(`${this.apisUrl}/storeGenero`, genero);
     }
   
     updateGenero(id: number, genero: Genero): Observable<any> {
       return this.http.put(`${this.apisUrl}/updateGenero/${id}`, genero);
     }
   
     deleteGenero(id: number): Observable<any> {
       return this.http.delete(`${this.apisUrl}/destroyGenero/${id}`);
     }
   
}
