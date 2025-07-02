/* import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {

  constructor(private router: Router) {}

 canActivate(): boolean {
  const rol = localStorage.getItem('rol');
  if (rol?.toLowerCase() === 'Usuario') {
    return true;
  }

  this.router.navigate(['/login']);
  return false;
}

}
 */