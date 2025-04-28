import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoPago } from '../interfaces/estadoPago';
import { TipoPago } from '../interfaces/tipoPagos';
import { Pago } from '../interfaces/pago';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

     getAllTodoPago() {
      return this.http.get<any>(`${this.apisUrl}/indexRegistroPagosPorEstado`);
    }
 
    createPago(pago: Pago): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeRegistroPago`, pago);
    }
 
    updatePago(id: number, pago: Pago) { 
      return this.http.put(`${this.apisUrl}/updateRegistroPago/${id}`, pago);
   }
 
    deletePago(id: number){
      return this.http.delete(`${this.apisUrl}/destroyRegistroPago/${id}`);
    }

    getAllTipoPago(): Observable<TipoPago[]> {
      return this.http.get<TipoPago[]>(`${this.apisUrl}/indexTipoPago`);
    }
    
    getAllEstadoPago(): Observable<EstadoPago[]> {
      return this.http.get<EstadoPago[]>(`${this.apisUrl}/indexEstadoPago`);
    }
      
}