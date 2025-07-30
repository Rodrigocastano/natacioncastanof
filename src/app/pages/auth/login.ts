import { Component } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { LoginService } from '../../pages/service/login.service';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; 
import { BlockUIModule } from 'primeng/blockui'; 
import { DialogModule } from 'primeng/dialog';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule,ButtonModule,BlockUIModule, CheckboxModule, DialogModule, ProgressSpinnerModule, InputTextModule, PasswordModule, ToastModule, FormsModule, RouterModule, RippleModule],
    providers: [MessageService],
    templateUrl: '/login.html'
})
export class Login {
    
  email: string = '';
  password: string = '';
  loading: boolean = false;
  mostrarModalRecuperar: boolean = false;
  emailRecuperar: string = '';


 constructor(
  private loginService: LoginService,
  private router: Router,
  private messageService: MessageService,
  private authService: AuthService,
) {

  const token = localStorage.getItem('token');
  const rol   = localStorage.getItem('rol');

/*   console.log(' Constructor Login → token:', token, 'rol:', rol); */

  if (token && rol) {
    const destino = this.getRedirectRoute(rol);
/*     console.log(' Redirigiendo a', destino); */
    this.router.navigate([destino]);
  }
}




  errorCorreoNoRegistrado() {
  this.messageService.add({ 
    severity: 'error', 
    summary: 'Correo no registrado', 
    detail: 'El correo electrónico no está registrado en el sistema.' 
  });
}

errorContrasenaIncorrecta() {
  this.messageService.add({ 
    severity: 'error', 
    summary: 'Contraseña incorrecta', 
    detail: 'La contraseña ingresada es incorrecta.' 
  });
}

errorGeneralLogin() {
  this.messageService.add({ 
    severity: 'error', 
    summary: 'Error de inicio de sesión', 
    detail: 'El correo electrónico o la contraseña son incorrectos.' 
  });
}

login(): void {
  this.loading = true;
  this.loginService.login(this.email, this.password).subscribe({
    next: (response) => {
      const token = response.token;
      const user = response.user;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rol', user.rol);

        this.router.navigate([this.getRedirectRoute(user.rol)]); 
      } else {
        console.error('Token o usuario no válidos:', response);
        this.errorGeneralLogin();
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Login failed', err);
      
      if (err.status === 401) {
        const mensaje = err.error.message;

        if (mensaje === 'Correo electrónico no registrado') {
          this.errorCorreoNoRegistrado();
        } else if (mensaje === 'Contraseña incorrecta') {
          this.errorContrasenaIncorrecta();
        } else {
          this.errorGeneralLogin();
        }

      } else if (err.status === 403) {
        this.messageService.add({
          severity: 'error',
          summary: 'Acceso denegado',
          detail: 'No tienes permisos para acceder al sistema.'
        });
      } else {
        this.errorGeneralLogin();
      }

      this.loading = false;
    },
  });
}



/* login(): void {
  this.loading = true;
  this.loginService.login(this.email, this.password).subscribe({
    next: (response) => {
      const token = response.token;
      const user = response.user;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rol', user.rol);

        this.router.navigate([this.getRedirectRoute(user.rol)]); 
      } else {
        console.error('Token o usuario no válidos:', response);
        this.errorMessageToast();
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Login failed', err);
      this.errorMessageToast();
      this.loading = false;
    },
  });
} */

recuperarContrasena() {
  if (!this.emailRecuperar || this.emailRecuperar.trim() === '') {
    this.completeMessageToast();
    return;
  }

  this.authService.recuperarContrasena(this.emailRecuperar).subscribe({
    next: (res) => {
      console.log('Respuesta correcta:', res);
      this.saveCorreoMessageToast();
      this.emailRecuperar = ''; 
      this.mostrarModalRecuperar = false; 
    },
    error: (err) => {
      this.errorCorreoMessageToast();
    }
  });
}

    saveCorreoMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Correo enviado correctamente.' });
    }

     errorCorreoMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error el correo no es correcto.' });
    }


    completeMessageToast() {
      this.messageService.add({ severity: 'info', summary: 'Información', detail: 'No se pudieron enviar los datos. Verifique la información e intente nuevamente.', life: 5000});
    }


/* getRedirectRoute(rol: string): string {
  switch (rol.toLowerCase()) {
    case 'usuario':
      return '/pages/graficasUsuario';
    case 'administrador':
    case 'entrenador':
      return '/dashboard';
    default:
      return '/auth/login';
  }
} */
getRedirectRoute(rol: string): string {
  switch (rol.toLowerCase()) {
    case 'usuario':
      return '/pages/graficasUsuario';
    case 'administrador':
    case 'entrenador':
      return '/dashboard';
    case 'psicologo':
      return '/pages/psicologo';
    case 'medico':
      return '/pages/medico';
    default:
      return '/auth/login';
  }
}


}