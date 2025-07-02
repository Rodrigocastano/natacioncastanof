/* import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EntrenadorGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const rol = localStorage.getItem('rol');
    if (rol === 'Entrenador') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
 */