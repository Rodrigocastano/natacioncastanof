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
import { AreaNado } from '../interfaces/areanado';
import { AreanadoService } from '../service/areanado.service';

@Component({
  selector: 'app-areanado',
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
  templateUrl: './areanado.component.html',
})
export class AreanadoComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  areaNado: AreaNado[] = [];
  idAreaNado: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: AreaNado[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;

  constructor(
    private fb: FormBuilder,
    private areanadoService: AreanadoService,
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
    this.getAreaNado();
  }

  getAreaNado() {
    this.areanadoService.getAllAreaNado().subscribe(
      data => {
        this.areaNado = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
    this.areaNado = termino === '' 
      ? [...this.buscadorFiltrados] 
      : this.buscadorFiltrados.filter(a => a.nombre?.toLowerCase().includes(termino));
  }

  store() {
    this.submitted = true;
  
    if (this.formSave.invalid) {
      this.errorMessageToast();
      return;
    }
  
    const newAreaNado: any = {
      nombre: this.formSave.value.nombre,
    };

    this.areanadoService.createAreaNado(newAreaNado).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getAreaNado();
        this.formSave.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error al guardar el área de nado:', err);
        this.errorMessageToast();
      }
    });
  }

  edit(area: AreaNado) {
    this.editing = true;
    this.idForUpdate = area.id;
    this.formUpdate.patchValue({
      nombre: area.nombre
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

    const updateAreaNado: AreaNado = {
      id: this.idForUpdate,
      nombre: this.formUpdate.value.nombre,
    };

    this.areanadoService.updateAreaNado(this.idForUpdate, updateAreaNado).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getAreaNado();
        this.editing = false;
        this.formUpdate.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error actualizando área de nado:', err);
        this.errorMessageToast();
      }
    });
  }

  delete() {
    this.areanadoService.deleteAreaNado(this.idAreaNado).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getAreaNado();
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
    this.visibleDelete = true;
  }

  // Mensajes Toast
  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El área de nado se guardó correctamente' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El área de nado se eliminó correctamente' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar el área de nado' });
  }
}