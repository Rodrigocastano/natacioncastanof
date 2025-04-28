import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario'; 
import { Grupo } from '../interfaces/grupo'; 
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient, private router: Router) {}

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apisUrl}/indexUsuario`);
  }

  createUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apisUrl}/storeUsuario`, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apisUrl}/updateUsuario/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apisUrl}/destroyUsuario/${id}`);
  }

  getAllGrupo(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${this.apisUrl}/indexGrupo`);
  }

}