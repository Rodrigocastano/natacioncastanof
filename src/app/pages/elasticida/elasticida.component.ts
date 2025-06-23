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
import { formatDate } from '@angular/common';

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
    fechaActual: Date = new Date();
    currentDate: Date = new Date();
    loading: boolean = true;

    terminoBusqueda: string = '';
    buscarOriginal: Elasticida[] = [];

    visibleUserMeasureDialog: boolean = false;
    selectedUser: any;

    constructor(
        private fb: FormBuilder,
        private elasticidaService: ElasticidaService,
        private usuarioService: UsuarioService,
        private messageService: MessageService
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          medida_elasticida: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
          fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
          
        });
        this.formUpdate = fb.group({
          medida_elasticida: ['', [Validators.required]],
          fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
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
        }
      );
    }

    filtrarBusqueda() {
      const termino = this.terminoBusqueda.trim().toLowerCase();
      this.elasticida = this.buscarOriginal.filter(usuario => {
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
            this.visibleUserMeasureDialog = false;


          },
          error: (err) => {
            console.error('Error al guardar la medida elasticida:', err);
            
          }
        });
      }
    }

    prepareNewMedida(usuario: any) {
        this.selectedUser = usuario;
        this.formSave.reset();
        
        const today = new Date();
        this.currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        this.formSave.patchValue({
            id_usuario: usuario.id,
            fecha: this.currentDate
        });
        
        this.visibleUserMeasureDialog = true;
    }

      obtenerMedidasOrdenadas(measures: any[]): any[] {
        return [...measures]
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          .slice(-8);
      }

      compararConAnterior(sortedMeasures: any[], currentIndex: number): string {

        if (currentIndex === 0) return '';
        
        const current = parseFloat(sortedMeasures[currentIndex].medida_elasticida);
        const previous = parseFloat(sortedMeasures[currentIndex - 1].medida_elasticida);
        
        if (current > previous) return 'increase';
        if (current < previous) return 'decrease';
        return ''; 
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
           const parseLocalDate = (dateString: string) => {
          return dateString ? new Date(dateString + 'T00:00:00') : null;
        };
        this.formUpdate.controls['medida_elasticida'].setValue(this.elastic?.medida_elasticida)
        this.formUpdate.controls['id_usuario'].setValue(this.elastic?.id_usuario) 
         this.formUpdate.controls['fecha'].setValue(
          parseLocalDate(this.elastic.fecha)
        );
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
