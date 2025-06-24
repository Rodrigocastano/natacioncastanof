import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface HistorialPago {
  fecha: string;
  monto: number;
}

interface UsuarioPago {
  id_usuario: number;
  nombre: string;
  apellido: string;
  mostrarHistorial: boolean;
  historial: HistorialPago[];
}

interface GrupoPagos {
  tipoPago: string;
  pagos: UsuarioPago[];
  mostrarTodos: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

  loadingPagosCompletos = true;
  loadingPagosPendientes = true;

  pagados: GrupoPagos[] = [];
  pendientes: GrupoPagos[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarPagosCompletos();
    this.cargarPagosPendientes();
  }

  cargarPagosCompletos() {
    this.loadingPagosCompletos = true;
    this.dashboardService.getAllCompleto().subscribe({
      next: (data) => {
        this.pagados = data.data;
        this.loadingPagosCompletos = false;
      },
      error: (err) => {
        console.error('Error al cargar pagos completos', err);
        this.loadingPagosCompletos = false;
      }
    });
  }

  cargarPagosPendientes() {
    this.loadingPagosPendientes = true;
    this.dashboardService.getAllPendiente().subscribe({
      next: (data) => {
        this.pendientes = data.data;
        this.loadingPagosPendientes = false;
      },
      error: (err) => {
        console.error('Error al cargar pagos pendientes', err);
        this.loadingPagosPendientes = false;
      }
    });
  }
}
