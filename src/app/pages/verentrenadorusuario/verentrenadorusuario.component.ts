import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EntrenadorgrupoService } from '../service/entrenadorgrupo.service';
import { EntrenadorService } from '../service/entrenador.service';

@Component({
  selector: 'app-verentrenadorusuario',
  standalone: true,
  templateUrl: './verentrenadorusuario.component.html',
  imports: [CommonModule, FormsModule, DropdownModule, ToastModule],
  providers: [MessageService]
})
export class VerentrenadorusuarioComponent implements OnInit {
  entrenadores: any[] = [];
  idEntrenadorSeleccionado: number | null = null;
  entrenador: any = null;
  gruposNadadores: { [key: string]: any[] } = {};
  loading = false;
  error = false;
  consultaRealizada = false;

  constructor(
    private entrenadorgrupoService: EntrenadorgrupoService,
    private entrenadorService: EntrenadorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerEntrenadores();
  }

  obtenerEntrenadores(): void {
    this.entrenadorService.getAllEntrenadore().subscribe({
      next: (data) => {
        this.entrenadores = data.map((e: any) => ({
          ...e,
          nombreCompleto: `${e.nombre} ${e.apellido} - ${e.cedula}`
        }));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los entrenadores.'
        });
      }
    });
  }

  cargarEntrenador(): void {
    if (!this.idEntrenadorSeleccionado) return;

    this.loading = true;
    this.error = false;
    this.consultaRealizada = false;

    this.entrenadorgrupoService.verEntrenadoresUsuario(this.idEntrenadorSeleccionado).subscribe({
      next: (data) => {
        this.entrenador = data.entrenador;
        this.gruposNadadores = data.grupos_nadadores;
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

  get gruposKeys(): string[] {
    return this.gruposNadadores ? Object.keys(this.gruposNadadores) : [];
  }
}
