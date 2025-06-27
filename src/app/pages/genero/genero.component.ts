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
import { Genero } from '../interfaces/genero';
import { GeneroService } from '../service/genero.service';

@Component({
  selector: 'app-genero',
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
  templateUrl: './genero.component.html',
})
export class GeneroComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  genero: Genero[] = [];
  idGenero: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: Genero[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;

  constructor(
    private fb: FormBuilder,
    private generoService: GeneroService,
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
    this.getGenero();
  }

  getGenero() {
    this.generoService.getAllGenero().subscribe(
      data => {
        this.genero = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
    this.genero = termino === '' 
      ? [...this.buscadorFiltrados] 
      : this.buscadorFiltrados.filter(g => g.nombre?.toLowerCase().includes(termino));
  }

  store() {
    this.submitted = true;
  
    if (this.formSave.invalid) {
      this.errorMessageToast();
      return;
    }
  
    const newGenero: any = {
      nombre: this.formSave.value.nombre,
    };

    this.generoService.createGenero(newGenero).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getGenero();
        this.formSave.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error al guardar el género:', err);
        this.errorMessageToast();
      }
    });
  }

  edit(genero: Genero) {
    this.editing = true;
    this.idForUpdate = genero.id;
    this.formUpdate.patchValue({
      nombre: genero.nombre
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

    const updateGenero: Genero = {
      id: this.idForUpdate,
      nombre: this.formUpdate.value.nombre,
    };

    this.generoService.updateGenero(this.idForUpdate, updateGenero).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getGenero();
        this.editing = false;
        this.formUpdate.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error actualizando género:', err);
        this.errorMessageToast();
      }
    });
  }

  delete() {
    this.generoService.deleteGenero(this.idGenero).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getGenero();
        this.EliminadoMessageToasts();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.errorMessageToast();
      }
    });
  }

  showModalDelete(id: number) {
    this.idGenero = id;
    this.visibleDelete = true;
  }

  // Mensajes Toast
  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El género se guardó correctamente' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El género se eliminó correctamente' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar el género' });
  }
}