import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { LoginService } from '../../pages/service/login.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ToastModule, FormsModule, RouterModule, RippleModule],
    providers: [MessageService],
    templateUrl: '/login.html'
})
export class Login {
    
  email: string = '';
  password: string = '';

 constructor(
  private loginService: LoginService,
  private router: Router,
  private messageService: MessageService
) {
  const token = localStorage.getItem('token');
  const rol   = localStorage.getItem('rol');

  console.log('🟡 Constructor Login → token:', token, 'rol:', rol);

  if (token && rol) {
    const destino = this.getRedirectRoute(rol);
    console.log('🟡 Redirigiendo a', destino);
    this.router.navigate([destino]);
  }
}



  errorMessageToast() {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Error de inicio de sesión', 
      detail: 'El correo electrónico o la contraseña son incorrectos.' 
    });
  }

  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Logueado correctamente' });
  }


login(): void {
  this.loginService.login(this.email, this.password).subscribe({
    next: (response) => {
      const token = response.token;
      const user = response.user;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rol', user.rol);

        this.saveMessageToast();
        this.router.navigate([this.getRedirectRoute(user.rol)]); 
      } else {
        console.error('Token o usuario no válidos:', response);
        this.errorMessageToast();
      }
    },
    error: (err) => {
      console.error('Login failed', err);
      this.errorMessageToast();
    },
  });
}

getRedirectRoute(rol: string): string {
  switch (rol.toLowerCase()) {
    case 'usuario':
      return '/pages/graficasUsuario';
    case 'administrador':
    case 'entrenador':
      return '/dashboard';
    default:
      return '/auth/login';
  }
}


  

}
