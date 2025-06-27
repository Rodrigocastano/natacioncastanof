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
import { TipoPago } from '../interfaces/tipoPagos';
import { TipopagoService } from '../service/tipopago.service';

@Component({
  selector: 'app-tipopago',
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
  templateUrl: './tipopago.component.html',
})
export class TipopagoComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  tipoPago: TipoPago[] = [];
  idTipoPago: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: TipoPago[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;

  constructor(
    private fb: FormBuilder,
    private tipopagoService: TipopagoService,
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
    this.getTipoPago();
  }

  getTipoPago() {
    this.tipopagoService.getAllTipoPago().subscribe(
      data => {
        this.tipoPago = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
    this.tipoPago = termino === '' 
      ? [...this.buscadorFiltrados] 
      : this.buscadorFiltrados.filter(a => a.nombre?.toLowerCase().includes(termino));
  }

  store() {
    this.submitted = true;
  
    if (this.formSave.invalid) {
      this.errorMessageToast();
      return;
    }
  
    const newTipoPago: any = {
      nombre: this.formSave.value.nombre,
    };

    this.tipopagoService.createTipoPago(newTipoPago).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getTipoPago();
        this.formSave.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error al guardar el tipo de pago:', err);
        this.errorMessageToast();
      }
    });
  }

  edit(tipo: TipoPago) {
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

    const updateTipoPago: TipoPago = {
      id: this.idForUpdate,
      nombre: this.formUpdate.value.nombre,
    };

    this.tipopagoService.updateTipoPago(this.idForUpdate, updateTipoPago).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getTipoPago();
        this.editing = false;
        this.formUpdate.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error actualizando tipo de pago:', err);
        this.errorMessageToast();
      }
    });
  }

  delete() {
    this.tipopagoService.deleteTipoPago(this.idTipoPago).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getTipoPago();
        this.EliminadoMessageToasts();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.errorMessageToast();
      }
    });
  }

  showModalDelete(id: number) {
    this.idTipoPago = id;
    this.visibleDelete = true;
  }

  // Mensajes Toast
  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El tipo de pago se guardó correctamente' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El registro de tipo de pago se eliminó correctamente' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al realizar la tipo de pago' });
  }
}