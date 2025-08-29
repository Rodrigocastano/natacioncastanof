import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanPagoEntrenador } from '../interfaces/planpagoentrenador'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PlanPagoEntrenadorService {

private apisUrl = environment.apisUrls;
      
      constructor(private http: HttpClient) {}

      generarPagosEntrenadores(): Observable<any> {
        return this.http.post(`${this.apisUrl}/generarPagosEntrenador`, {}); 
      }
    
      getAllPlanPago(): Observable<PlanPagoEntrenador[]> {
        return this.http.get<PlanPagoEntrenador[]>(`${this.apisUrl}/indexPlanPagos`);
      }
    
      createPlanPago(planPago: PlanPagoEntrenador): Observable<any> {
        return this.http.post(`${this.apisUrl}/storePlanPagos`, planPago);
      }

      CancelarPlan(id: number, planPago: any): Observable<any> {
        console.log('Payload enviado sin modificaciones:', JSON.stringify(planPago, null, 2));
        return this.http.put(`${this.apisUrl}/cancelarPlanPagos/${id}`, planPago);
      }

      updatePlanPago(id: number, planPago: any): Observable<any> {
        console.log('Payload enviado sin modificaciones:', JSON.stringify(planPago, null, 2));
        return this.http.put(`${this.apisUrl}/updatePlanPagos/${id}`, planPago);
      }
    
      deletePlanPago(id: number): Observable<any> {
        return this.http.delete(`${this.apisUrl}/destroyPlanPagos/${id}`);
      }
}