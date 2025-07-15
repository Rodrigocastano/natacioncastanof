import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <div *ngIf="model.length > 0; else noMenuTemplate">
            <ul class="layout-menu">
                <ng-container *ngFor="let item of model; let i = index">
                    <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                    <li *ngIf="item.separator" class="menu-separator"></li>
                </ng-container>
            </ul>
        </div>
        <ng-template #noMenuTemplate>
            <div class="p-4 text-center">
                <p class="text-warning">No se encontró el rol en localStorage. Redirigiendo al login...</p>
                <button pButton label="Ir al login" [routerLink]="['/auth/login']"></button>
            </div>
        </ng-template>
    `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit() {
        const rol = localStorage.getItem('rol')?.toLowerCase();
        if (!rol) {
            this.model = [];
            return;
        }

        if (rol === 'usuario') {
            this.model = this.getUserMenu();
        } else if (rol === 'administrador') {
            this.model = this.getAdminMenu();
        } else if (rol === 'entrenador') {
            this.model = this.getTrainerMenu();
        } else if (rol === 'psicologo') {
            this.model = this.getPsychologistMenu();
        } else if (rol === 'medico') {
            this.model = this.getMedicalMenu();
        }
    }

    getUserMenu(): MenuItem[] {
        return [
            {
                label: 'Home',
                items: [
                    { label: 'Gráficas', icon: 'pi pi-chart-bar', routerLink: ['/pages/graficasUsuario'] },
                    { label: 'Asistencias', icon: 'pi pi-calendar', routerLink: ['/pages/asistenciaUsuario'] },
                    { label: 'Medidas', icon: 'pi pi-calendar', routerLink: ['/pages/medidaUsuario'] },
                ]
            }
        ];
    }

    getAdminMenu(): MenuItem[] {
        return [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                    {
                        label: 'Gestión de Usuarios', icon: 'pi pi-id-card', items: [
                            { label: 'Grupo', icon: 'pi pi-sitemap', routerLink: ['/pages/grupo'] },
                            { label: 'Género', icon: 'pi pi-mars', routerLink: ['/pages/genero'] },
                            { label: 'Ciudad', icon: 'pi pi-building', routerLink: ['/pages/ciudad'] },
                            { label: 'Usuarios', icon: 'pi pi-user-plus', routerLink: ['/pages/usuario'] },
                            { label: 'Entrenadores', icon: 'pi pi-user-plus', routerLink: ['/pages/entrenador'] },
                            { label: 'Médico', icon: 'pi pi-user-plus', routerLink: ['/pages/medicos'] },
                            { label: 'Psicólogo', icon: 'pi pi-user-plus', routerLink: ['/pages/psicologos'] },
                            { label: 'Representantes', icon: 'pi pi-user-plus', routerLink: ['/pages/representante'] },
                            { label: 'Representantes Nadador', icon: 'pi pi-users', routerLink: ['/pages/representantenadador'] },
                            { label: 'Historial del usuario', icon: 'pi pi-users', routerLink: ['/pages/historiaUsuario'] },
                        ]
                    },
                    {
                        label: 'Gestión de pago', icon: 'pi pi-dollar', items: [
                            { label: 'Tipo de pago', icon: 'pi pi-tags', routerLink: ['/pages/tipoPago'] },
                            { label: 'Plan pago', icon: 'pi pi-credit-card', routerLink: ['/pages/planPago'] },
                            { label: 'Registro Pago', icon: 'pi pi-money-bill', routerLink: ['/pages/pago'] },
                            { label: 'Pagar abono', icon: 'pi pi-money-bill', routerLink: ['/pages/abonoPago'] },
                            { label: 'Pagar Entrenadores', icon: 'pi pi-money-bill', routerLink: ['/pages/pagoEntrenadores'] },
                            { label: 'Reporte general', icon: 'pi pi-file', routerLink: ['/pages/reporte'] },
                            { label: 'Comprobante de usuario', icon: 'pi pi-file', routerLink: ['/pages/comprobante'] },
                        ]
                    },
                    { label: 'Pagar a entrenadores', icon: 'pi pi-money-bill', routerLink: ['/pages/pagoEntrenadores'] },
                    ...this.sharedMenuItems()
                ]
            }
        ];
    }

    getTrainerMenu(): MenuItem[] {
        return [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
                    ...this.sharedMenuItems()
                ]
            }
        ];
    }

    getPsychologistMenu(): MenuItem[] {
        return [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'] },
                    { label: 'Psicólogo', icon: 'pi pi-book', routerLink: ['/pages/psicologo'] }
                ]
            }
        ];
    }

    getMedicalMenu(): MenuItem[] {
        return [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'] },
                    { label: 'Médico', icon: 'pi pi-book', routerLink: ['/pages/medico'] }
                ]
            }
        ];
    }

    sharedMenuItems(): MenuItem[] {
        return [
            {
                label: 'Área médica', icon: 'pi pi-book', items: [
                    { label: 'Médico', icon: 'pi pi-book', routerLink: ['/pages/medico'] },
                    { label: 'Psicólogo', icon: 'pi pi-book', routerLink: ['/pages/psicologo'] },
                ]
            },
            {
                label: 'Medidas físicas', icon: 'pi pi-id-card', items: [
                    { label: 'Elasticida', icon: 'pi pi-id-card', routerLink: ['/pages/elasticida'] },
                    { label: 'Nutricionales', icon: 'pi pi-id-card', routerLink: ['/pages/nutricionales'] },
                    { label: 'Antropométrica', icon: 'pi pi-id-card', routerLink: ['/pages/antropometrica'] }
                ]
            },
            {
                label: 'Rendimiento natación', icon: 'pi pi-history', items: [
                    { label: 'Tipo de nado', icon: 'pi pi-sync', routerLink: ['/pages/tipoNado'] },
                    { label: 'Categoria Distancia', icon: 'pi pi-send', routerLink: ['/pages/categoriaDistancia'] },
                    { label: 'Tiempo Nadador', icon: 'pi pi-history', routerLink: ['/pages/tiempoNadador'] },
                    { label: 'Graficas', icon: 'pi pi-history', routerLink: ['/pages/graficas'] }
                ]
            },
            {
                label: 'Competencia natación', icon: 'pi pi-history', items: [
                    { label: 'Área de Nado', icon: 'pi pi-arrows-h', routerLink: ['/pages/areaNado'] },
                    { label: 'Categoría de Prueba', icon: 'pi pi-tags', routerLink: ['/pages/categoriaProducto'] },
                    { label: 'Tipo de Categoría', icon: 'pi pi-tags', routerLink: ['/pages/categoriaTipo'] },
                    { label: 'Torneo', icon: 'pi pi-book', routerLink: ['/pages/torneo'] },
                    { label: 'Prueba Torneo', icon: 'pi pi-book', routerLink: ['/pages/pruebaTorneo'] },
                    { label: 'Prueba Nadador', icon: 'pi pi-book', routerLink: ['/pages/pruebaNadador'] }
                ]
            },
            { label: 'Asistencias', icon: 'pi pi-pen-to-square', routerLink: ['/pages/asistencia'] }
        ];
    }
}