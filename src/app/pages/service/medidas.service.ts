import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {

    private apisUrl = environment.apisUrls; 
   
      constructor(private http: HttpClient) {}
  
          private headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        Accept: 'application/json'
      });


    getMisMedidasElasticidad(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/misMedidasElasticidad`, { headers: this.headers });
    }
  
    getMisMedidasNutricionales(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/misMedidasNutricionale`, { headers: this.headers });
    }
  
    getMisMedidasAntropometricas(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/misMedidasAntropometrica`, { headers: this.headers });
    }
}
