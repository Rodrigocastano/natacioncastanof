import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Elasticida } from '../interfaces/elasticida';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ElasticidaService } from '../service/elasticida.service';
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
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-elasticida',
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
  templateUrl: './elasticida.component.html'
})
export class ElasticidaComponent implements OnInit{
  
    formSave!: FormGroup;
    visibleSave: boolean = false;
    elasticida: Elasticida[] = [];
    idElasticida: number = 0;
    visibleDelete: boolean = false;

    formUpdate!: FormGroup;
    elastic: any
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
        private elasticidaService: ElasticidaService,
        private usuarioService: UsuarioService,
        private messageService: MessageService
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          medida_elasticida: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
          fecha: ['', [Validators.required]]
          
        });
        this.formUpdate = fb.group({
          medida_elasticida: ['', [Validators.required]],
          fecha: ['', [Validators.required]],
          id_usuario: ['', [Validators.required]]
        });
    }
    
    ngOnInit(): void {
      this.getElasticida();
      this.getUsuarios();
    }

    getElasticida() {
      this.elasticidaService.getAllTodoElasticida().subscribe(
        data => {
          this.elasticida = data.data
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
          medida_elasticida: this.formSave.value.medida_elasticida,
          fecha: this.formatDate(this.formSave.value.fecha),
          id_usuario: this.formSave.value.id_usuario,
        };
  
        this.elasticidaService.createElasticida(newUsuario).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getElasticida();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar la medida elasticida:', err);
            
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
        const updateElasticida: Elasticida = {
          id: this.elastic.id,
          medida_elasticida: this.formUpdate.value.medida_elasticida,
          fecha: this.formatDate(this.formUpdate.value.fecha),
          id_usuario: this.formUpdate.value.id_usuario,
        };
    
        this.elasticidaService.updateElasticida(this.elastic.id, updateElasticida).subscribe({
          next: (res) => {
            this.getElasticida();
            this.visibleUpdate = false;
            this.saveMessageToast();
          },
          error: (err) => {
            console.error('Error actualizando usuario:', err);
            this.errorMessageToast(); 
          }
        });
      }
    }

    edit(elasticId: any) {
      this.idForUpdate = true;
      this.elastic = elasticId
      if (this.elastic) {
        this.formUpdate.controls['medida_elasticida'].setValue(this.elastic?.medida_elasticida)
        this.formUpdate.controls['fecha'].setValue(new Date(this.elastic?.fecha))
        this.formUpdate.controls['id_usuario'].setValue(this.elastic?.id_usuario) 
      }
      this.visibleUpdate = true;
      
    }

    canceUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }
      
    delete() {
      this.elasticidaService.deleteElasticida(this.idElasticida).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getElasticida();
          this.idElasticida = 0;
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast(); 
        }
      });
    } 

    showModalDelete(id: number) {
      this.idElasticida = id;
      this.visibleDelete = true
    }

}
