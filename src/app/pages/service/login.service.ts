import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
/*   private readonly apiUrl = environment.apiUrl; */
  private apisUrl = environment.apisUrls; 

  private tokenKey = 'logiToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apisUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.autoRefreshToken();
        }
      })
    );
  }

  getPerfilUsuario(): Observable<any> {
    return this.httpClient.get(`${this.apisUrl}/perfil`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.httpClient.post<any>(`${this.apisUrl}/refresh`, { refreshToken }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.autoRefreshToken();
        }
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  autoRefreshToken(): void {
    const token = this.getToken();
    if (!token || token.split('.').length !== 3) return;

    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      if (!exp) return;

      const timeout = exp * 1000 - Date.now() - 60000;
      if (timeout <= 0) return;

      setTimeout(() => {
        this.refreshToken().subscribe({
          next: () => console.log('Token refrescado'),
          error: err => console.error('Error al refrescar token', err)
        });
      }, timeout);
    } catch (e) {
      console.error('Error al decodificar token', e);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  isLogin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }


logout(): void {
  localStorage.clear();
  this.router.navigate(['/landing']);
}





}
