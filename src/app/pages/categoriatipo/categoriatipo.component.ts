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
import { CategoriaTipo } from '../interfaces/categoriatipo';
import { CategoriatipoService } from '../service/categoriatipo.service';

@Component({
  selector: 'app-categoriatipo',
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
  templateUrl: './categoriatipo.component.html',
})
export class CategoriatipoComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  categoriaTipo: CategoriaTipo[] = [];
  idCategoriaTipo: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: CategoriaTipo[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;

  constructor(
    private fb: FormBuilder,
    private categoriatipoService: CategoriatipoService,
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
    this.getCategoriaTipo();
  }

  getCategoriaTipo() {
    this.categoriatipoService.getAllCategoriaTipo().subscribe(
      data => {
        this.categoriaTipo = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
    this.categoriaTipo = termino === '' 
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

    this.categoriatipoService.createCategoriaTipo(newCategoria).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getCategoriaTipo();
        this.formSave.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error al guardar el tipo de categoría:', err);
        this.errorMessageToast();
      }
    });
  }

  edit(tipo: CategoriaTipo) {
    this.editing = true;
    this.idForUpdate = tipo.id;
    this.formUpdate.patchValue({
      nombre: tipo.nombre
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

    const updateCategoria: CategoriaTipo = {
      id: this.idForUpdate,
      nombre: this.formUpdate.value.nombre,
    };

    this.categoriatipoService.updateCategoriaTipo(this.idForUpdate, updateCategoria).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getCategoriaTipo();
        this.editing = false;
        this.formUpdate.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error actualizando tipo de categoría:', err);
        this.errorMessageToast();
      }
    });
  }

  delete() {
    this.categoriatipoService.deleteCategoriaTipo(this.idCategoriaTipo).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getCategoriaTipo();
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
    this.visibleDelete = true;
  }

  // Mensajes Toast
  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El tipo de categoría se guardó correctamente' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El tipo de categoría se eliminó correctamente' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Hubo un problema al procesar el tipo de categoría' });
  }
}