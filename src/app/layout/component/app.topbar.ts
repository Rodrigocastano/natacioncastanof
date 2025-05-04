import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { DialogModule } from 'primeng/dialog';
import { LayoutService } from '../service/layout.service';
import { UsuarioService } from '../../../app/pages/service/usuario.service';
import { Usuario } from '../../pages/interfaces/usuario';
import { LoginService } from '../../pages/service/login.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, DialogModule, ButtonModule ],
    template: ` <div class="layout-topbar">
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
        <button type="button" class="layout-topbar-action" (click)="showUserDialog = true">
            <i class="pi pi-user"></i>
            <span>Profile</span>
        </button>
    </div>
</div>

<p-dialog 
    [(visible)]="showUserDialog"
    [modal]="true"
    [blockScroll]="true"
    [dismissableMask]="false"
    [draggable]="false"
    [resizable]="false"
    [baseZIndex]="10000"
    header="Perfil de Usuario"
    [style]="{
        width: '320px',
        position: 'fixed',
        top: '4rem',
        right: '1rem',
        margin: '0',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1rem'
    }"
>
    <div *ngFor="let u of usuario" style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Fila: Nombre -->
        <div style="display: flex; justify-content: space-between;">
            <strong style="color: #333;">Nombre:</strong>
            <span style="color: #00796b;">{{ u.nombre }}</span>
        </div>

        <!-- Fila: Apellido -->
        <div style="display: flex; justify-content: space-between;">
            <strong style="color: #333;">Apellido:</strong>
            <span style="color: #00796b;">{{ u.apellido }}</span>
        </div>

        <!-- Fila: Cédula -->
        <div style="display: flex; justify-content: space-between;">
            <strong style="color: #333;">Cédula:</strong>
            <span style="color: #00796b;">{{ u.cedula }}</span>
        </div>

        <!-- Fila: Rol -->
        <div style="display: flex; justify-content: space-between;">
            <strong style="color: #333;">Rol:</strong>
            <span style="color: #00796b;">{{ getRolNombre(u.id_rol) }}</span>
        </div>
    </div>

        <div class="p-d-flex p-jc-center">
        <button pButton label="Cerrar sesión" icon="pi pi-sign-out" class="p-button-danger" (click)="logout()"></button>
    </div>

</p-dialog>








        </div>
    </div>`
})
export class AppTopbar implements OnInit  {


    showUserDialog = false;

  usuario: Usuario[] = [];

    items!: MenuItem[];

    constructor(public layoutService: LayoutService, 
        private usuarioService: UsuarioService,
        private loginService: LoginService, private router: Router
    ) {}

    ngOnInit(): void {
        this.getPerfiles();

      }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    getPerfiles() {
        this.usuarioService.getAllPerfiles().subscribe(
          data => {
            this.usuario = data
            console.log(this.usuario)
          }
        );
      }

      getRolNombre(idRol: number): string {
        switch (idRol) {
          case 1:
            return 'Administrador';
          default:
            return 'Desconocido';
        }
      }

          // Método para cerrar sesión
    logout(): void {
        this.loginService.logout();  // Llama al servicio para cerrar sesión
        this.router.navigate(['/landing']);  // Redirige a la página de inicio o donde prefieras
    }
}
