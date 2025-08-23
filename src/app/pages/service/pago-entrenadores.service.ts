import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pagoEntrenadores } from '../interfaces/pagoentrenadores'; 
import { environment } from '../../../environments/environments';
import { EstadoPago } from '../interfaces/estadoPago';
import { Entrenador } from '../interfaces/entrenador'; 

export interface IngresoMensual {
  mes: string;
  cantidad_pagos: number;
  total_pagado: number;
  total_abonado: number;
  total_pendiente: number;
}


export interface PagoUsuario {
  mes:              string;   // "2025‑06", "TOTAL"
  cantidad_pagos:   number;
  total_monto:      number;
  total_abonado:    number;
  total_pendiente:  number;
}


interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  nombre_completo: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagoEntrenadoresService {

   private apisUrl = environment.apisUrls;
        
        constructor(private http: HttpClient) {}

        getAllPagoEntrenadore() {
          return this.http.get<any>(`${this.apisUrl}/indexPagoEntrenadore`);
        }

    getPlanPorEntrenador(idUsuario: number) {
      return this.http.get<any>(`${this.apisUrl}/planes-entrenador/${idUsuario}`);
    }
 
  
        createPagoEntrenadore(pago: pagoEntrenadores): Observable<any> {
          return this.http.post(`${this.apisUrl}/storePagoEntrenadore`, pago);
        }
    
        updatePagoEntrenadore(id: number, pago: pagoEntrenadores) { 
          return this.http.put(`${this.apisUrl}/updatePagoEntrenadore/${id}`, pago);
      }
      
        deletePlanPagoEntrenadore(id: number): Observable<any> {
          return this.http.delete(`${this.apisUrl}/destroyPagoEntrenadore/${id}`);
        }

            getAllEstadoPago(): Observable<EstadoPago[]> {
              return this.http.get<EstadoPago[]>(`${this.apisUrl}/indexEstadoPago`);
            }

              getAllEntrenadore(): Observable<Entrenador[]> {
                return this.http.get<Entrenador[]>(`${this.apisUrl}/indexEntrenadore`);
              }

                getIngresosMensualesEntrenadores(inicio: string, fin: string): Observable<IngresoMensual[]> {
                  const body = { fecha_inicio: inicio, fecha_fin: fin };
                  return this.http.post<IngresoMensual[]>(`${this.apisUrl}/ReporteDePagosEntrenadore`, body);
                }

                  getPagosPorEntrenador(
                    fecha_inicio: string,
                    fecha_fin: string,
                    usuario_id: number
                  ): Observable<PagoUsuario[]> {
                    const body = { fecha_inicio, fecha_fin, usuario_id };
                    return this.http.post<PagoUsuario[]>(`${this.apisUrl}/reportePagosEntrenado`, body);
                  }

                    obtenerUsuarios(): Observable<Usuario[]> {
                        return this.http.get<Usuario[]>(`${this.apisUrl}/indexEntrenadore`);
                    }
}
