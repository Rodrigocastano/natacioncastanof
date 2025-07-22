import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DatosUsuarioService } from '../service/datos-usuario.service';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-vermedidas',
  standalone: true,
  templateUrl: './vermedidas.component.html',
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    ToastModule,
    TabViewModule,
    ToolbarModule,
    InputTextModule
  ],
})
export class VermedidasComponent implements OnInit {
  usuario: any = null;
  medidaElasticidas: any[] = [];
  medidaNutricionales: any[] = [];
  medidaAntropometricas: any[] = [];
  fechasElasticidad: string[] = [];
  fechasNutricionales: string[] = [];
  fechasAntropometricas: string[] = [];
  usuarios: any[] = [];
  idUsuarioSeleccionado: number | null = null;
  loading: boolean = false;
  error: boolean = false;

  constructor(private datosUsuarioService: DatosUsuarioService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.loading = true;
    this.datosUsuarioService.obtenerUsuarios().subscribe({
    next: (data) => {

      this.usuarios = data.map((u: any) => ({
        ...u,
        nombreCompleto: `${u.nombre} ${u.apellido} - ${u.cedula} `
      }));
      console.log('Usuarios cargados:', this.usuarios);
      this.loading = false;
    },
    error: () => {
      this.error = true;
      this.loading = false;
    }
  });

  }

  cargarDatos(id: number): void {
    this.loading = true;
    this.datosUsuarioService.obtenerMedidasPorUsuario(id).subscribe({
      next: (res) => {
        this.usuario = res.usuario;
        this.medidaElasticidas = (res.medidaElasticidas || []).slice(0, 8);
        this.medidaNutricionales = (res.medidaNutricionales || []).slice(0, 8);
        this.medidaAntropometricas = (res.medidaAntropometricas || []).slice(0, 8);

        this.fechasElasticidad = this.medidaElasticidas.map(m => m.fecha);
        this.fechasNutricionales = this.medidaNutricionales.map(m => m.fecha);
        this.fechasAntropometricas = this.medidaAntropometricas.map(m => m.fecha);

        this.loading = false;
        this.error = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  comparar(actual: any, anterior: any): string {
    if (!anterior) return '';
    const a = parseFloat(actual);
    const b = parseFloat(anterior);
    if (a > b) return '↑';
    if (a < b) return '↓';
    return '↔';
  }
  
}
