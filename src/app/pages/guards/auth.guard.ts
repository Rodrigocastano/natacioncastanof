import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol')?.toLowerCase() || '';
    const url = state.url.toLowerCase();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (rol === 'usuario' && url.startsWith('/dashboard')) {
      this.router.navigate(['/pages/graficasUsuario']);
      return false;
    }

    if ((rol === 'administrador' || rol === 'entrenador') &&
        (url.includes('graficasusuario') || url.includes('asistenciausuario') ||
         url.includes('elasticidadusuario') || url.includes('nutricionalusuario') ||
         url.includes('antropometricausuario'))) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}