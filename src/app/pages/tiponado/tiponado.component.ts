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
import { TipoNado } from '../interfaces/tiponado';
import { TiponadoService } from '../service/tiponado.service';

@Component({
  selector: 'app-tiponado',
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
  templateUrl: './tiponado.component.html',
})
export class TiponadoComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  tipoNado: TipoNado[] = [];
  idTipoNado: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: TipoNado[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;

  constructor(
    private fb: FormBuilder,
    private tiponadoService: TiponadoService,
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
    this.getTipoNado();
  }

  getTipoNado() {
    this.tiponadoService.getAllTipoNado().subscribe(
      data => {
        this.tipoNado = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
    this.tipoNado = termino === '' 
      ? [...this.buscadorFiltrados] 
      : this.buscadorFiltrados.filter(t => t.nombre?.toLowerCase().includes(termino));
  }

  store() {
    this.submitted = true;

    if (this.formSave.invalid) {
      this.errorMessageToast();
      return;
    }

    const newTipoNado: any = {
      nombre: this.formSave.value.nombre,
    };

    this.tiponadoService.createTipoNado(newTipoNado).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getTipoNado();
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

  edit(tipo: TipoNado) {
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

    const updateTipoNado: TipoNado = {
      id: this.idForUpdate,
      nombre: this.formUpdate.value.nombre,
    };

    this.tiponadoService.updateTipoNado(this.idForUpdate, updateTipoNado).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getTipoNado();
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
    this.tiponadoService.deleteTipoNado(this.idTipoNado).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getTipoNado();
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
    this.visibleDelete = true;
  }

  // Mensajes Toast
  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El tipo de nado se guardó correctamente' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El tipo de nado se eliminó correctamente' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un problema al procesar el tipo de nado' });
  }

  errorIngresoMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un tipo de nado con ese nombre registrado' });
  }

}