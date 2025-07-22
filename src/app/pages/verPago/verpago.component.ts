import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../service/datos-usuario.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-verpago',
  standalone: true,
  templateUrl: './verpago.component.html',
  imports: [CommonModule, FormsModule, DropdownModule, ToastModule],
  providers: [MessageService]
})
export class VerpagoComponent implements OnInit {
  usuarios: any[] = [];
  idUsuarioSeleccionado: number | null = null;
  pagos: any[] = [];
  loading: boolean = false;
  error: boolean = false;
  consultaRealizada: boolean = false;


  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
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
          detail: 'No se pudieron cargar los usuarios.'
        });
      }
    });
  }

cargarPagos(): void {
  if (!this.idUsuarioSeleccionado) return;

  this.loading = true;
  this.error = false;
  this.consultaRealizada = false;

  this.datosUsuarioService.obtenerDatosPagoUsuario(this.idUsuarioSeleccionado).subscribe({
    next: (res) => {
      this.pagos = res.slice(-12);
      this.loading = false;
      this.consultaRealizada = true;
    },
    error: () => {
      this.error = true;
      this.loading = false;
      this.consultaRealizada = true;
    }
  });
}


  formatDate(fecha: string): string {
    if (fecha === 'TOTAL') return 'TOTAL';
    const [y, m, d] = fecha.split('-');
    return `${d}-${m}-${y}`;
  }
}
