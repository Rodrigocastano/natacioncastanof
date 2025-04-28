import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Representante } from '../interfaces/representante'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {

  private apisUrl = environment.apisUrls; 

   constructor(private http: HttpClient) {}

  getAllRepresentante(): Observable<Representante[]> {
    return this.http.get<Representante[]>(`${this.apisUrl}/indexRepresentante`);
  }

  createRepresentante(usuario: Representante): Observable<any> {
    return this.http.post(`${this.apisUrl}/storeRepresentante`, usuario);
  }

  updateRepresentante(id: number, usuario: Representante): Observable<any> {
    return this.http.put(`${this.apisUrl}/updateRepresentante/${id}`, usuario);
  }

  deleteRepresentante(id: number): Observable<any> {
    return this.http.delete(`${this.apisUrl}/destroyRepresentante/${id}`);
  }

}
