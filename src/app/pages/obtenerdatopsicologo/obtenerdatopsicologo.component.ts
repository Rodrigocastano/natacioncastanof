import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DatosUsuarioService } from '../service/datos-usuario.service';
import { PsicologoService } from '../service/psicologo.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-medico-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressSpinnerModule, ToastModule, DropdownModule],
  providers: [MessageService],
  templateUrl: './obtenerdatopsicologo.component.html',
})
export class ObtenerdatopsicologoComponent implements OnInit {

  usuarios: any[] = [];
  idUsuarioSeleccionado: number | null = null;

  controlesMedicos: any[] = [];
  controlesPsicologicos: any[] = [];

  loading: boolean = false;
  error: boolean = false;

  constructor(
    private datosUsuarioService: DatosUsuarioService,
    private Psicologoservice: PsicologoService,
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

cargarControles(): void {
  if (!this.idUsuarioSeleccionado) return;

  this.loading = true;
  this.error = false;

  this.Psicologoservice.obtenerDatoPsicologo(this.idUsuarioSeleccionado).subscribe({
    next: (res) => {
      const usuario = res.usuario ?? [];

      this.controlesMedicos = (usuario.controlesMedicos ?? [])
        .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .slice(-12);

      this.controlesPsicologicos = (usuario.controlesPsicologicos ?? [])
        .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .slice(-12);

      this.loading = false;
    },
    error: () => {
      this.error = true;
      this.loading = false;
    }
  });
}


  formatDate(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}-${m}-${y}`;
  }

  mostrarApto(valor: number): string {
    return valor === 1 ? 'Apto' : 'No Apto';
  }
}
