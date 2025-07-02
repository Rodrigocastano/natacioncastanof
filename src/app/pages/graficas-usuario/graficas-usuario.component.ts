import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TiemponadadorService } from '../service/tiemponadador.service';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

interface TiempoNado {
  x: string;
  y: number;
  distancia: string;
  tiempo_formateado: string;
  fecha_formateada: string;
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
  selector: 'app-graficas-usuario',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './graficas-usuario.component.html',
})
export class GraficasUsuarioComponent implements OnInit {

  comboChartData: { [key: number]: any } = {};
  comboChartOptions: any;
  loading = true;
  error = false;
  nombreUsuario: string = '';

  constructor(private tiemposService: TiemponadadorService) {
    Chart.register(...registerables, annotationPlugin);
  }

  ngOnInit(): void {
    this.configurarOpcionesGrafica();
    this.cargarDatos();
  }

cargarDatos(): void {
  this.loading = true;
  this.error = false;
  
  this.tiemposService.obtenerMisTiempos().subscribe({
    next: (data: DatosUsuario) => {
      console.log('Respuesta completa del API:', data);
      
      if (!data.success) {
        console.warn('API respondió con success=false');
        this.loading = false;
        return;
      }
      
      this.nombreUsuario = data.usuario;
      console.log('Datos preparados para gráfica:', data.series);
      this.prepararDatosParaGrafica(data);
      this.loading = false;
    },
    error: (err) => {
      console.error('Error en la solicitud:', err);
      this.error = true;
      this.loading = false;
    }
  });
}

  prepararDatosParaGrafica(data: DatosUsuario): void {
    this.comboChartData = {};
    data.series.forEach(serie => {
      const colorBarra = this.generarColor();
      const colorLinea = this.generarColor();
      const ultimosDatos = serie.data.slice(-10);

      this.comboChartData[serie.tipo_nado_id] = {
        chartTitle: serie.name,
        labels: ultimosDatos.map(item => item.x),
        datasets: [
          {
            label: `Barras`,
            data: ultimosDatos.map(item => item.y),
            backgroundColor: colorBarra + '80',
            borderColor: colorBarra,
            borderWidth: 1,
            type: 'bar',
            order: 2,
            borderRadius: 4
          },
          {
            label: `Línea`,
            data: ultimosDatos.map(item => item.y),
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
    const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  const surfaceGround = documentStyle.getPropertyValue('--surface-ground');

    this.comboChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: {
              weight: '500'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label;
              const value = context.raw;
              if (value === null) return `${label}: Sin registro`;
              return `${label}: ${this.formatTime(value)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        },
        y: {
          min: 0,
          max: 120,
          ticks: {
            color: textColorSecondary,
            callback: (value: any) => this.formatTime(value),
            stepSize: 10
          },
          grid: { color: surfaceBorder, drawBorder: false }
        }
      }
    };
  }

  

  private formatTime(value: number): string {
    const minutes = Math.floor(value);
    const seconds = Math.round((value - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private generarColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
