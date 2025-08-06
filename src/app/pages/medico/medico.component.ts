import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Medico } from '../interfaces/medico';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MedicoService } from '../service/medico.service';
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
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-medico',
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
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './medico.component.html',
})
export class MedicoComponent implements OnInit{
  
      formSave!: FormGroup;
      visibleSave: boolean = false;
      medico: Medico[] = [];
      idMedico: number = 0;
      visibleDelete: boolean = false;

      formUpdate!: FormGroup;
      medi: any
      idForUpdate: boolean = false;
      visibleUpdate: boolean = false;
      usuarios: Usuario[] = [];

      expandedRows = {};
      cols: any[] = [];
      expanded: boolean = false;
      msgs: ToastMessageOptions[] | null = [];

      submitted: boolean = false;
      maxDate: Date = new Date();
      fechaActual: Date = new Date();
      loading: boolean = true;

      terminoBusqueda: string = '';
      buscarOriginal: Medico[] = [];

      aptoOptions = [
        { label: 'Sí', value: true },
        { label: 'No', value: false }
      ];
  
  constructor(
      private fb: FormBuilder,
      private medicoService: MedicoService,
      private usuarioService: UsuarioService,
      private messageService: MessageService
    ) {
      this.formSave = this.fb.group({
        id_usuario: ['', [Validators.required]],
        diagnostico: ['', []],
        apto: [true],
  /*       fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')] */
        
      });
      this.formUpdate = fb.group({
        diagnostico: ['', []],
        apto: [true, []],
       /*  fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')], */
        id_usuario: ['', [Validators.required]]
      });
    }
  
    ngOnInit(): void {
      this.getMedico();
      this.getUsuarios();
    }

    getMedico() {
      this.medicoService.getAllTodoMedico().subscribe(
        data => {
          this.medico = data.data
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
      this.medico = this.buscarOriginal.filter(usuario => {
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

store() {
  this.submitted = true;

  if (this.formSave.invalid) {
    this.errorMessageToast();
    this.formSave.markAllAsTouched();
    return;
  }

  if (this.formSave.valid) {
    // Si no se selecciona nada, se guarda como true ("Sí")
    const aptoValue = this.formSave.value.apto ?? true;

    const newUsuario: any = {
      diagnostico: this.formSave.value.diagnostico,
      apto: aptoValue,  // true si no se selecciona nada
   /*    fecha: this.formatDate(this.formSave.value.fecha), */
      id_usuario: this.formSave.value.id_usuario,
    };

    console.log('Datos a guardar:', newUsuario);

    this.medicoService.createMedico(newUsuario).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getMedico();
        this.visibleSave = false;
      },
      error: (err) => {
        console.error('Error al guardar registro médico:', err);
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
    }
  
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
        const updateMedico: Medico = {
          id: this.medi.id,
          diagnostico: this.formUpdate.value.diagnostico,
          apto: this.formUpdate.value.apto ? 1 : 0,
         /*  fecha: this.formatDate(this.formUpdate.value.fecha), */
          id_usuario: this.formUpdate.value.id_usuario,
        };
    
        this.medicoService.updateMedico(this.medi.id, updateMedico).subscribe({
          next: (res) => {
            this.getMedico();
            this.visibleUpdate = false;
            this.saveMessageToast();
          },
          error: (err) => {
            console.error('Error actualizando registro psicologo:', err);
            this.errorMessageToast(); 
          }
        });
      }
    }
        
    edit(elasticId: any) {
      console.log(elasticId)
      this.idForUpdate = true;
      this.medi = elasticId
      if (this.medi) {
        this.formUpdate.controls['diagnostico'].setValue(this.medi?.diagnostico)
        this.formUpdate.controls['apto'].setValue(this.medi?.apto)
        this.formUpdate.controls['id_usuario'].setValue(this.medi?.id_usuario) 
      /*    this.formUpdate.controls['fecha'].setValue(
          parseLocalDate(this.medi.fecha)
        ); */
      }
      this.visibleUpdate = true;
      
    }
        
    canceUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }
      
    delete() {
      this.medicoService.deleteMedico(this.idMedico).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getMedico();
          this.idMedico = 0;
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
      
    showModalDelete(id: number) {
      this.idMedico = id;
      this.visibleDelete = true
    }    
      
}
      