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
import { Ciudad } from '../interfaces/ciudad';
import { CiudadService } from '../service/ciudad.service';

@Component({
  selector: 'app-ciudad',
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
  templateUrl: './ciudad.component.html',
})
export class CiudadComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  ciudad: Ciudad[] = [];
  idCiudad: number = 0;
  visibleDelete: boolean = false;
  formUpdate!: FormGroup;
  ciuda: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  filtro: string = '';
  buscadorFiltrados: Ciudad[] = [];
  submitted: boolean = false;

  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private ciudadService: CiudadService,
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
    this.getCiudad();
  }

   getCiudad() {
    this.ciudadService.getAllCiudad().subscribe(
      data => {
        this.ciudad = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
  
    if (termino === '') {
    this.ciudad = [...this.buscadorFiltrados];
    } else {
    this.ciudad = this.buscadorFiltrados.filter(user =>
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
        const newCiudad: any = {
          nombre: this.formSave.value.nombre,
        };
    
        this.ciudadService.createCiudad(newCiudad).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getCiudad();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar el grupo:', err);
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
        const updateCiudad: Ciudad = {
          id: this.idForUpdate,
          nombre: this.formUpdate.value.nombre,
        };
  
        this.ciudadService.updateCiudad(this.idForUpdate, updateCiudad).subscribe({
          next: (res) => {
            this.saveMessageToast(); 
            this.getCiudad();
            this.visibleUpdate = false;
            this.idForUpdate = 0;
          },
          error: (err) => {
            this.errorMessageToast(); 
            console.error('Error actualizando torneo:', err);
          }
        });
      }
    }
      
    edit(id: number) {
    
      this.idForUpdate = id;
      this.ciuda = this.ciudad.find(e => e.id == id);
      if (this.ciuda) {
        this.formUpdate.controls['nombre'].setValue(this.ciuda?.nombre)

      }
      this.visibleUpdate = true;
    }
    
    cancelUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }

    delete() {
      this.ciudadService.deleteCiudad(this.idCiudad).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getCiudad()
          this.idCiudad = 0
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
              
    showModalDelete(id: number) {
      this.idCiudad = id;
      this.visibleDelete = true
    }  
     
  }