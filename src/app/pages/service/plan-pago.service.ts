import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanPago } from '../interfaces/planpago'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PlanPagoService {

   private apisUrl = environment.apisUrls;
      
      constructor(private http: HttpClient) {}
    
      getAllPlanPago(): Observable<PlanPago[]> {
        return this.http.get<PlanPago[]>(`${this.apisUrl}/indexPlanPago`);
      }
    
      createPlanPago(planPago: PlanPago): Observable<any> {
        return this.http.post(`${this.apisUrl}/storePlanPago`, planPago);
      }

      CancelarPlan(id: number, planPago: any): Observable<any> {
        console.log('Payload enviado sin modificaciones:', JSON.stringify(planPago, null, 2));
        return this.http.put(`${this.apisUrl}/cancelarPlanPago/${id}`, planPago);
      }

      updatePlanPago(id: number, planPago: any): Observable<any> {
        console.log('Payload enviado sin modificaciones:', JSON.stringify(planPago, null, 2));
        return this.http.put(`${this.apisUrl}/updatePlanPago/${id}`, planPago);
      }
    
      deletePlanPago(id: number): Observable<any> {
        return this.http.delete(`${this.apisUrl}/destroyPlanPago/${id}`);
      }
}
