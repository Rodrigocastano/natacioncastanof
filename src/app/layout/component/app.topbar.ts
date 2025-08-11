import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { DialogModule } from 'primeng/dialog';
import { LayoutService } from '../service/layout.service';
import { LoginService } from '../../pages/service/login.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../pages/service/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule, 
        CommonModule, 
        StyleClassModule, 
        DialogModule, 
        ButtonModule,
        ToastModule, 
        ConfirmPopupModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [ConfirmationService, MessageService],
    template: ` 
    <div class="layout-topbar">
        <div class="layout-topbar flex items-center w-full px-4 py-2">

            <div class="layout-topbar-logo-container flex items-center gap-2">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo font-bold text-lg">
                    <span style="white-space: nowrap;">NATACIÓN CASTAÑO</span>
                </a>
            </div>

            <div class="flex-grow"></div>

            <div class="layout-config-menu flex items-center gap-4">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{
                        'pi': true,
                        'pi-moon': layoutService.isDarkTheme(),
                        'pi-sun': !layoutService.isDarkTheme()
                    }"></i>
                </button>

                <button type="button" class="layout-topbar-action" (click)="abrirMenuPerfil()">
                    <i class="pi pi-user"></i>
                    <span class="hidden lg:inline">Profile</span>
                </button>
            </div>

            <p-confirmpopup />
            <p-toast />

            <!-- Menú de perfil -->
            <p-dialog 
                [(visible)]="menuPerfilVisible" 
                [modal]="true" 
                [dismissableMask]="true" 
                [draggable]="false" 
                [resizable]="false" 
                header="Opciones" 
                closable="true"
                [style]="{ width: '265px', position: 'fixed', top: '1rem', right: '1rem', borderRadius: '1rem' }"
                [contentStyle]="{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }">
                
                <a style="cursor: pointer;" (click)="mostrarPerfil()">
                    <i class="pi pi-user mr-3"></i> Ver Perfil
                </a>
                
                <a style="cursor: pointer;" (click)="mostrarFormularioCambioContrasena()">
                    <i class="pi pi-key mr-3"></i> Cambiar Contraseña
                </a>
                
                <a style="cursor: pointer; color: red;" (click)="abrirDialogCerrarSesion()">
                    <i class="pi pi-sign-out mr-3"></i> Cerrar Sesión
                </a>

            </p-dialog>

            <!-- Modal de perfil -->
            <p-dialog 
                [(visible)]="dialogPerfilVisible" 
                [modal]="true" 
                [dismissableMask]="true" 
                [draggable]="false" 
                [resizable]="false" 
                header="Perfil de usuario" 
                closable="true"
                [style]="{ width: '265px', position: 'fixed', top: '4rem', right: '1rem', borderRadius: '1rem' }">
                <div *ngIf="perfilUsuario" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Nombre:</strong>
                        <span>{{ perfilUsuario.nombre }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Apellido:</strong>
                        <span>{{ perfilUsuario.apellido }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Cédula:</strong>
                        <span>{{ perfilUsuario.cedula }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Rol:</strong>
                        <span>{{ perfilUsuario.rol }}</span>
                    </div>
                </div>
            </p-dialog>

            <!-- Modal para cambiar contraseña -->
            <p-dialog 
                header="Cambiar Contraseña" 
                [(visible)]="displayModal" 
                [modal]="true" 
                [style]="{ width: '265px', position: 'fixed', top: '4rem', right: '1rem', borderRadius: '1rem' }"
                [breakpoints]="{'960px': '90vw'}"
                [closable]="true"
                [dismissableMask]="true"
                class="surface-card shadow-2 border-round">

                <form [formGroup]="passwordForm" (ngSubmit)="cambiarContrasena()" class="p-fluid p-formgrid p-grid p-4">
                    
                    <div class="p-field p-col-12">
                        <label for="current_password" class="font-semibold text-900 mb-2 block">Contraseña Actual</label>
                        <p-password
                            id="current_password"
                            formControlName="current_password"
                            [toggleMask]="true"
                            feedback="false"
                            promptLabel="Ingrese su contraseña actual"
                            class="w-full border-round">
                        </p-password>
                    </div>

                    <div class="p-field p-col-12 mt-3">
                        <label for="new_password" class="font-semibold text-900 mb-2 block">Nueva Contraseña</label>
                        <p-password
                            id="new_password"
                            formControlName="new_password"
                            [toggleMask]="true"
                            feedback="true"
                            promptLabel="Ingrese su nueva contraseña"
                            class="w-full border-round">
                        </p-password>
                    </div>

                    <div class="p-field p-col-12 mt-3">
                        <label for="new_password_confirmation" class="font-semibold text-900 mb-2 block">Confirmar Nueva Contraseña</label>
                        <p-password
                            id="new_password_confirmation"
                            formControlName="new_password_confirmation"
                            [toggleMask]="true"
                            feedback="false"
                            promptLabel="Confirme su nueva contraseña"
                            class="w-full border-round">
                        </p-password>
                    </div>

                    <div class="p-col-12 flex justify-content-end mt-5 gap-3">
                        <p-button label="Cancelar" icon="pi pi-times" class="p-button-secondary" (onClick)="displayModal=false"></p-button>
                        <p-button label="Guardar" icon="pi pi-check" type="submit" class="p-button-primary"></p-button>
                    </div>
                </form>
            </p-dialog>

            <!-- Modal para confirmar cierre de sesión -->
            <p-dialog 
                header="Confirmar cierre de sesión"
                [(visible)]="mostrarDialogCerrarSesion"
                [modal]="true"
                [dismissableMask]="true"
                [draggable]="false"
                [resizable]="false"
                closable="true"
                [style]="{ width: '310px', position: 'fixed', top: '4rem', right: '1rem', borderRadius: '1rem' }"
                [contentStyle]="{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }"
                (onHide)="mostrarDialogCerrarSesion = false">

                <p>¿Estás seguro de que deseas cerrar sesión?</p>

                <div class="flex justify-content-end gap-3 mt-0">
                    <button pButton label="No" icon="pi pi-times" class="p-button-secondary" (click)="mostrarDialogCerrarSesion=false"></button>
                    <button pButton label="Sí" icon="pi pi-check" class="p-button-danger" (click)="cerrarSesion()"></button>
                </div>
            </p-dialog>

        </div>
    </div>`
})
export class AppTopbar implements OnInit  {
    menuPerfilVisible = false;
    dialogPerfilVisible = false;
    perfilUsuario: any = null;
    passwordForm: FormGroup;
    displayModal: boolean = false;
    mostrarDialogCerrarSesion: boolean = false;

    constructor(
        public layoutService: LayoutService, 
        private loginService: LoginService, 
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private authService: AuthService,
    ) {
        this.passwordForm = this.fb.group({
            current_password: ['', Validators.required],
            new_password: ['', [Validators.required, Validators.minLength(8)]],
            new_password_confirmation: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.cargarPerfilUsuario();
    }

    cargarPerfilUsuario() {
        const userString = localStorage.getItem('user');
        if (userString) {
            this.perfilUsuario = JSON.parse(userString);
        }
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    abrirMenuPerfil() {
        this.menuPerfilVisible = true;
    }

    mostrarPerfil() {
        this.menuPerfilVisible = false;
        this.dialogPerfilVisible = true;
    }

    mostrarFormularioCambioContrasena() {
        this.menuPerfilVisible = false;
        this.passwordForm.reset();
        this.displayModal = true; // abre el modal correcto
    }

    abrirDialogCerrarSesion() {
        this.menuPerfilVisible = false;
        this.mostrarDialogCerrarSesion = true;
    }


    cerrarSesion() {
    console.log('cerrarSesion() llamado');
    this.mostrarDialogCerrarSesion = false;
    this.loginService.logout();
}


    cambiarContrasena() {
        if (this.passwordForm.invalid) {
            this.completeMessageToast();
            return;
        }

        this.authService.cambiarContrasena(this.passwordForm.value).subscribe({
            next: () => {
                this.saveMessageToast();
                this.displayModal = false;
                this.passwordForm.reset();
            },
            error: () => {
                this.errorMessageToast();
            }
        });
    }

    saveMessageToast() {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña cambiada correctamente.' });
    }
    
    errorMessageToast() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cambiar la contraseña.' });
    }

    completeMessageToast() {
        this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Verifique la información e intente nuevamente.', life: 5000});
    }
}
