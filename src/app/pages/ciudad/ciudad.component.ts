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
import { Ciudad } from '../interfaces/ciudad';
import { CiudadService } from '../service/ciudad.service';

@Component({
  selector: 'app-ciudad',
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
  templateUrl: './ciudad.component.html',
})
export class CiudadComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  ciudad: Ciudad[] = [];
  idCiudad: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: Ciudad[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;

  constructor(
    private fb: FormBuilder,
    private ciudadService: CiudadService,
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
    this.getCiudad();
  }

  getCiudad() {
    this.ciudadService.getAllCiudad().subscribe(
      data => {
        this.ciudad = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
    this.ciudad = termino === '' 
      ? [...this.buscadorFiltrados] 
      : this.buscadorFiltrados.filter(c => c.nombre?.toLowerCase().includes(termino));
  }

  store() {
    this.submitted = true;

    if (this.formSave.invalid) {
      this.errorMessageToast();
      return;
    }

    const newCiudad: any = {
      nombre: this.formSave.value.nombre,
    };

    this.ciudadService.createCiudad(newCiudad).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getCiudad();
        this.formSave.reset();
        this.submitted = false;
      },
      error: (err) => {
        
        if (err.status === 409) {
          this.errorIngresoMessageToast();
        } else {
          this.errorMessageToast();
        }
      }
    });
  }

  edit(ciudad: Ciudad) {
    this.editing = true;
    this.idForUpdate = ciudad.id;
    this.formUpdate.patchValue({
      nombre: ciudad.nombre
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

    const updateCiudad: Ciudad = {
      id: this.idForUpdate,
      nombre: this.formUpdate.value.nombre,
    };

    this.ciudadService.updateCiudad(this.idForUpdate, updateCiudad).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getCiudad();
        this.editing = false;
        this.formUpdate.reset();
        this.submitted = false;

      },
      error: (err) => {
        if (err.status === 409) {
          this.errorIngresoMessageToast();
        }  else {
          this.errorMessageToast();
        }
      }
    });
  }

  delete() {
    this.ciudadService.deleteCiudad(this.idCiudad).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getCiudad();
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
    this.visibleDelete = true;
  }

  // Mensajes Toast
  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'La ciudad se guardó correctamente' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'La ciudad se eliminó correctamente' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un problema con la ciudad' });
  }

  errorIngresoMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ya existe una ciudad con ese nombre registrado' });
  }
}