// src/app/services/reportes.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface IngresoMensual {
  mes: string;            // "2025-01-01"
  cantidad_pagos: number; // 1
  total_abonado: number;  // 25
}

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private apiUrl = environment.apisUrls;

  constructor(private http: HttpClient) {}

  /** POST /ReporteDePago → array de IngresoMensual */
  getIngresosMensuales(inicio: string, fin: string): Observable<IngresoMensual[]> {
    const body = { fecha_inicio: inicio, fecha_fin: fin };
    return this.http.post<IngresoMensual[]>(`${this.apiUrl}/ReporteDePago`, body);
  }
}
