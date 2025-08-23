import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbonoEntrenador } from '../interfaces/abonoentrenador';
import { environment } from '../../../environments/environments';
import { pagoEntrenadores } from '../interfaces/pagoentrenadores';

@Injectable({
  providedIn: 'root'
})
export class AbonoentrenadorService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

     getAllAbonoEntrenador() {
      return this.http.get<any>(`${this.apisUrl}/indexAbonoEntrenador`);
    }

/*     getAllRegistroPago() {
      return this.http.get<any>(`${this.apisUrl}/indexRegistroEntrenador`);
    } */

/*     getAllAbonoPagos() {
      return this.http.get<any>(`${this.apisUrl}/indexRegistroPago`);
    } */

        getAllAbonoPagos(): Observable<pagoEntrenadores[]> {
          return this.http.get<pagoEntrenadores[]>(`${this.apisUrl}/indexRegistroPago`);
        }

                getAllAbonoPendiente(): Observable<pagoEntrenadores[]> {
          return this.http.get<pagoEntrenadores[]>(`${this.apisUrl}/indexRegistrosPendiente`);
        }

/*     getAllAbonoPendiente() {
      return this.http.get<any>(`${this.apisUrl}/indexRegistrosPendiente`);
    } */
 
    createAbonoEntrenador(abonoPago: AbonoEntrenador): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeAbonoEntrenador`, abonoPago);
    }
 
    updateAbonoEntrenador(id: number, abonoPago: AbonoEntrenador) { 
      return this.http.put(`${this.apisUrl}/updateAbonoEntrenador/${id}`, abonoPago);
   }
 
    deleteAbonoEntrenador(id: number){
      return this.http.delete(`${this.apisUrl}/destroyAbonoEntrenador/${id}`);
    }
}
