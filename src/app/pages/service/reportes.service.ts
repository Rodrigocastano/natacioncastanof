// src/app/services/reportes.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface IngresoMensual {
  mes: string;
  cantidad_pagos: number;
  total_pagado: number;
  total_abonado: number;
  total_pendiente: number;
}

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private apiUrl = environment.apisUrls;

  constructor(private http: HttpClient) {}

  getIngresosMensuales(inicio: string, fin: string): Observable<IngresoMensual[]> {
    const body = { fecha_inicio: inicio, fecha_fin: fin };
    return this.http.post<IngresoMensual[]>(`${this.apiUrl}/ReporteDePago`, body);
  }
}
