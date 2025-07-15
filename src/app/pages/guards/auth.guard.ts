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

    // Evita que el usuario acceda al dashboard
    if (rol === 'usuario' && url.startsWith('/dashboard')) {
      this.router.navigate(['/pages/graficasUsuario']);
      return false;
    }

    // Evita que admin o entrenador accedan a rutas de usuarios
    if ((rol === 'administrador' || rol === 'entrenador') &&
        (url.includes('graficasusuario') || url.includes('asistenciausuario') ||
         url.includes('medidausuario') || url.includes('nutricionalusuario') ||
         url.includes('antropometricausuario'))) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    // Evita que medico acceda a rutas que no son para él
    if (rol === 'medico' && !url.includes('/pages/medico') && !url.includes('/dashboard')) {
      this.router.navigate(['/pages/medico']);
      return false;
    }

    // Evita que psicologo acceda a rutas que no son para él
    if (rol === 'psicologo' && !url.includes('/pages/psicologo') && !url.includes('/dashboard')) {
      this.router.navigate(['/pages/psicologo']);
      return false;
    }

    return true;
  }
}

