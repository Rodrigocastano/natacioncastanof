import { Component, OnInit } from '@angular/core';
import { HistorialUsuario } from '../interfaces/historialusuario'; 
import { HistorialUsuarioService } from '../service/historial-usuario.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.component.html',
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule
  ],
  standalone: true
})
export class HistorialUsuarioComponent implements OnInit {
  historial: HistorialUsuario[] = [];
  loading: boolean = true;
  filtro: string = '';

  constructor(
    private historialService: HistorialUsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.loading = true;
    this.historialService.getAllHistorial().subscribe({
      next: (data) => {
        this.historial = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el historial'
        });
        this.loading = false;
      }
    });
  }

  clearFilter(table: Table) {
    table.clear();
    this.filtro = '';
  }

  // Métodos auxiliares para formatear datos
  getEstadoFuncional(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  getEstado(estado: number): string {
    return estado === 1 ? 'Habilitado' : 'Deshabilitado';
  }

  getNombreCompleto(registro: HistorialUsuario): string {
    return `${registro.nombre} ${registro.apellido}`;
  }
}