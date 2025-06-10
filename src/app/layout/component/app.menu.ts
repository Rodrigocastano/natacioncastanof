import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },

                    { label: 'Gestión de Usuarios', icon: 'pi pi-id-card', items: [
                    { label: 'Grupo', icon: 'pi pi-sitemap', routerLink: ['/pages/grupo'] },
                    { label: 'Género', icon: 'pi pi-mars', routerLink: ['/pages/genero'] },
                    { label: 'Ciudad', icon: 'pi pi-building', routerLink: ['/pages/ciudad'] },
                    { label: 'Usuarios', icon: 'pi pi-user-plus', routerLink: ['/pages/usuario'] },
                    { label: 'Entrenadores', icon: 'pi pi-user-plus', routerLink: ['/pages/entrenador'] },
                    { label: 'Representantes', icon: 'pi pi-user-plus', routerLink: ['/pages/representante'] },
                    { label: 'Representantes Nadador', icon: 'pi pi-users', routerLink: ['/pages/representantenadador'] },
                    ]},
                    
                    { label: 'Área médica', icon: 'pi pi-book', items: [
                    { label: 'Médico', icon: 'pi pi-book', routerLink: ['/pages/medico'] },
                    { label: 'Psicólogo', icon: 'pi pi-book', routerLink: ['/pages/psicologo'] },
                    ]},

                    { label: 'Medidas físicas', icon: 'pi pi-id-card', items: [
                    { label: 'Elasticida', icon: 'pi pi-id-card', routerLink: ['/pages/elasticida'] },
                    { label: 'Nutricionales', icon: 'pi pi-id-card', routerLink: ['/pages/nutricionales'] },
                    { label: 'Antropométrica', icon: 'pi pi-id-card', routerLink: ['/pages/antropometrica'] }
                    ]},
                
                    { label: 'Rendimiento natación', icon: 'pi pi-history', items: [
                    { label: 'Tipo de nado', icon: 'pi pi-sync', routerLink: ['/pages/tipoNado'] },
                    { label: 'Categoria Distancia', icon: 'pi pi-send' , routerLink: ['/pages/categoriaDistancia'] },
                    { label: 'Tiempo Nadador', icon: 'pi pi-history', routerLink: ['/pages/tiempoNadador'] }
                    ]},

                    { label: 'Competencia natación', icon: 'pi pi-history', items: [
                    { label: 'Área de Nado', icon: 'pi pi-arrows-h', routerLink: ['/pages/areaNado'] },
                    { label: 'Categoría de Prueba', icon: 'pi pi-tags', routerLink: ['/pages/categoriaProducto'] },
                    { label: 'Tipo de Categoría', icon: 'pi pi-tags', routerLink: ['/pages/categoriaTipo'] },
                    { label: 'Torneo', icon: 'pi pi-book', routerLink: ['/pages/torneo'] },
                    { label: 'Prueba Torneo', icon: 'pi pi-book', routerLink: ['/pages/pruebaTorneo'] },
                    { label: 'Prueba Nadador', icon: 'pi pi-book', routerLink: ['/pages/pruebaNadador'] }
                    ]},
                    
                    { label: 'Gestión de pago', icon: 'pi pi-dollar', items: [
                    { label: 'Tipo de pago', icon: 'pi pi-tags', routerLink: ['/pages/tipoPago'] },
                    { label: 'Plan pago', icon: 'pi pi-credit-card', routerLink: ['/pages/planPago'] },
                    { label: 'Registro Pago', icon: 'pi pi-money-bill', routerLink: ['/pages/pago'] },
                    { label: 'Pagar abono', icon: 'pi pi-money-bill', routerLink: ['/pages/abonoPago'] },
                    ]},


                    { label: 'Asistencias', icon: 'pi pi-pen-to-square', routerLink: ['/pages/asistencia'] },
                   
                ]
            },
           
        ];
    }
}
