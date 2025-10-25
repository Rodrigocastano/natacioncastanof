import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Asistencia } from '../interfaces/asistencia';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AsistenciaService } from '../service/asistencia.service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';
import { GrupoService } from '../service/grupo.service';
import { HorarioService } from '../service/horario.service';
import { CheckboxModule } from 'primeng/checkbox';
import { Grupo } from '../interfaces/grupo';
import { Horario } from '../interfaces/horario';
import { EntrenadorService } from '../service/entrenador.service';
import { Entrenador } from '../interfaces/entrenador';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToolbarModule,
    InputIconModule,
    IconFieldModule,
    TableModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    TextareaModule,
    MessageModule,
    ToastModule,
    ReactiveFormsModule,
    DatePickerModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule,
    CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './asistencia.component.html',

})
export class AsistenciaComponent implements OnInit {
  
  formSave!: FormGroup;
  visibleSave: boolean = false;
  asistencia: Asistencia[] = [];
  idAsistencia: number = 0;
  visibleDelete: boolean = false;

  formUpdate!: FormGroup;
  asisten: any;
  idForUpdate: boolean = false;
  visibleUpdate: boolean = false;
  usuarios: Usuario[] = [];

  expandedRows = {};
  cols: any[] = [];
  expanded: boolean = false;
  msgs: ToastMessageOptions[] | null = [];
  terminoBusqueda: string = '';
  buscarOriginal: Asistencia[] = [];
  submitted: boolean = false;
  maxDate: Date = new Date();
  fechaActual: Date = new Date();
  loading: boolean = true;

  grupos: Grupo[] = [];
  horarios: Horario[] = [];
  selectedGrupo: number | null = null;
  selectedHorario: string | null = null;
  usuariosParaAsistencia: any[] = [];
  fechaAsistencias: Date = new Date();
  filtroBusqueda: string = '';
  showAsistenciaSection: boolean = false;

  entrenadores: Entrenador[] = [];
  selectedEntrenador: number | null = null;
  gruposDelEntrenador: Grupo[] = [];
  asistenciasAgrupadas: { grupoTurno: string, asistencias: Asistencia[] }[] = [];



  constructor(
    private fb: FormBuilder,
    private asistenciaService: AsistenciaService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private grupoService: GrupoService,
    private horarioService: HorarioService,
    private entrenadorService: EntrenadorService
  ) {
    this.formSave = this.fb.group({
      id_usuario: ['', [Validators.required]],
      presente: [true],
      fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
    });
    
    this.formUpdate = fb.group({
      presente: ['', []],
      fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      id_usuario: ['', [Validators.required]]
    });
  }

    ngOnInit(): void {
      this.getAsistencia();
      this.getUsuarios();
      this.loadGrupos();
      this.loadHorarios();
      this.loadEntrenadores(); 
    }

    loadEntrenadores() {
      this.entrenadorService.getAllEntrenadore().subscribe({
        next: (entrenadores) => {
          this.entrenadores = entrenadores.map((e: any) => ({
            ...e,
            nombreCompleto: `${e.nombre} ${e.apellido} - ${e.cedula}`
          }));
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los entrenadores'
          });
        }
      });
    }

    loadGrupos() {
      this.grupoService.getAllGrupo().subscribe({
        next: (grupos) => {
          this.grupos = grupos;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los grupos'
          });
        }
      });
    }
    loadHorarios() {
      this.horarioService.getAllHorario().subscribe({
        next: (horarios) => {
          this.horarios = horarios;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los horarios'
          });
        }
      });
    }

    onEntrenadorChange() {
        this.selectedGrupo = null;
        this.selectedHorario = null;
        this.usuariosParaAsistencia = [];
        
        if (this.selectedEntrenador) {
          this.grupoService.getGruposByEntrenador(this.selectedEntrenador).subscribe({
          next: (grupos) => {
            this.gruposDelEntrenador = grupos.map((g: any) => ({
              id: g.grupo_id,
              nombre: g.grupo_nombre,
              horario: g.horario
            }));
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al cargar los grupos del entrenador'
            });
          }
        });
      }
    }

    onGrupoChange() {
      this.selectedHorario = null;
      this.usuariosParaAsistencia = [];
      if (this.selectedGrupo && this.selectedHorario) {
        this.loadUsuariosForAsistencia();
      }
    }

    onTurnoChange() {
      this.usuariosParaAsistencia = [];
      if (this.selectedGrupo && this.selectedHorario) {
        this.loadUsuariosForAsistencia();
      }
    }

    loadUsuariosForAsistencia() {
  if (this.selectedGrupo && this.selectedHorario) {
    this.asistenciaService.getUsuariosByGrupoYHorario(this.selectedGrupo, this.selectedHorario).subscribe({
      next: (usuarios) => {
        this.usuariosParaAsistencia = usuarios.map(u => ({
          ...u,
          presente: true
        }));
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios del grupo'
        });
      }
    });
  }
}


    get usuariosFiltrados() {
      if (!this.filtroBusqueda || this.filtroBusqueda.trim() === '') {
        return this.usuariosParaAsistencia;
      }

      const filtro = this.filtroBusqueda.trim().toLowerCase();
      return this.usuariosParaAsistencia.filter(usuario => 
        (usuario.nombre?.toLowerCase().includes(filtro) ||
        (usuario.apellido?.toLowerCase().includes(filtro) ||
        (usuario.cedula?.toLowerCase().includes(filtro))
        )));
    }

    toggleAsistenciaSection() {
      this.showAsistenciaSection = !this.showAsistenciaSection;
      if (this.showAsistenciaSection) {
        this.usuariosParaAsistencia = [];
        this.resetAsistenciaForm(); 
      }
    }

    cancelAsistencia() {
      this.showAsistenciaSection = false;
      this.resetAsistenciaForm();
    }

    resetAsistenciaForm() {
      this.selectedEntrenador = null;
      this.selectedGrupo = null;
      this.selectedHorario = null;
      this.usuariosParaAsistencia = [];
      this.filtroBusqueda = '';
      this.fechaAsistencias = new Date();
    }

    saveAsistencias() {
      const asistencias = this.usuariosParaAsistencia.map(usuario => ({
        id_usuario: usuario.id,
        fecha: formatDate(this.fechaAsistencias, 'yyyy-MM-dd', 'en'),
        presente: usuario.presente ? 1 : 0,
      }));

      this.asistenciaService.createAsistenciasBatch(asistencias).subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: `${asistencias.length} asistencias guardadas` 
          });
          this.getAsistencia();
          this.showAsistenciaSection = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar las asistencias'
          });
        }
      });
    }

    getAsistencia() {
      this.loading = true;
      this.asistenciaService.getAllTodoAsistencias().subscribe({
        next: (data) => {
          this.asistencia = data.data;
          const gruposMap = new Map<string, Asistencia[]>();

          this.asistencia.forEach((asi) => {
            const key = `${asi.grupo} - ${asi.horario}`; 
            if (!gruposMap.has(key)) {
              gruposMap.set(key, []);
            }
            gruposMap.get(key)!.push(asi);
          });

          this.asistenciasAgrupadas = Array.from(gruposMap.entries()).map(([grupoTurno, asistencias]) => ({
            grupoTurno,
            asistencias
          }));

          this.loading = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar las asistencias'
          });
          this.loading = false;
        }
      });
    }

    getUsuarios() {
      this.usuarioService.getAllUsuarios().subscribe({
        next: (data) => {
          this.usuarios = data.map((usuario: any) => ({
            ...usuario,
            display: `${usuario.nombre} ${usuario.apellido} - ${usuario.cedula}`
          }));
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los usuarios'
          });
        }
      });
    }

    filtrarBusqueda() {
      const termino = this.terminoBusqueda.trim().toLowerCase();
      this.asistencia = this.buscarOriginal.filter(usuario => {
        return (
          usuario.nombre?.toLowerCase().includes(termino) ||
          usuario.apellido?.toLowerCase().includes(termino) ||
          usuario.cedula?.toLowerCase().includes(termino)
        );
      });
    }

    abrirExpand(event: TableRowExpandEvent) {
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Detalles expandidos', 
        detail: event.data.nombre, 
        life: 3000 
      });
    }

    cerrarCollapse(event: TableRowCollapseEvent) {
      this.messageService.add({
        severity: 'success',
        summary: 'Detalles colapsados',
        detail: event.data.nombre,
        life: 3000
      });
    }

    store() {
      this.submitted = true;
    
      if (this.formSave.invalid) {
        this.errorMessageToast();
        this.formSave.markAllAsTouched();
        return;
      }
    
      if (this.formSave.valid) {
        const presenteValue = this.formSave.value.presente !== null && this.formSave.value.presente !== undefined 
          ? this.formSave.value.presente 
          : true; 
    
        const newAsistencia: any = {
          presente: presenteValue,
          fecha: this.formatDate(this.formSave.value.fecha),
          id_usuario: this.formSave.value.id_usuario,
        };
    
        this.asistenciaService.createAsistencia(newAsistencia).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getAsistencia();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar registro asistencias:', err);
            this.errorMessageToast();
          }
        });
      }
    }

    showSaveDialog() {
      this.formSave.reset({
        presente: true,
        fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en')
      });
      this.visibleSave = true;
    }

    formatDate = (date: Date): string => {
      const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return adjustedDate.toISOString().split('T')[0];
    };

    saveMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Guardado correctamente' });
    }

    cancelMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Operación cancelada' });
    }

    errorMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar los datos' });
    }

    EliminadoMessageToasts() {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Eliminado correctamente' });
    }

    cancelSave() {
      this.visibleSave = false;
      this.cancelMessageToast();
    }

    update() {
      if (this.formUpdate.invalid) {
        this.errorMessageToast(); 
        this.formUpdate.markAllAsTouched();
        return;
      }
      if (this.formUpdate.valid) {
        const updateAsistencias: Asistencia = {
          id: this.asisten.id,
          presente: this.formUpdate.value.presente ? 1 : 0,
          fecha: this.formatDate(this.formUpdate.value.fecha),
          id_usuario: this.formUpdate.value.id_usuario,
        };
    
        this.asistenciaService.updateAsistencia(this.asisten.id, updateAsistencias).subscribe({
          next: (res) => {
            this.getAsistencia();
            this.visibleUpdate = false;
            this.saveMessageToast();
          },
          error: (err) => {
            console.log('Detalle del error:', err.error);
            this.errorMessageToast(); 
          }
        });
      }
    }

    edit(asistenId: any) {
      this.idForUpdate = true;
      this.asisten = asistenId;
      if (this.asisten) {
        const parseLocalDate = (dateString: string) => {
          return dateString ? new Date(dateString + 'T00:00:00') : null;
        };
        this.formUpdate.patchValue({
          presente: this.asisten?.presente,
          id_usuario: this.asisten?.id_usuario,
          fecha: parseLocalDate(this.asisten.fecha)
        });
      }
      this.visibleUpdate = true;
    }

    canceUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }

    delete() {
      this.asistenciaService.deleteAsistencia(this.idAsistencia).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getAsistencia();
          this.idAsistencia = 0;
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
      
    showModalDelete(id: number) {
      this.idAsistencia = id;
      this.visibleDelete = true;
    }
}