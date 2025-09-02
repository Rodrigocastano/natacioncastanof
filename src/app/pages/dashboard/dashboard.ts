import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../service/dashboard.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import type { ChartData, ChartOptions } from 'chart.js';
import { DialogModule } from 'primeng/dialog';

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
    ButtonModule,
    ChartModule,
    DialogModule
  ],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

  loadingPagosCompletos = true;
  loadingPagosPendientes = true;
  loadingGraficaIngresos = true;

  pagados: GrupoPagos[] = [];
  pendientes: GrupoPagos[] = [];

  totalPendiente      = 0;
  totalPagado         = 0;
  entrenadoresActivos = 0;
  usuariosActivos     = 0;

  chartData!: ChartData<'bar'>;
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarPagosCompletos();
    this.cargarPagosPendientes();
    this.cargarIngresosPorMes(); 
    this.cargarResumen();
  }

  cargarPagosCompletos(): void {
    this.loadingPagosCompletos = true;
    this.dashboardService.getAllCompleto().subscribe({
      next: ({ data }) => { this.pagados = data; },
      error: err => console.error('Error al cargar pagos completos', err),
      complete: () => this.loadingPagosCompletos = false
    });
  }

  cargarPagosPendientes(): void {
    this.loadingPagosPendientes = true;
    this.dashboardService.getAllPendiente().subscribe({
      next: ({ data }) => { this.pendientes = data; },
      error: err => console.error('Error al cargar pagos pendientes', err),
      complete: () => this.loadingPagosPendientes = false
    });
  }

// Variables para controlar los modales
mostrarModalUsuariosPendientes: boolean = false;
mostrarModalHistorial: boolean = false;
usuariosModal: any[] = [];
historialModal: any[] = [];
pagoSeleccionado: any = null;
tipoModal: string = ''; // 'pendientes' o 'completos'

// Método para abrir el modal de usuarios
abrirModalUsuarios(usuarios: any[], tipo: string): void {
  this.usuariosModal = usuarios;
  this.tipoModal = tipo;
  this.mostrarModalUsuariosPendientes = true;
}

// Método para abrir el modal de historial
abrirHistorialPagos(pago: any): void {
  this.pagoSeleccionado = pago;
  this.historialModal = pago.historial;
  this.mostrarModalHistorial = true;
}

// Métodos para cerrar modales (opcional, si quieres control adicional)
cerrarModalUsuarios(): void {
  this.mostrarModalUsuariosPendientes = false;
  this.usuariosModal = [];
}

cerrarModalHistorial(): void {
  this.mostrarModalHistorial = false;
  this.historialModal = [];
  this.pagoSeleccionado = null;
}



    cargarResumen() {
    this.dashboardService.getAllTotalPendienteUsuario().subscribe({
      next: (res) => this.totalPendiente = +res.totalPendiente,
      error: () => this.totalPendiente = 0
    });

    this.dashboardService.getAllTotalPagadoUsuario().subscribe({
      next: (res) => this.totalPagado = +res.totalPagado,
      error: () => this.totalPagado = 0
    });

    this.dashboardService.getAllEntrenadoresCountActivo().subscribe({
      next: (res) => this.entrenadoresActivos = +res.Entrenadores,
      error: () => this.entrenadoresActivos = 0
    });

    this.dashboardService.getAllUsuariosCountActivo().subscribe({
      next: (res) => this.usuariosActivos = +res.Usuario,
      error: () => this.usuariosActivos = 0
    });
  }


  private cargarIngresosPorMes(): void {
    this.loadingGraficaIngresos = true;

    this.dashboardService.getAllindexIngresoPorMes()
      .subscribe({
        next: ({ data }) => {
          const ultimos = data.slice(-6);
          const labels     = ultimos.map((d: any) => d.mes);
          const abonado    = ultimos.map((d: any) => +d.total_abonado);
          const pendiente  = ultimos.map((d: any) => +d.total_pendiente);

          this.chartData = {
            labels,
            datasets: [
              { label: 'Total abonado',   data: abonado,   backgroundColor: '#4ade80' },
              { label: 'Total pendiente', data: pendiente, backgroundColor: '#f97316' }
            ]
          };
        },
        error: err => console.error('Error al cargar ingresos por mes', err),
        complete: () => this.loadingGraficaIngresos = false
      });
  }

}
