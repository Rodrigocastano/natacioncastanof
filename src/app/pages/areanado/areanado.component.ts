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
import { AreaNado } from '../interfaces/areanado';
import { AreanadoService } from '../service/areanado.service';

@Component({
  selector: 'app-areanado',
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
  templateUrl: './areanado.component.html',
})
export class AreanadoComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  areaNado: AreaNado[] = [];
  idAreaNado: number = 0;
  visibleDelete: boolean = false;
  formUpdate!: FormGroup;
  Area: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  filtro: string = '';
  buscadorFiltrados: AreaNado[] = [];
  submitted: boolean = false;

  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private areanadoService: AreanadoService,
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
    this.getAreaNado();
  }

   getAreaNado() {
    this.areanadoService.getAllAreaNado().subscribe(
      data => {
        this.areaNado = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
  
    if (termino === '') {
    this.areaNado = [...this.buscadorFiltrados];
    } else {
    this.areaNado = this.buscadorFiltrados.filter(user =>
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
        const newAreaNado: any = {
          nombre: this.formSave.value.nombre,
        };
    
        this.areanadoService.createAreaNado(newAreaNado).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getAreaNado();
            this.formSave.reset();
            this.visibleSave = false;
            this.submitted = false;
          },
          error: (err) => {
            console.error('Error al guardar el área nado:', err);
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
        const updateAreaNado: AreaNado = {
          id: this.idForUpdate,
          nombre: this.formUpdate.value.nombre,
        };
  
        this.areanadoService.updateAreaNado(this.idForUpdate, updateAreaNado).subscribe({
          next: (res) => {
            this.saveMessageToast(); 
            this.getAreaNado();
            this.visibleUpdate = false;
            this.idForUpdate = 0;
          },
          error: (err) => {
            this.errorMessageToast(); 
            console.error('Error actualizando area del nado:', err);
          }
        });
      }
    }
      
    edit(id: number) {
    
      this.idForUpdate = id;
      this.Area = this.areaNado.find(e => e.id == id);
      if (this.Area) {
        this.formUpdate.controls['nombre'].setValue(this.Area?.nombre)

      }
      this.visibleUpdate = true;
    }
    
    cancelUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }

    delete() {
      this.areanadoService.deleteAreaNado(this.idAreaNado).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getAreaNado()
          this.idAreaNado = 0
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
              
    showModalDelete(id: number) {
      this.idAreaNado = id;
      this.visibleDelete = true
    }  

        
  }
