import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
    imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule
  ],
  providers: [MessageService]
})
export class CambiarContrasenaComponent implements OnInit {
  passwordForm: FormGroup;
  displayModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password_confirmation: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.displayModal = true;  // <-- Se abre automáticamente al cargar
  }

  cambiarContrasena() {
    if (this.passwordForm.invalid) {
      this.completeMessageToast();
      return;
    }

    this.authService.cambiarContrasena(this.passwordForm.value).subscribe({
      next: (res) => {
       this.saveMessageToast();
        this.displayModal = false;
        this.passwordForm.reset();
      },
      error: (err) => {
        this.errorMessageToast();
      }
    });
  }

    saveMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Contraseña cambiada correctamente.' });
    }
     errorMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cambiar la contraseña.' });
    }

    completeMessageToast() {
      this.messageService.add({ severity: 'info', summary: 'Información', detail: 'No se pudieron enviar los datos. Verifique la información e intente nuevamente.', life: 5000});
    }
}