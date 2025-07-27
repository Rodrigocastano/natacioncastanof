import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../service/datos-usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-verdashboar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    TabViewModule,
    ChartModule,
    TableModule,
    ProgressSpinnerModule,
    CardModule,
    SelectButtonModule,
    ButtonModule
  ],
  templateUrl: './verdashboar.component.html',
  providers: [MessageService]
})
export class VerdashboarComponent implements OnInit {
  usuarios: any[] = [];
  idUsuarioSeleccionado: number | null = null;
  datosUsuario: any = null;
  loading = false;
  error = false;
  datos: any = {}; 
  comboChartData: { [key: number]: any } = {};
  chartOptions: any;
  objectKeys = Object.keys;
  datosCargados: boolean = false;



  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.configurarOpcionesGrafica();
  }

  configurarOpcionesGrafica(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.raw;
              return `${label}: ${this.formatTime(value)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true, 
          min: 0,           
          ticks: {
            callback: (value: any) => this.formatTime(value),
            stepSize: 30 
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };
  }

  prepararDatosGrafica(): void {
    if (!this.datosUsuario?.tiemposNado?.series) return;
    
    this.comboChartData = {};
    this.datosUsuario.tiemposNado.series.forEach((serie: any) => {
      const colorLinea = this.generarColor();
      const ultimosDatos = serie.data.slice(-10);

      const datosConvertidos = ultimosDatos.map((item: any) => ({
        ...item,
        y: this.convertirTiempoASegundos(item.tiempo_formateado)
      }));

      serie.tipoGrafica = 'combo';

      this.comboChartData[serie.tipo_nado_id] = {
        chartTitle: `${serie.name} (${serie.data[0]?.distancia || 'N/A'})`,
        labels: datosConvertidos.map((item: any) => item.x),
        datasets: [
          {
            label: `Línea`,
            data: datosConvertidos.map((item: any) => item.y),
            borderColor: colorLinea,
            backgroundColor: 'transparent',
            borderWidth: 3,
            tension: 0.4,
            type: 'line',
            order: 1,
            pointRadius: 5,
            pointHoverRadius: 8
          }
        ]
      };
    });
  }


  actualizarTipoGrafica(serie: any): void {
    const chartData = this.comboChartData[serie.tipo_nado_id];
    
    if (serie.tipoGrafica === 'bar') {
      chartData.datasets[0].hidden = true;
      chartData.datasets[1].hidden = false;
    } else if (serie.tipoGrafica === 'line') {
      chartData.datasets[0].hidden = false;
      chartData.datasets[1].hidden = true;
    } else {
      chartData.datasets[0].hidden = false;
      chartData.datasets[1].hidden = false;
    }
    
    this.comboChartData = {...this.comboChartData};
  }

  generarColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
  }

  convertirTiempoASegundos(tiempo: string): number {
    if (!tiempo) return 0;
    
    const partes = tiempo.split(':').map(Number);
    if (partes.length === 3) {
      return partes[0] * 3600 + partes[1] * 60 + partes[2];
    } else if (partes.length === 2) {
      return partes[0] * 60 + partes[1];
    }
    return Number(tiempo);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getFechasMedicion(serie: any): string {
    if (!serie?.data) return '';
    return serie.data.map((d: any) => d.fecha_formateada).join(', ');
  }

  cargarUsuarios(): void {
    this.datosUsuarioService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.map((u: any) => ({
          ...u,
          nombreCompleto: `${u.nombre} ${u.apellido} - ${u.cedula}`
        }));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios'
        });
      }
    });
  }

  cargarDatosUsuario(): void {
    if (!this.idUsuarioSeleccionado) return;

    this.loading = true;
    this.error = false;
    this.datosUsuario = null;

    this.datosUsuarioService.obtenerTodosLosDatosUsuarios(this.idUsuarioSeleccionado).subscribe({
      next: (data: any) => {
        interface SerieTiempo {
          tipo_nado_id: number;
          name: string;
          data: any[];
        }

        this.datosUsuario = {
          ...data,
          pagos: data.pagos.slice(0, 15),
          pruebas: data.pruebas.slice(0, 10),
          tiemposNado: {
            series: data.tiemposNado.series.map((serie: SerieTiempo) => ({
              ...serie,
              data: serie.data.slice(0, 12)
            }))
          },
          medidas: {
            elasticidad: data.medidas.elasticidad.slice(0, 8),
            nutricionales: data.medidas.nutricionales.slice(0, 8),
            antropometricas: data.medidas.antropometricas.slice(0, 8)
          },
          controles: {
            medicos: data.controles.medicos.slice(0, 8),
            psicologicos: data.controles.psicologicos.slice(0, 8)
          }
        };
        
        this.prepararDatosGrafica();
        this.loading = false;
      },
      error: (error: any) => {
        this.error = true;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los datos del usuario'
        });
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr || dateStr === 'TOTAL') return dateStr;
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  mostrarApto(valor: number): string {
    return valor === 1 ? 'Sí' : 'No';
  }

  comparar(valorActual: any, valorAnterior: any): string {
    if (valorActual === null || valorAnterior === null || isNaN(valorActual) || isNaN(valorAnterior)) {
      return '↔';
    }
    
    const numActual = parseFloat(valorActual);
    const numAnterior = parseFloat(valorAnterior);
    
    if (numActual > numAnterior) return '↑';
    if (numActual < numAnterior) return '↓';
    return '↔';
  }

}
