import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TipoNado } from '../interfaces/tiponado';
import { TiponadoService } from '../service/tiponado.service';

@Component({
  selector: 'app-tiponado',
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
    SelectModule,
    DialogModule,
    DropdownModule,
    DatePickerModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './tiponado.component.html',
})
export class TiponadoComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  tipoNado: TipoNado[] = [];
  idTipoNado: number = 0;
  visibleDelete: boolean = false;
  formUpdate!: FormGroup;
  tipo: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  filtro: string = '';
  buscadorFiltrados: TipoNado[] = [];
  submitted: boolean = false;

  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private tiponadoService: TiponadoService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      nombre: ['', Validators.required]

      
    });
    this.formUpdate = fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getTipoNado();
  }

   getTipoNado() {
    this.tiponadoService.getAllTipoNado().subscribe(
      data => {
        this.tipoNado = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
  
    if (termino === '') {
    this.tipoNado = [...this.buscadorFiltrados];
    } else {
    this.tipoNado = this.buscadorFiltrados.filter(user =>
      user.nombre?.toLowerCase().includes(termino)
    );
    }
    }

     store() {
          this.submitted = true;
        
          if (this.formSave.invalid) {
            this.errorMessageToast();
            this.formSave.markAllAsTouched();
            return;
          }
        
          if (this.formSave.valid) {
            const newGenero: any = {
              nombre: this.formSave.value.nombre,
            };
        
            this.tiponadoService.createTipoNado(newGenero).subscribe({
              next: () => {
                this.saveMessageToast();
                this.getTipoNado();
                this.visibleSave = false;
              },
              error: (err) => {
                console.error('Error al guardar el tipo de nado:', err);
              }
            });
          }
        }
        
        cancelSave() {
          this.visibleSave = false;
          this.cancelMessageToast();
        }
        
        showSaveDialog() {
          this.formSave.reset();
          this.visibleSave = true;
        }
        
        saveMessageToast() {
          this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Guardado correctamente' });
        }
        
        EliminadoMessageToasts() {
          this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Eliminado correctamente' });
        }
        
        cancelMessageToast() {
          this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Cancelado!...' });
        }
           
        errorMessageToast() {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar la datos.' });
        }
    
        update() {
          if (this.formUpdate.invalid) {
            this.errorMessageToast(); 
            this.formUpdate.markAllAsTouched();
            return;
          }
      
          if (this.formUpdate.valid) {
            const updateGenero: TipoNado = {
              id: this.idForUpdate,
              nombre: this.formUpdate.value.nombre,
            };
      
            this.tiponadoService.updateTipoNado(this.idForUpdate, updateGenero).subscribe({
              next: (res) => {
                this.saveMessageToast(); 
                this.getTipoNado();
                this.visibleUpdate = false;
                this.idForUpdate = 0;
              },
              error: (err) => {
                this.errorMessageToast(); 
                console.error('Error actualizando tipo de nado:', err);
              }
            });
          }
        }
          
        edit(id: number) {
        
          this.idForUpdate = id;
          this.tipo = this.tipoNado.find(e => e.id == id);
          if (this.tipo) {
            this.formUpdate.controls['nombre'].setValue(this.tipo?.nombre)
    
          }
          this.visibleUpdate = true;
        }
        
        cancelUpdate() {
          this.visibleUpdate = false;
          this.cancelMessageToast();
        }
    
        delete() {
          this.tiponadoService.deleteTipoNado(this.idTipoNado).subscribe({
            next: () => {
              this.visibleDelete = false;
              this.getTipoNado()
              this.idTipoNado = 0
              this.EliminadoMessageToasts(); 
            },
            error: (err) => {
              console.error('Error al eliminar:', err);
              this.errorMessageToast();
            }
          });
        }
                  
        showModalDelete(id: number) {
          this.idTipoNado = id;
          this.visibleDelete = true
        }  
         
      }
