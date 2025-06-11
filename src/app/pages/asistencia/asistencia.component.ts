import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

import { GeneroService } from '../service/genero.service';
import { Grupo } from '../interfaces/grupo';
import { GrupoService } from '../service/grupo.service';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-asistencia',
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
export class AsistenciaComponent implements OnInit{
  
  formSave!: FormGroup;
  visibleSave: boolean = false;
  asistencia: Asistencia[] = [];
  idAsistencia: number = 0;
  visibleDelete: boolean = false;

  formUpdate!: FormGroup;
  asisten: any
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

grupos: any[] = [];
selectedGrupo: number | null = null;
usuariosParaAsistencia: any[] = [];
fechaAsistencias: Date = new Date();
filtroBusqueda: string = '';
asistenciaFiltrada: any[] = [];


  
  constructor(
      private fb: FormBuilder,
      private asistenciaService: AsistenciaService,
      private usuarioService: UsuarioService,
      private messageService: MessageService,
      private gruposService: GrupoService,
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
    }



get usuariosFiltrados() {
  if (!this.filtroBusqueda || this.filtroBusqueda.trim() === '') {
    return this.usuariosParaAsistencia;
  }

  const filtro = this.filtroBusqueda.trim().toLowerCase();
  return this.usuariosParaAsistencia.filter(usuario => 
    usuario.nombre.toLowerCase().includes(filtro) ||
    usuario.apellido.toLowerCase().includes(filtro) ||
    usuario.cedula.toLowerCase().includes(filtro)
  );
}


    loadGrupos() {
    this.gruposService.getAllGrupo().subscribe(grupos => {
        this.grupos = grupos;
    });
}

onGrupoChange() {
    if (this.selectedGrupo) {
        this.asistenciaService.getUsuariosByGrupo(this.selectedGrupo).subscribe(usuarios => {
            this.usuariosParaAsistencia = usuarios.map(usuario => ({
                ...usuario,
                presente: true 
            }));
        });
    }
}

showAsistenciaSection: boolean = false;

toggleAsistenciaSection() {
    this.showAsistenciaSection = !this.showAsistenciaSection;
    if (!this.showAsistenciaSection) {
        this.resetAsistenciaForm();
    }
}

cancelAsistencia() {
    this.showAsistenciaSection = false;
    this.resetAsistenciaForm();
}

resetAsistenciaForm() {
    this.selectedGrupo = null;
    this.usuariosParaAsistencia = [];
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
      /* this.visibleSave = false; */
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al guardar'
      });
    }
  });
}
    getAsistencia() {
      this.asistenciaService.getAllTodoAsistencias().subscribe(
        data => {
          this.asistencia = data.data
          this.buscarOriginal = data.data; 
          this.loading = false;
        }
      );
    }

    getUsuarios() {
      this.usuarioService.getAllUsuarios().subscribe(
        data => {
          this.usuarios = data.map((usuario: any) => ({
            ...usuario,
            display: `${usuario.nombre} ${usuario.apellido} - ${usuario.cedula}`
          }));
          console.log(this.usuarios);
        }
      );
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
        summary: 'Abierto Expandicion de', 
        detail: event.data.nombre, 
        life: 3000 });
    }

    cerrarCollapse(event: TableRowCollapseEvent) {
      this.messageService.add({
          severity: 'success',
          summary: 'Cerrado Expandicion de ',
          detail: event.data.nombre,
          life: 3000
      });
    }

    onAusenteChange(event: any) {
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
    
        const newUsuario: any = {
          presente: presenteValue,
          fecha: this.formatDate(this.formSave.value.fecha),
          id_usuario: this.formSave.value.id_usuario,
        };
    
        this.asistenciaService.createAsistencia(newUsuario).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getAsistencia();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar registro asistencias:', err);
          }
        });
      }
    }
    

    showSaveDialog() {
      this.formSave.reset();
      this.visibleSave = true;
    }

    formatDate = (date: Date): string => {
      const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return adjustedDate.toISOString().split('T')[0];
    };
  
    saveMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Guardado correctamente' });
    }

    cancelMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Cancelado!...' });
    }

    errorMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar el datos.' });
    }

    EliminadoMessageToasts() {
      this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Eliminado correctamente' });
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
      this.asisten = asistenId
        if (this.asisten) {
          const parseLocalDate = (dateString: string) => {
            return dateString ? new Date(dateString + 'T00:00:00') : null;
          };
        this.formUpdate.controls['presente'].setValue(this.asisten?.presente)
        this.formUpdate.controls['id_usuario'].setValue(this.asisten?.id_usuario) 
        this.formUpdate.controls['fecha'].setValue(
          parseLocalDate(this.asisten.fecha)
        );
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
      this.visibleDelete = true
    }
        

}
