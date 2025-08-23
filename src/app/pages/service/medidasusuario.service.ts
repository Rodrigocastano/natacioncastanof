import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MedidasusuarioService {

    private apisUrl = environment.apisUrls; 
   
      constructor(private http: HttpClient) {}
  
          private headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        Accept: 'application/json'
      });


    getMisDatosMedico(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/obtenerMisDatosMedico`, { headers: this.headers });
    }

    getMisDatosPsicologo(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/obtenerMisDatosPsicologo`, { headers: this.headers });
    }

    getMisDatosCompetencias(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/obtenerPruebasUsuario`, { headers: this.headers });
    }

    obtenerMisPagos(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/obtenerMisPago`, { headers: this.headers });
    }
    
}
