import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Psicologo } from '../interfaces/psicologo';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PsicologoService } from '../service/psicologo.service';
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

@Component({
  selector: 'app-psicologo',
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
  templateUrl: './psicologo.component.html',
})
export class PsicologoComponent implements OnInit{
  
  formSave!: FormGroup;
  visibleSave: boolean = false;
  psicologo: Psicologo[] = [];
  idPsicologo: number = 0;
  visibleDelete: boolean = false;

  formUpdate!: FormGroup;
  psico: any
  idForUpdate: boolean = false;
  visibleUpdate: boolean = false;
  usuarios: Usuario[] = [];

  expandedRows = {};
  cols: any[] = [];
  expanded: boolean = false;
  msgs: ToastMessageOptions[] | null = [];

  submitted: boolean = false;
  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
      private fb: FormBuilder,
      private psicologoService: PsicologoService,
      private usuarioService: UsuarioService,
      private messageService: MessageService
    ) {
      this.formSave = this.fb.group({
        id_usuario: ['', [Validators.required]],
        diagnostico: ['', []],
        apto: ['', []],
        fecha: ['', [Validators.required]]
        
      });
      this.formUpdate = fb.group({
        diagnostico: ['', []],
        apto: ['', []],
        fecha: ['', [Validators.required]],
        id_usuario: ['', [Validators.required]]
      });
    }
  
    ngOnInit(): void {
      this.getPsicologo();
      this.getUsuarios();
    }

    getPsicologo() {
      this.psicologoService.getAllTodoPsicologos().subscribe(
        data => {
          this.psicologo = data.data
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
        const newUsuario: any = {
          diagnostico: this.formSave.value.diagnostico,
          apto: this.formSave.value.apto,
          fecha: this.formatDate(this.formSave.value.fecha),
          id_usuario: this.formSave.value.id_usuario,
        };
  
        this.psicologoService.createPsicologos(newUsuario).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getPsicologo();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar registro psicologo:', err);
            
          }
        });
      }
    }

    showSaveDialog() {
      this.formSave.reset();
      this.visibleSave = true;
    }

    formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
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
        const updatePsicologo: Psicologo = {
          id: this.psico.id,
          diagnostico: this.formUpdate.value.diagnostico,
          apto: this.formUpdate.value.apto ? 1 : 0,
          fecha: this.formatDate(this.formUpdate.value.fecha),
          id_usuario: this.formUpdate.value.id_usuario,
        };
    
        this.psicologoService.updatePsicologos(this.psico.id, updatePsicologo).subscribe({
          next: (res) => {
            this.getPsicologo();
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
      this.psico = elasticId
      if (this.psico) {
        this.formUpdate.controls['diagnostico'].setValue(this.psico?.diagnostico)
        this.formUpdate.controls['apto'].setValue(this.psico?.apto)
        this.formUpdate.controls['fecha'].setValue(new Date(this.psico?.fecha))
        this.formUpdate.controls['id_usuario'].setValue(this.psico?.id_usuario) 
      }
      this.visibleUpdate = true;
      
    }

    canceUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }

    delete() {
      this.psicologoService.deletePsicologos(this.idPsicologo).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getPsicologo();
          this.idPsicologo = 0;
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
      
    showModalDelete(id: number) {
      this.idPsicologo = id;
      this.visibleDelete = true
    }

}
