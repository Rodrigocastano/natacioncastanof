import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { DialogModule } from 'primeng/dialog';
import { LayoutService } from '../service/layout.service';
import { LoginService } from '../../pages/service/login.service';
import { ButtonModule } from 'primeng/button';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, DialogModule, ButtonModule,ToastModule, ConfirmPopupModule ],
    providers: [ConfirmationService, MessageService],
    template: ` 
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo">
                <span style="white-space: nowrap;">NATACIÓN CASTAÑO</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
             
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action"  (click)="abrirPerfil()">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>

            <p-confirmpopup />
            <p-toast />
            <p-dialog 
                [(visible)]="dialogPerfilVisible" [modal]="true" [dismissableMask]="true" [draggable]="false" [resizable]="false" [baseZIndex]="10000" header="Perfil de Usuario" closable="true"
                [style]="{ width: '320px', position: 'fixed', top: '4rem', right: '1rem', margin: '0', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '1rem' }"
                [contentStyle]="{ padding: '0.5rem' }">
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

                    <div style="text-align: center; margin-top: 1rem;">
                    <button 
                        pButton label="Cerrar sesión" icon="pi pi-sign-out" class="p-button-danger" (click)="confirmarCerrarSesion($event)">
                    </button>
                    </div>
                </div>
            </p-dialog>
        </div>
    </div>`
})
export class AppTopbar implements OnInit  {

    dialogPerfilVisible = false;
    perfilUsuario: any = null;

    constructor(public layoutService: LayoutService, 
        private loginService: LoginService, 
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    abrirPerfil() {
        const userString = localStorage.getItem('user');
        if (userString) {
        this.perfilUsuario = JSON.parse(userString);
        this.dialogPerfilVisible = true;
        }
    }

    cerrarSesion() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.dialogPerfilVisible = false;
        this.router.navigate(['/landing']); // o a donde quieras redirigir
    }

    confirmarCerrarSesion(event: Event) {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: '¿Estás seguro de que deseas cerrar sesión?',
          icon: 'pi pi-exclamation-triangle',
          header: 'Confirmación',
          rejectButtonProps: {
            label: 'No',
            severity: 'secondary',
            outlined: true
          },
          acceptButtonProps: {
            label: 'Sí',
            severity: 'danger'
          },
          accept: () => {
            this.cerrarSesion(); // Acción de cierre de sesión real
          },
          reject: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Cancelado',
              detail: 'No se cerró la sesión',
              life: 3000
            });
          }
        });
      }
      


      getRolNombre(idRol: number): string {
        switch (idRol) {
          case 1:
            return 'Administrador';
          default:
            return 'Desconocido';
        }
      }

    logout(): void {
        this.loginService.logout(); 
        this.router.navigate(['/landing']);  
    }
}
