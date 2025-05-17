import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoPago } from '../interfaces/tipoPagos'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TipopagoService {

   private apisUrl = environment.apisUrls; 
    
       constructor(private http: HttpClient) {}
    
      getAllTipoPago(): Observable<TipoPago[]> {
        return this.http.get<TipoPago[]>(`${this.apisUrl}/indexTipoNado`);
      }
    
      createTipoPago(tipoPago: TipoPago): Observable<any> {
        return this.http.post(`${this.apisUrl}/storeTipoNado`, tipoPago);
      }
    
      updateTipoPago(id: number, tipoPago: TipoPago): Observable<any> {
        return this.http.put(`${this.apisUrl}/updateTipoNado/${id}`, tipoPago);
      }
    
      deleteTipoPago(id: number): Observable<any> {
        return this.http.delete(`${this.apisUrl}/destroyTipoNado/${id}`);
      }
}
