import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AsistenciaService } from '../service/asistencia.service'; 
import { Asistencia } from '../interfaces/asistencia';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';



@Component({
  selector: 'app-asistencia-usuario',
  standalone: true,
  templateUrl: './asistencia-usuario.component.html',
   imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    ProgressSpinnerModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule
  ],
  providers: [MessageService],
})
export class AsistenciaUsuarioComponent implements OnInit {
  asistencias: Asistencia[] = [];
  loading = false;
  yaRegistrado = false;
  terminoBusqueda: string = '';

  constructor(
    private asistenciaService: AsistenciaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerAsistencias();
  }

 obtenerAsistencias(): void {
  this.loading = true;
  this.asistenciaService.obtenerMisAsistencias().subscribe({
    next: (data) => {
      this.asistencias = data;
      this.yaRegistrado = data.some((a) => a.fecha === this.fechaHoy());
      this.loading = false;
    },
    error: () => {
      this.mostrarMensajeError();
      this.loading = false;
    }
  });
}

registrarAsistencia(): void {
  const nuevaAsistencia: Partial<Asistencia>[] = [{
    fecha: this.fechaHoy(),
    presente: 1,
  }];

  this.asistenciaService.guardarMisAsistencias(nuevaAsistencia).subscribe({
    next: () => {
      this.mostrarMensajeExito();
      this.obtenerAsistencias(); 
    },
    error: () => {
      this.mostrarMensajeAdvertencia();
    }
  });
}

// Mensajes toast reutilizables
mostrarMensajeExito(): void {
  this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Asistencia registrada' });
}

mostrarMensajeAdvertencia(): void {
  this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Parece que ya registraste tu asistencia o el administrador la ha eliminado.' });
}

mostrarMensajeError(): void {
  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener asistencias' });
}



  fechaHoy(): string {
  const fecha = new Date();
  const offset = fecha.getTimezoneOffset();
  fecha.setMinutes(fecha.getMinutes() - offset);
  return fecha.toISOString().split('T')[0];
  }

}