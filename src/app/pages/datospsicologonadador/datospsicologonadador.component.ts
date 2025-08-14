import { Component, OnInit } from '@angular/core';
import { MedidasusuarioService } from '../service/medidasusuario.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-datospsicologonadador',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, TagModule],
  templateUrl: './datospsicologonadador.component.html',
})
export class DatospsicologonadadorComponent implements OnInit {

  datosUsuario: any = null;
  cargando: boolean = true;
  error: string | null = null;

  constructor(private medidasUsuarioService: MedidasusuarioService) {}

  ngOnInit(): void {
    this.obtenerDatosPsicologos();
  }

  obtenerDatosPsicologos() {
    this.medidasUsuarioService.getMisDatosPsicologo().subscribe({
      next: (respuesta) => {
        console.log('Respuesta API:', respuesta);
        this.datosUsuario = respuesta.usuario;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudo obtener la información de psicologo';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  getAptoLabel(apto: boolean): string {
    return apto ? 'Sí' : 'No';
  }



  getAptoSeverity(apto: boolean): 'success' | 'danger' {
  return apto ? 'success' : 'danger';
}

}
