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
import { Grupo } from '../interfaces/grupo';
import { GrupoService } from '../service/grupo.service';

@Component({
  selector: 'app-grupo',
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
  templateUrl: './grupo.component.html'
})
export class GrupoComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  grupo: Grupo[] = [];
  idGrupo: number = 0;
  visibleDelete: boolean = false;
  formUpdate!: FormGroup;
  grup: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  filtro: string = '';
  buscadorFiltrados: Grupo[] = [];
  submitted: boolean = false;

  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private grupoService: GrupoService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],

      
    });
    this.formUpdate = fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
    });
  }

  ngOnInit(): void {
    this.getGrupo();
  }

   getGrupo() {
    this.grupoService.getAllGrupo().subscribe(
      data => {
        this.grupo = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
  
    if (termino === '') {
    this.grupo = [...this.buscadorFiltrados];
    } else {
    this.grupo = this.buscadorFiltrados.filter(user =>
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
        const newGrupo: any = {
          nombre: this.formSave.value.nombre,
        };
    
        this.grupoService.createGrupo(newGrupo).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getGrupo();
            this.formSave.reset();
            this.submitted = false;
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
        const updateGrupo: Grupo = {
          id: this.idForUpdate,
          nombre: this.formUpdate.value.nombre,
        };
  
        this.grupoService.updateGrupo(this.idForUpdate, updateGrupo).subscribe({
          next: (res) => {
            this.saveMessageToast(); 
            this.getGrupo();
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
      this.grup = this.grupo.find(e => e.id == id);
      if (this.grup) {
        this.formUpdate.controls['nombre'].setValue(this.grup?.nombre)

      }
      this.visibleUpdate = true;
    }
    
    cancelUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }

    delete() {
      this.grupoService.deleteGrupo(this.idGrupo).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getGrupo()
          this.idGrupo = 0
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
              
    showModalDelete(id: number) {
      this.idGrupo = id;
      this.visibleDelete = true
    }  

        
  }
