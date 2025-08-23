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
            { label: 'Asistencias', icon: 'pi pi-verified', routerLink: ['/pages/asistenciaUsuario'] },
            { label: 'Medidas', icon: 'pi pi-id-card', routerLink: ['/pages/medidaUsuario'] },
            { label: 'Datos médico', icon: 'pi pi-book', routerLink: ['/pages/datoMedicosUsuario'] },
            { label: 'Datos psicólogo', icon: 'pi pi-book', routerLink: ['/pages/datoPsicologoUsuario'] },
            { label: 'Torneos participados', icon: 'pi pi-trophy', routerLink: ['/pages/datocompetenciaUsuario'] },
            { label: 'Dato de Pagos', icon: 'pi pi-trophy', routerLink: ['/pages/pagoUsuario'] },
            
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
            { label: 'Dashboard usuario', icon: 'pi pi-fw pi-home', routerLink: ['/pages/verDashboard'] },
            
            {
              label: 'Gestión de usuarios', icon: 'pi pi-id-card', items: [
                { label: 'Grupo', icon: 'pi pi-sitemap', routerLink: ['/pages/grupo'] },
                { label: 'Género', icon: 'pi pi-mars', routerLink: ['/pages/genero'] },
                { label: 'Ciudad', icon: 'pi pi-building', routerLink: ['/pages/ciudad'] },
                { label: 'Usuarios', icon: 'pi pi-user-plus', routerLink: ['/pages/usuario'] },
                { label: 'Entrenadores', icon: 'pi pi-user-plus', routerLink: ['/pages/entrenador'] },
                { label: 'Médico', icon: 'pi pi-user-plus', routerLink: ['/pages/medicos'] },
                { label: 'Psicólogo', icon: 'pi pi-user-plus', routerLink: ['/pages/psicologos'] },
                { label: 'Representantes', icon: 'pi pi-user-plus', routerLink: ['/pages/representante'] },
                { label: 'Representantes nadador', icon: 'pi pi-users', routerLink: ['/pages/representantenadador'] },
                { label: 'Horario', icon: 'pi pi-book', routerLink: ['/pages/horario'] },
                { label: 'Matriculas de usuario', icon: 'pi pi-users', routerLink: ['/pages/historiaUsuario'] },
                { label: 'Horario de entrenador', icon: 'pi pi-users', routerLink: ['/pages/Entrenadorgrupo'] },
                { label: 'Ver entrenador con usuario', icon: 'pi pi-users', routerLink: ['/pages/Verentrenadorusuario'] },
                
              ]
            },
            {
              label: 'Gestión de pago', icon: 'pi pi-dollar', items: [
                { label: 'Tipo de pago', icon: 'pi pi-tags', routerLink: ['/pages/tipoPago'] },
                { label: 'Plan pago', icon: 'pi pi-credit-card', routerLink: ['/pages/planPago'] },
                { label: 'Registro pago', icon: 'pi pi-money-bill', routerLink: ['/pages/pago'] },
                { label: 'Pagar abono', icon: 'pi pi-money-bill', routerLink: ['/pages/abonoPago'] },
                { label: 'Ver pago usuario', icon: 'pi pi-credit-card', routerLink: ['/pages/verPago'] },
                { label: 'Reporte general', icon: 'pi pi-file', routerLink: ['/pages/reporte'] },
                { label: 'Reporte de usuario', icon: 'pi pi-file', routerLink: ['/pages/comprobante'] },
               
              ]
            },
            
            {
              label: 'Egreso de pago', icon: 'pi pi-dollar', items: [
                { label: 'Plan pago', icon: 'pi pi-credit-card', routerLink: ['/pages/planPagoEntrenador'] },
                { label: 'Pagar a entrenadores', icon: 'pi pi-money-bill', routerLink: ['/pages/pagoEntrenadores'] },
                { label: 'Pagar abono', icon: 'pi pi-money-bill', routerLink: ['/pages/pagarAbono'] },
                { label: 'Ver pago entrenador', icon: 'pi pi-credit-card', routerLink: ['/pages/verPagoEntrenador'] },
                { label: 'Reporte general', icon: 'pi pi-file', routerLink: ['/pages/reporteentrenadores'] },
                { label: 'Reporte por entrenador', icon: 'pi pi-file', routerLink: ['/pages/reporteentrenador'] },
              ]
            },
            

            ...this.sharedMenuItems('administrador')
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
            ...this.sharedMenuItems('entrenador')
          ]
        }
      ];
    }

    
    getPsychologistMenu(): MenuItem[] {
      return [
        {
          label: 'Home',
          items: [
            { label: 'Psicólogo', icon: 'pi pi-book', routerLink: ['/pages/psicologo'] },
            { label: 'Datos del usuario', icon: 'pi pi-book', routerLink: ['/pages/datosPsicologo'] }
          ]
        }
      ];
    }

    getMedicalMenu(): MenuItem[] {
      return [
        {
          label: 'Home',
          items: [
            { label: 'Médico', icon: 'pi pi-book', routerLink: ['/pages/medico'] },
            { label: 'Datos del usuario', icon: 'pi pi-book', routerLink: ['/pages/datosMedico'] }
          ]
        }
      ];
    }

    sharedMenuItems(rol: string): MenuItem[] {
      const items: MenuItem[] = [
        {
          label: 'Medidas físicas', icon: 'pi pi-id-card', items: [
            { label: 'Elasticida', icon: 'pi pi-id-card', routerLink: ['/pages/elasticida'] },
            { label: 'Nutricionales', icon: 'pi pi-id-card', routerLink: ['/pages/nutricionales'] },
            { label: 'Antropométrica', icon: 'pi pi-id-card', routerLink: ['/pages/antropometrica'] },
            { label: 'Ver medidas usuario', icon: 'pi pi-file', routerLink: ['/pages/VerMedidasUsuario'] }
          ]
        },
        {
          label: 'Rendimiento natación', icon: 'pi pi-history', items: [
            { label: 'Tipo de nado', icon: 'pi pi-sync', routerLink: ['/pages/tipoNado'] },
            { label: 'Categoria distancia', icon: 'pi pi-send', routerLink: ['/pages/categoriaDistancia'] },
            { label: 'Tiempo nadador', icon: 'pi pi-history', routerLink: ['/pages/tiempoNadador'] },
            { label: 'Graficas', icon: 'pi pi-warehouse', routerLink: ['/pages/graficas'] }
          ]
        },
        {
          label: 'Competencia natación', icon: 'pi pi-history', items: [
            { label: 'Área de nado', icon: 'pi pi-arrows-h', routerLink: ['/pages/areaNado'] },
            { label: 'Categoría de prueba', icon: 'pi pi-tags', routerLink: ['/pages/categoriaProducto'] },
            { label: 'Tipo de categoría', icon: 'pi pi-tags', routerLink: ['/pages/categoriaTipo'] },
            { label: 'Torneo', icon: 'pi pi-book', routerLink: ['/pages/torneo'] },
            { label: 'Prueba torneo', icon: 'pi pi-book', routerLink: ['/pages/pruebaTorneo'] },
            { label: 'Prueba nadador', icon: 'pi pi-book', routerLink: ['/pages/pruebaNadador'] },
            { label: 'Ver los torneos', icon: 'pi pi-file', routerLink: ['/pages/verTorneo'] }
          ]
        },
        { label: 'Asistencias', icon: 'pi pi-pen-to-square', routerLink: ['/pages/asistencia'] }
      ];

      if (rol !== 'entrenador') {
        items.unshift({
          label: 'Área médica', icon: 'pi pi-book', items: [
            { label: 'Médico', icon: 'pi pi-book', routerLink: ['/pages/medico'] },
            { label: 'Psicólogo', icon: 'pi pi-book', routerLink: ['/pages/psicologo'] },
            { label: 'Datos médico usuario', icon: 'pi pi-book', routerLink: ['/pages/VerAreaMedicaUsuario'] },
          ]
        });
      }

      return items;
    }
}