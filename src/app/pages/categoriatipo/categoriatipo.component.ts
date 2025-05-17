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
import { CategoriaTipo } from '../interfaces/categoriatipo';
import { CategoriatipoService } from '../service/categoriatipo.service';

@Component({
  selector: 'app-categoriatipo',
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
  templateUrl: './categoriatipo.component.html',
})
export class CategoriatipoComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  categoriaTipo: CategoriaTipo[] = [];
  idCategoriaTipo: number = 0;
  visibleDelete: boolean = false;
  formUpdate!: FormGroup;
  categoria: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  filtro: string = '';
  buscadorFiltrados: CategoriaTipo[] = [];
  submitted: boolean = false;

  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private categoriatipoService: CategoriatipoService,
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
    this.getCategoriaTipo();
  }

   getCategoriaTipo() {
    this.categoriatipoService.getAllCategoriaTipo().subscribe(
      data => {
        this.categoriaTipo = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
  
    if (termino === '') {
    this.categoriaTipo = [...this.buscadorFiltrados];
    } else {
    this.categoriaTipo = this.buscadorFiltrados.filter(user =>
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
            const newCategoria: any = {
              nombre: this.formSave.value.nombre,
            };
        
            this.categoriatipoService.createCategoriaTipo(newCategoria).subscribe({
              next: () => {
                this.saveMessageToast();
                this.getCategoriaTipo();
                this.visibleSave = false;
              },
              error: (err) => {
                console.error('Error al guardar el tipo de categoría:', err);
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
            const updateCategoria: CategoriaTipo = {
              id: this.idForUpdate,
              nombre: this.formUpdate.value.nombre,
            };
      
            this.categoriatipoService.updateCategoriaTipo(this.idForUpdate, updateCategoria).subscribe({
              next: (res) => {
                this.saveMessageToast(); 
                this.getCategoriaTipo();
                this.visibleUpdate = false;
                this.idForUpdate = 0;
              },
              error: (err) => {
                this.errorMessageToast(); 
                console.error('Error actualizando tipo de categoria:', err);
              }
            });
          }
        }
          
        edit(id: number) {
        
          this.idForUpdate = id;
          this.categoria = this.categoriaTipo.find(e => e.id == id);
          if (this.categoria) {
            this.formUpdate.controls['nombre'].setValue(this.categoria?.nombre)
    
          }
          this.visibleUpdate = true;
        }
        
        cancelUpdate() {
          this.visibleUpdate = false;
          this.cancelMessageToast();
        }
    
        delete() {
          this.categoriatipoService.deleteCategoriaTipo(this.idCategoriaTipo).subscribe({
            next: () => {
              this.visibleDelete = false;
              this.getCategoriaTipo()
              this.idCategoriaTipo = 0
              this.EliminadoMessageToasts(); 
            },
            error: (err) => {
              console.error('Error al eliminar:', err);
              this.errorMessageToast();
            }
          });
        }
                  
        showModalDelete(id: number) {
          this.idCategoriaTipo = id;
          this.visibleDelete = true
        }  
    
            
      }
    