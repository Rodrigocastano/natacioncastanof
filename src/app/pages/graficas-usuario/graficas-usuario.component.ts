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

// En tu componente, modifica estas funciones:

private formatTime(seconds: number): string {
  if (seconds < 60) {
    // Mostrar solo segundos si es menos de 1 minuto
    return `${seconds.toFixed(1)}s`;
  } else if (seconds < 3600) {
    // Mostrar minutos:segundos si es menos de 1 hora
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  } else {
    // Mostrar horas:minutos:segundos si es más de 1 hora
    const hours = Math.floor(seconds / 3600);
    const remainingSecs = seconds % 3600;
    const mins = Math.floor(remainingSecs / 60);
    const secs = Math.floor(remainingSecs % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

configurarOpcionesGrafica(): void {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

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
            const label = context.dataset.label || '';
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
        beginAtZero: false,
        ticks: {
          color: textColorSecondary,
          callback: (value: any) => this.formatTime(value)
        },
        grid: { color: surfaceBorder, drawBorder: false }
      }
    }
  };
}

prepararDatosParaGrafica(data: DatosUsuario): void {
  this.comboChartData = {};
  data.series.forEach(serie => {
    const colorLinea = this.generarColor();
    const ultimosDatos = serie.data.slice(-10);

    // Calcular el valor máximo para ajustar la escala
    const maxValue = Math.max(...ultimosDatos.map(item => item.y), 0);
    const suggestedMax = maxValue * 1.2; // Añadir 20% de espacio arriba

    // Clonar las opciones base y personalizar para esta serie
    const chartOptions = JSON.parse(JSON.stringify(this.comboChartOptions));
    chartOptions.scales.y.suggestedMax = suggestedMax;

    this.comboChartData[serie.tipo_nado_id] = {
      chartTitle: serie.name,
      labels: ultimosDatos.map(item => item.x),
      datasets: [
        {
          label: `Tiempo`,
          data: ultimosDatos.map(item => item.y),
          borderColor: colorLinea,
          backgroundColor: 'transparent',
          borderWidth: 3,
          tension: 0.4,
          type: 'line',
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: false
        }
      ],
      options: chartOptions
    };
  });
}
  private generarColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
