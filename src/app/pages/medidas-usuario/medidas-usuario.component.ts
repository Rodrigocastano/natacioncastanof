
import { Component, OnInit } from '@angular/core';
import { MedidasService } from '../service/medidas.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Elasticida } from '../interfaces/elasticida';
import { Nutricionales } from '../interfaces/nutricionales';
import { Antropometrica } from '../interfaces/antropometrica';


@Component({
  selector: 'app-medidas-usuario',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, ToastModule, FormsModule],
  providers: [MessageService],
  templateUrl: './medidas-usuario.component.html',
})
export class MedidasUsuarioComponent implements OnInit {


  loading   = true;
  error     = false;
  mediciones: Elasticida[] = [];
  nutriciones: Nutricionales[] = [];
  antros: Antropometrica[] = [];

  constructor(
    private elasticidaService: MedidasService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarMisMedidasElasticidad();
    this.cargarMisMedidasNutricionales();
    this.cargarMisMedidasAntropometricas(); 
  }

  /* ---------- Elasticidad ---------- */
  cargarMisMedidasElasticidad(): void {
    this.loading = true; this.error = false;

    this.elasticidaService.getMisMedidasElasticidad().subscribe({
      next: (res) => {
        const todas = res.data?.medidaElasticidas ?? [];
        this.mediciones = todas
          .sort((a: any, b: any) => a.fecha.localeCompare(b.fecha))
          .slice(-8);                 // últimos 7
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  /* ---------- Nutricionales ---------- */
  cargarMisMedidasNutricionales(): void {
    this.loading = true; this.error = false;

    this.elasticidaService.getMisMedidasNutricionales().subscribe({
      next: (res) => {
        const todas = res.data?.medidaNutricionales ?? [];
        this.nutriciones = todas
          .sort((a: any, b: any) => a.fecha.localeCompare(b.fecha))
          .slice(-8);
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

    /* ---------- Antropométricas ---------- */
  cargarMisMedidasAntropometricas(): void {
    this.loading = true; this.error = false;

    this.elasticidaService.getMisMedidasAntropometricas().subscribe({
      next: (res) => {
        const todas = res.data?.medidaAntropometricas ?? [];
        this.antros = todas
          .sort((a: any, b: any) => a.fecha.localeCompare(b.fecha))
          .slice(-8);
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }


  /* formatDate(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}-${m}-${y}`;
  } */

    formatDate(fecha?: string): string {
  if (!fecha) {
    return '';
  }
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

}
