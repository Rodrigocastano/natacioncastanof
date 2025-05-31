import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbonoPago } from '../interfaces/abonopago';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AbonopagoService {


  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

     getAllAbonoPago() {
      return this.http.get<any>(`${this.apisUrl}/indexAbonoPago`);
    }
 
    createAbonoPago(abonoPago: AbonoPago): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeAbonoPago`, abonoPago);
    }
 
    updateAbonoPago(id: number, abonoPago: AbonoPago) { 
      return this.http.put(`${this.apisUrl}/updateAbonoPago/${id}`, abonoPago);
   }
 
    deleteAbonoPago(id: number){
      return this.http.delete(`${this.apisUrl}/destroyAbonoPago/${id}`);
    }
}
