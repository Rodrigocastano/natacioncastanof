import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  standalone: true,
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
export class CategoriapruebaComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  categoriaPrueba: CategoriaPrueba[] = [];
  idCategoriaPrueba: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: CategoriaPrueba[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;

  constructor(
    private fb: FormBuilder,
    private categoriapruebaService: CategoriapruebaService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      nombre: ['', Validators.required]
    });
    this.formUpdate = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCategoriapruebaService();
  }

  getCategoriapruebaService() {
    this.categoriapruebaService.getAllCategoriaPrueba().subscribe(
      data => {
        this.categoriaPrueba = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
    this.categoriaPrueba = termino === '' 
      ? [...this.buscadorFiltrados] 
      : this.buscadorFiltrados.filter(a => a.nombre?.toLowerCase().includes(termino));
  }

  store() {
    this.submitted = true;
  
    if (this.formSave.invalid) {
      this.errorMessageToast();
      return;
    }
  
    const newCategoria: any = {
      nombre: this.formSave.value.nombre,
    };

    this.categoriapruebaService.createCategoriaPrueba(newCategoria).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getCategoriapruebaService();
        this.formSave.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error al guardar la categoría de prueba:', err);
        this.errorMessageToast();
      }
    });
  }

  edit(categoria: CategoriaPrueba) {
    this.editing = true;
    this.idForUpdate = categoria.id;
    this.formUpdate.patchValue({
      nombre: categoria.nombre
    });
  }

  cancelEdit() {
    this.editing = false;
    this.formUpdate.reset();
    this.cancelMessageToast();
  }

  update() {
    this.submitted = true;
    
    if (this.formUpdate.invalid) {
      this.errorMessageToast();
      return;
    }

    const updateCategoria: CategoriaPrueba = {
      id: this.idForUpdate,
      nombre: this.formUpdate.value.nombre,
    };

    this.categoriapruebaService.updateCategoriaPrueba(this.idForUpdate, updateCategoria).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getCategoriapruebaService();
        this.editing = false;
        this.formUpdate.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error actualizando categoría de prueba:', err);
        this.errorMessageToast();
      }
    });
  }

  delete() {
    this.categoriapruebaService.deleteCategoriaPrueba(this.idCategoriaPrueba).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getCategoriapruebaService();
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
    this.visibleDelete = true;
  }

  // Mensajes Toast
  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'La categoría de prueba se guardó correctamente' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'La categoría de prueba se eliminó correctamente' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar la categoría de prueba' });
  }
}