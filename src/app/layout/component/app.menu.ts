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
                    { label: 'Usuario', icon: 'pi pi-user-plus', routerLink: ['/pages/usuario'] },
                    { label: 'Entrenadores', icon: 'pi pi-user-plus', routerLink: ['/pages/entrenador'] },
                    { label: 'Asistencias', icon: 'pi pi-pen-to-square', routerLink: ['/pages/asistencia'] },
                    { label: 'Pago', icon: 'pi pi-book', routerLink: ['/pages/pago'] },
                    { label: 'Representante', icon: 'pi pi-book', routerLink: ['/pages/representante'] },
                    { label: 'Representante Nadador', icon: 'pi pi-book', routerLink: ['/pages/representantenadador'] },
                    { label: 'Médico', icon: 'pi pi-pen-to-square', routerLink: ['/pages/medico'] },
                    { label: 'Psicólogo', icon: 'pi pi-pen-to-square', routerLink: ['/pages/psicologo'] },
                    { label: 'Elasticida', icon: 'pi pi-pen-to-square', routerLink: ['/pages/elasticida'] },
                    { label: 'Nutricionales', icon: 'pi pi-pen-to-square', routerLink: ['/pages/nutricionales'] },
                    { label: 'Antropométrica', icon: 'pi pi-pen-to-square', routerLink: ['/pages/antropometrica'] },
                    { label: 'Torneo', icon: 'pi pi-book', routerLink: ['/pages/torneo'] },
                    { label: 'Categoria Distancia', icon: 'pi pi-book', routerLink: ['/pages/categoriaDistancia'] },
                    { label: 'Torneo Nado', icon: 'pi pi-book', routerLink: ['/pages/torneoNado'] },
                    { label: 'Tiempo Nadador', icon: 'pi pi-history', routerLink: ['/pages/tiempoNadador'] },
                ]
            },
           
        ];
    }
}
