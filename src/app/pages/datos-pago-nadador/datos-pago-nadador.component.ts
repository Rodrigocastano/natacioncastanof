import { Component, OnInit } from '@angular/core';
import { MedidasusuarioService } from '../service/medidasusuario.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-datos-pago-nadador',
  imports: [CommonModule, TableModule, CardModule, TagModule],
  templateUrl: './datos-pago-nadador.component.html',
})
export class DatosPagoNadadorComponent implements OnInit {

  usuario: string = '';
  pagos: any[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(private medidasUsuarioService: MedidasusuarioService) { }

  ngOnInit(): void {
    this.obtenerPagos();
  }

  obtenerPagos() {
    this.cargando = true;
    this.error = null;

    this.medidasUsuarioService.obtenerMisPagos().subscribe({
      next: (res) => {
        if (res.success) {
          this.usuario = res.usuario;
          this.pagos = res.pagos;
        } else {
          this.error = res.message || 'No se encontraron pagos.';
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al obtener los pagos.';
        this.cargando = false;
      }
    });
  }

  formatDate(fecha: string): string {
    if (fecha === 'TOTAL') return 'TOTAL';
    return new Date(fecha).toLocaleDateString();
  }
}