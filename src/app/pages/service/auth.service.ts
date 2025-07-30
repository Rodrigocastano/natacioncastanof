import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apisUrl = environment.apisUrls;

  constructor(private http: HttpClient) {}

  cambiarContrasena(data: { 
      current_password: string; 
      new_password: string; 
      new_password_confirmation: string 
    }): Observable<any> {
      const token = localStorage.getItem('token'); // <-- Aquí obtenemos el token

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,  // <-- Lo enviamos en el header
        'Accept': 'application/json'
      });

      return this.http.post(`${this.apisUrl}/cambiarContrasena`, data, { headers });
    }

 /*    recuperarContrasena(email: string): Observable<any> {
      const headers = new HttpHeaders({
        'Accept': 'application/json'
      });

      const data = {
        email: email
      };

      return this.http.post(`${this.apisUrl}/recuperar-contrasena`, data, { headers });
    } */

      recuperarContrasena(email: string): Observable<any> {
        return this.http.post(`${this.apisUrl}/recuperar-contrasena`, { email });
      }


}
