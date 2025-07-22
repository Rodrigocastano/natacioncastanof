import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { RepresentanteNadador } from '../interfaces/representantenadador';
import { RepresentantenadadorService } from '../service/representantenadador.service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
import { RepresentanteService } from '../service/representante.service';
import { Representante } from '../interfaces/representante';
import { CommonModule } from '@angular/common';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-representantenadador',
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
    CalendarModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './representantenadador.component.html',
})
export class RepresentantenadadorComponent implements OnInit{
  
  formSave!: FormGroup;
  visibleSave: boolean = false;
  representanteNadador: RepresentanteNadador[] = [];
  idRepresentanteNadador: number = 0;
  visibleDelete: boolean = false;

  formUpdate!: FormGroup;
  reprenada: any
  idForUpdate: boolean = false;
  visibleUpdate: boolean = false;
  usuarios: Usuario[] = [];
  representante:Representante[]=[];

  expandedRows = {};
  cols: any[] = [];
  expanded: boolean = false;
  msgs: ToastMessageOptions[] | null = [];

  submitted: boolean = false;
  loading: boolean = true;

  terminoBusqueda: string = '';
  buscarOriginal: RepresentanteNadador[] = [];

    constructor(
        private fb: FormBuilder,
        private representantenadadorService: RepresentantenadadorService,
        private usuarioService: UsuarioService,
        private representanteService: RepresentanteService,
        private messageService: MessageService
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          id_representante: ['', [Validators.required]],

          
        });
        this.formUpdate = fb.group({
          id_usuario: ['', [Validators.required]],
          id_representante: ['', [Validators.required]],
        });
    }
  
    ngOnInit(): void {
      this.getRepresentanteNadador();
      this.getUsuarios();
      this.getRepresentante();
    }

    getRepresentanteNadador() {
      this.representantenadadorService.getAllRepresentanteNadador().subscribe({
        next: data => {
          this.representanteNadador = data;
          this.buscarOriginal = data; 
          this.loading = false;
        },
        error: error => {
          if (error.status === 404) {
            this.representanteNadador = [];
          }
          console.error('Error al obtener los datos:', error);
        }
      });
    }

    getUsuarios() {
      this.usuarioService.getAllUsuarios().subscribe(
        data => {
          this.usuarios = data.map((usuario: any) => ({
            ...usuario,
            display: `${usuario.nombre} ${usuario.apellido} - ${usuario.cedula}`
          }));
          console.log(this.usuarios);
        },
        error => {
          console.error('Error al obtener usuarios:', error);
        }
      );
    }
    
    getRepresentante() {
      this.representanteService.getAllRepresentante().subscribe(
        data => {
          this.representante = data.map((representante: any) => ({
            ...representante,
            displayRepresen: `${representante.nombre} ${representante.apellido} - ${representante.cedula}`
          }));
          console.log(this.representante);
        }
      );
    }

    filtrarBusqueda() {
      const termino = this.terminoBusqueda.trim().toLowerCase();
      this.representanteNadador = this.buscarOriginal.filter(usuario => {
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
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Por favor, completa todos los campos obligatorios.',
          });
          this.formSave.markAllAsTouched();
          return;
        }

        if (this.formSave.valid) {
          const newRepresentante: any = {
            id_representante: this.formSave.value.id_representante,
            id_usuario: this.formSave.value.id_usuario,
          };

          this.representantenadadorService.createRepresentanteNadador(newRepresentante).subscribe({
            next: () => {
              this.saveMessageToast();
              this.getRepresentanteNadador();
              this.visibleSave = false;
            },
            error: (err) => {
              console.error('Error al guardar:', err);

              if (err.status === 422 && err.error?.message?.includes('ya está asignado')) {
                this.errorAlGuardarNadador();
              } else {
                this.errorAlGuardarDatos();
              }
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

      errorAlGuardarDatos() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar el representante del nadador.' });
      }

      errorAlGuardarNadador() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Este nadador ya está asignado a este representante.' });
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

      update() 
      {
          if (this.formUpdate.invalid) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Por favor, completa todos los campos obligatorios.',
            });
            this.formUpdate.markAllAsTouched();
            return;
          }

          if (this.formUpdate.valid) {
            const updateRepresentante: RepresentanteNadador = {
              id: this.reprenada.id,
              id_representante: this.formUpdate.value.id_representante,
              id_usuario: this.formUpdate.value.id_usuario,
            };

            this.representantenadadorService.updateRepresentanteNadador(this.reprenada.id, updateRepresentante).subscribe({
              next: () => {
                this.getRepresentanteNadador();
                this.visibleUpdate = false;
                this.saveMessageToast();
              },
              error: (err) => {
                console.error('Error actualizando representante-nadador:', err);

                if (err.status === 422 && err.error?.message?.includes('ya está asignado')) {
                  this.errorAlGuardarNadador();
                } else {
                  this.errorAlGuardarDatos();
                }
              }
            });
          }
      }


      edit(representanteId: any) {
        this.idForUpdate = true;
        this.reprenada = representanteId;
      
        if (this.reprenada) {
          this.formUpdate.controls['id_usuario'].setValue(this.reprenada?.id_usuario);   
          this.formUpdate.controls['id_representante'].setValue(this.reprenada?.id_representante);   
        }
        this.visibleUpdate = true;
      }
      
      canceUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }

      delete() {
        this.representantenadadorService.deleteRepresentanteNadador(this.idRepresentanteNadador).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getRepresentanteNadador(); 
            this.idRepresentanteNadador = 0;
            this.EliminadoMessageToasts(); 
          },
          error: (err) => {
            console.error('Error al eliminar', err);
            this.errorMessageToast();
          }
        });
      }
      
      showModalDelete(id_usuario: number) {
        this.idRepresentanteNadador = id_usuario;
        this.visibleDelete = true
      }

}

