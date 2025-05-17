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
import { CategoriaPrueba } from '../interfaces/categoriaprueba';
import { CategoriapruebaService } from '../service/categoriaprueba.service';

@Component({
  selector: 'app-categoriaprueba',
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
  templateUrl: './categoriaprueba.component.html',
})
export class CategoriapruebaComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  categoriaPrueba: CategoriaPrueba[] = [];
  idCategoriaPrueba: number = 0;
  visibleDelete: boolean = false;
  formUpdate!: FormGroup;
  Categoria: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  filtro: string = '';
  buscadorFiltrados: CategoriaPrueba[] = [];
  submitted: boolean = false;

  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private categoriapruebaService: CategoriapruebaService,
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
    this.getCategoriapruebaService();
  }

   getCategoriapruebaService() {
    this.categoriapruebaService.getAllCategoriaPrueba().subscribe(
      data => {
        this.categoriaPrueba = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
  
    if (termino === '') {
    this.categoriaPrueba = [...this.buscadorFiltrados];
    } else {
    this.categoriaPrueba = this.buscadorFiltrados.filter(user =>
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
        
            this.categoriapruebaService.createCategoriaPrueba(newCategoria).subscribe({
              next: () => {
                this.saveMessageToast();
                this.getCategoriapruebaService();
                this.visibleSave = false;
              },
              error: (err) => {
                console.error('Error al guardar la categoria de prueba:', err);
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
            const updateAreaNado: CategoriaPrueba = {
              id: this.idForUpdate,
              nombre: this.formUpdate.value.nombre,
            };
      
            this.categoriapruebaService.updateCategoriaPrueba(this.idForUpdate, updateAreaNado).subscribe({
              next: (res) => {
                this.saveMessageToast(); 
                this.getCategoriapruebaService();
                this.visibleUpdate = false;
                this.idForUpdate = 0;
              },
              error: (err) => {
                this.errorMessageToast(); 
                console.error('Error actualizando la categoría de prueba:', err);
              }
            });
          }
        }
          
        edit(id: number) {
        
          this.idForUpdate = id;
          this.Categoria = this.categoriaPrueba.find(e => e.id == id);
          if (this.Categoria) {
            this.formUpdate.controls['nombre'].setValue(this.Categoria?.nombre)
    
          }
          this.visibleUpdate = true;
        }
        
        cancelUpdate() {
          this.visibleUpdate = false;
          this.cancelMessageToast();
        }
    
        delete() {
          this.categoriapruebaService.deleteCategoriaPrueba(this.idCategoriaPrueba).subscribe({
            next: () => {
              this.visibleDelete = false;
              this.getCategoriapruebaService()
              this.idCategoriaPrueba = 0
              this.EliminadoMessageToasts(); 
            },
            error: (err) => {
              console.error('Error al eliminar:', err);
              this.errorMessageToast();
            }
          });
        }
                  
        showModalDelete(id: number) {
          this.idCategoriaPrueba = id;
          this.visibleDelete = true
        }    

}
