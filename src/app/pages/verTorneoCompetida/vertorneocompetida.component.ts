import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatosUsuarioService } from '../service/datos-usuario.service';

@Component({
  selector: 'app-vertorneocompetida',
  standalone: true,
  templateUrl: './vertorneocompetida.component.html',
  imports: [CommonModule, FormsModule, DropdownModule, ToastModule],
  providers: [MessageService],
})
export class VertorneocompetidaComponent implements OnInit {
  usuarios: any[] = [];
  idUsuarioSeleccionado: number | null = null;
  pruebas: any[] = [];
  usuarioSeleccionado: any = null;
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

  cargarPruebas(): void {
    if (!this.idUsuarioSeleccionado) return;

    this.loading = true;
    this.error = false;
    this.consultaRealizada = false;

    this.datosUsuarioService.obtenerPruebasUsuarios(this.idUsuarioSeleccionado).subscribe({
      next: (res) => {
        this.usuarioSeleccionado = res.usuario;
        this.pruebas = res.usuario?.pruebas || [];
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

  formatFecha(fecha: string): string {
    const [y, m, d] = fecha.split('-');
    return `${d}-${m}-${y}`;
  }
}
