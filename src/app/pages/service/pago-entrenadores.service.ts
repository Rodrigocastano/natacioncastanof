import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pagoEntrenadores } from '../interfaces/pagoentrenadores'; 
import { environment } from '../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class PagoEntrenadoresService {

   private apisUrl = environment.apisUrls;
        
        constructor(private http: HttpClient) {}

        getAllPagoEntrenadore() {
          return this.http.get<any>(`${this.apisUrl}/indexPagoEntrenadore`);
        }
  
        createPagoEntrenadore(pago: pagoEntrenadores): Observable<any> {
          return this.http.post(`${this.apisUrl}/storePagoEntrenadore`, pago);
        }
    
        updatePagoEntrenadore(id: number, pago: pagoEntrenadores) { 
          return this.http.put(`${this.apisUrl}/updatePagoEntrenadore/${id}`, pago);
      }
      
        deletePlanPagoEntrenadore(id: number): Observable<any> {
          return this.http.delete(`${this.apisUrl}/destroyPlanPago/${id}`);
        }
}
