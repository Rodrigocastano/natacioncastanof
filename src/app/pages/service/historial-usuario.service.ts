import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistorialUsuario } from '../interfaces/historialusuario'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HistorialUsuarioService {

    private apisUrl = environment.apisUrls; 

    constructor(private http: HttpClient) {}

    getAllRepresentante(): Observable<HistorialUsuario[]> {
      return this.http.get<HistorialUsuario[]>(`${this.apisUrl}/indexRepresentante`);
    }
}
