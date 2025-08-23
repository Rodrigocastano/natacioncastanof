import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntrenadorgrupoService } from '../service/entrenadorgrupo.service';
import { HistorialEntrenador } from '../interfaces/historial-entrenador'; 
import { GrupoService } from '../service/grupo.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HorarioService } from '../service/horario.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { formatDate } from '@angular/common';
import { EntrenadorService } from '../service/entrenador.service';
import { Usuario } from '../interfaces/usuario';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';


@Component({
  selector: 'app-entrenadorgrupo',
  standalone: true,
  templateUrl: './entrenadorgrupo.component.html',
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    ToastModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    MessageModule,
    SelectModule,
    DatePickerModule,


  ]
})
export class EntrenadorgrupoComponent implements OnInit {
  formSave!: FormGroup;
  submitted: boolean = false;
  visibleSave: boolean = false;
  historial: HistorialEntrenador[] = [];

  maxDate: Date = new Date();
  fechaActual: Date = new Date();

  loading = true;
  filtro = '';
  grupos: any[] = [];
  horario: any[] = [];
  formUpdate!: FormGroup;


  usuarios: Usuario[] = [];
  visibleDelete: boolean = false;
  idGrupoEntrenador: number = 0;
  idForUpdate: boolean = false;
  pag: any
  visibleUpdate: boolean = false;

  constructor(
      private fb: FormBuilder,
      private entrenadorgrupoService: EntrenadorgrupoService,
      private grupoService: GrupoService,
      private entrenadorService: EntrenadorService,
      private messageService: MessageService,
      private horarioService:HorarioService,
  ) {

    this.formSave = this.fb.group({
      id_usuario: ['', Validators.required],
      id_grupo: ['', Validators.required],
      fecha_inicio: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      fecha_fin: [[]],
      estado_funcional: ['', []],
      id_fecha: ['', Validators.required],
    });

    this.formUpdate = this.fb.group({
      id_usuario: ['', Validators.required],
      id_grupo: ['', Validators.required],
      fecha_inicio: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      fecha_fin: [[]],
      estado_funcional: ['', []],
      id_fecha: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getEntrenadorGrupo();
    this.getEntrenador();
    this.loadGrupos();
    this.loadHorario();
  }

  getEntrenadorGrupo(): void {
    this.loading = true;
    this.entrenadorgrupoService.getAllEntrenadorGrupos().subscribe({
      next: (data) => {
        this.historial = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el historial de entrenador-grupo'
        });
        this.loading = false;
      }
    });
  }

  loadGrupos() {
        this.grupoService.getAllGrupo().subscribe(grupos => {
            this.grupos = grupos;
        });
    }

    loadHorario() {
      this.horarioService.getAllHorario().subscribe(horario => {
          this.horario = horario;
      });
    }

  getEntrenador() {
    this.entrenadorService.getAllEntrenadore().subscribe(
      data => {
        this.usuarios = data.map((usuario: any) => ({
          ...usuario,
          display: `${usuario.nombre} ${usuario.apellido} - ${usuario.cedula}`
        }));
      }
    );
  }

  store()
  {
    this.submitted = true;

    if (this.formSave.invalid) {
      this.errorMessageToast();
      this.formSave.markAllAsTouched();
      return;
    }

    if (this.formSave.valid) {
      const presenteValue = this.formSave.value.estado_funcional !== null && this.formSave.value.estado_funcional !== undefined 
      ? this.formSave.value.estado_funcional 
      : true; 

      const newPago: any = {
        id_usuario: this.formSave.value.id_usuario,
        id_grupo: this.formSave.value.id_grupo,
        fecha_inicio: this.formatDate(this.formSave.value.fecha_inicio),
        id_fecha: this.formSave.value.id_fecha,
        estado_funcional: presenteValue, 
      };
      console.log('Datos enviados al backend:', newPago);

      this.entrenadorgrupoService.createEntrenadorGrupos(newPago).subscribe({
        next: () => {
          this.saveMessageToast();
          this.getEntrenadorGrupo();
          this.visibleSave = false;
        },
        error: (err) => {
          console.error('Error al guardar registro del pago:', err);
          
        }
      });
    }
  }

  showSaveDialog()
  {
    this.formSave.reset();
    this.visibleSave = true;
  }

  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Guardado correctamente' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar el datos.' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Cancelado!...' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Eliminado correctamente' });
  }
      
  formatDate = (date: Date): string => {
    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return adjustedDate.toISOString().split('T')[0];
  };

  cancelSave() {
    this.visibleSave = false;
    this.cancelMessageToast();
  }

  delete() {
    this.entrenadorgrupoService.destroyEntrenadorGrupo(this.idGrupoEntrenador).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getEntrenadorGrupo();
        this.idGrupoEntrenador = 0;
        this.EliminadoMessageToasts(); 
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.errorMessageToast();
      }
    });
  }

  showModalDelete(id: number) {
    this.idGrupoEntrenador = id;
    this.visibleDelete = true
  }

  edit(planPagoId: any) {
      this.idForUpdate = true;
      this.pag = planPagoId;

      if (this.pag) {
          const parseLocalDate = (dateString: string) => {
              return dateString ? new Date(dateString + 'T00:00:00') : null;
          };
          this.formUpdate.patchValue({
              id_usuario: this.pag.id_usuario,
              id_grupo: this.pag.id_grupo,
              id_fecha: this.pag.id_fecha,
              estado_funcional: this.pag.estado_funcional === 1,
              fecha_inicio: parseLocalDate(this.pag.fecha_inicio),
              fecha_fin: parseLocalDate(this.pag.fecha_fin),
          });

      }

      this.visibleUpdate = true;
  }

  canceUpdate() {
    this.visibleUpdate = false;
    this.cancelMessageToast();
  }

  update() {
    if (this.formUpdate.invalid) return;

    const formData = this.formUpdate.value;

    const payload = {
        id: this.pag.id,
        id_usuario: formData.id_usuario,
        id_grupo: formData.id_grupo,
        fecha_inicio: this.formatDate(formData.fecha_inicio),
        fecha_fin: formData.fecha_fin ? this.formatDate(formData.fecha_fin) : null,
        id_fecha: formData.id_fecha,
        estado_funcional: formData.estado_funcional ? 1 : 0,
    };

    console.log('Payload completo:', JSON.stringify(payload, null, 2));

    this.entrenadorgrupoService.updateEntrenadorGrupos(this.pag.id, payload).subscribe({
        next: () => {
            this.getEntrenadorGrupo();
            this.visibleUpdate = false;
            this.saveMessageToast();
        },
        error: (err) => {
            console.error('Error del backend:', {
                request: payload,
                response: err.error
            });
            this.errorMessageToast();
        }
    });
}

  getNombreCompleto(registro: HistorialEntrenador): string {
    return `${registro.nombre} ${registro.apellido}`;
  }

   cancelarMatricula(id: number) {
      this.entrenadorgrupoService.cancelarMatriculaEntrenador(id).subscribe({
        next: () => {
          this.getEntrenadorGrupo(); // Recarga la tabla
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Matrícula cancelada correctamente' });
        },
        error: (err) => {
          console.error('Error al cancelar matrícula:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cancelar la matrícula' });
        }
      });
    }



}
