import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../service/datos-usuario.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { DropdownModule } from 'primeng/dropdown';
import annotationPlugin from 'chartjs-plugin-annotation';

interface TiempoNado {
  x: string; // fecha
  y: number; // tiempo en segundos
  distancia: string;
  tiempo_formateado: string; // "00:00:34"
}

interface SerieNado {
  tipo_nado_id: number;
  name: string;
  data: TiempoNado[];
}

interface DatosUsuario {
  success: boolean;
  usuario: string;
  series: SerieNado[];
}

@Component({
  selector: 'app-graficas',
  standalone: true,
  imports: [CommonModule, ChartModule, FormsModule, DropdownModule],
  templateUrl: './graficas.component.html',
})
export class GraficasComponent implements OnInit {

  comboChartData: { [key: number]: any } = {};
  comboChartOptions: any;
  loading = false;
  error = false;
  datosCargados = false;
  idUsuarioSeleccionado?: number;
  nombreUsuario = '';
  usuarios: any[] = [];
  loadingUsuarios = false;

  constructor(private datosUsuarioService: DatosUsuarioService) {
    Chart.register(...registerables, annotationPlugin);
  }

  ngOnInit(): void {
    this.configurarOpcionesGrafica();
    this.cargarUsuarios();
  }

  cargarDatos(idUsuario: number): void {
    this.loading = true;
    this.error = false;
    this.datosCargados = false;

    this.datosUsuarioService.obtenerTiemposPorUsuario(idUsuario).subscribe({
      next: (data: DatosUsuario) => {
        this.nombreUsuario = data.usuario;
        this.prepararDatosParaGrafica(data);
        this.loading = false;
        this.datosCargados = true;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.error = true;
        this.loading = false;
        this.datosCargados = true;
      }
    });
  }

  prepararDatosParaGrafica(data: DatosUsuario): void {
    this.comboChartData = {};
    data.series.forEach(serie => {
      const colorBarra = this.generarColor();
      const colorLinea = this.generarColor();
      const ultimosDatos = serie.data.slice(-10);

      const datosConvertidos = ultimosDatos.map(item => ({
        ...item,
        y: this.convertirTiempoASegundos(item.tiempo_formateado)
      }));

      this.comboChartData[serie.tipo_nado_id] = {
        chartTitle: serie.name,
        labels: datosConvertidos.map(item => item.x),
        datasets: [
          {
            label: `Barras`,
            data: datosConvertidos.map(item => item.y),
            backgroundColor: colorBarra + '80',
            borderColor: colorBarra,
            borderWidth: 1,
            type: 'bar',
            order: 2,
            borderRadius: 4
          },
          {
            label: `Línea`,
            data: datosConvertidos.map(item => item.y),
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

  configurarOpcionesGrafica(): void {
    const style = getComputedStyle(document.documentElement);
    this.comboChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: style.getPropertyValue('--text-color'),
            font: { weight: '500' }
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const label = ctx.dataset.label.replace(/ \(Línea\)| \(Barras\)/, '');
              const value = ctx.raw;
              if (value === null) return `${label}: Sin registro`;
              return `${label}: ${this.formatTime(value)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: style.getPropertyValue('--text-color-secondary')
          },
          grid: {
            color: style.getPropertyValue('--surface-border'),
            drawBorder: false
          }
        },
        y: {
          min: 0,
          ticks: {
            color: style.getPropertyValue('--text-color-secondary'),
            callback: (v: any) => this.formatTime(v),
            stepSize: 10
          },
          grid: {
            color: style.getPropertyValue('--surface-border'),
            drawBorder: false
          }
        }
      }
    };
  }

  private convertirTiempoASegundos(tiempo: string): number {
    const partes = tiempo.split(':').map(Number);
    if (partes.length === 3) {
      return partes[0] * 3600 + partes[1] * 60 + partes[2];
    } else if (partes.length === 2) {
      return partes[0] * 60 + partes[1];
    }
    return +tiempo;
  }

  private formatTime(value: number): string {
    const totalSeconds = Math.round(value);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private generarColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
  }

  cargarUsuarios(): void {
    this.loadingUsuarios = true;
    this.datosUsuarioService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.map(u => ({
          ...u,
          nombreCompleto: `${u.nombre} ${u.apellido}`
        }));
        this.loadingUsuarios = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loadingUsuarios = false;
      }
    });
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
