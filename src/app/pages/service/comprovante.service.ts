import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

/* export interface PagoUsuario {
  mes:            string;   // Ej: "2025-01-01" o "TOTAL"
  cantidad_pagos: number;
  total_abonado:  number;
} */

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

@Injectable({ providedIn: 'root' })
export class ComprovanteService {
  private apisUrl = environment.apisUrls;

  constructor(private http: HttpClient) {}

  /** POST /api/reportes/pagos/usuario */
  getPagosPorUsuario(
    fecha_inicio: string,
    fecha_fin: string,
    usuario_id: number
  ): Observable<PagoUsuario[]> {
    const body = { fecha_inicio, fecha_fin, usuario_id };
    return this.http.post<PagoUsuario[]>(`${this.apisUrl}/reportePagoUsuario`, body);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
      return this.http.get<Usuario[]>(`${this.apisUrl}/usuarios`);
  }

}
