import { Component, OnInit } from '@angular/core';
import { PagoEntrenadoresService } from '../service/pago-entrenadores.service';
import { pagoEntrenadores } from '../interfaces/pagoentrenadores';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { EntrenadorService } from '../service/entrenador.service';
import { Entrenador } from '../interfaces/entrenador';

@Component({
  selector: 'app-pago-entrenadores',
  templateUrl: './pago-entrenadores.component.html',
  providers: [MessageService],
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
    RadioButtonModule,
    TextareaModule,
    MessageModule,
    ToastModule,
    ReactiveFormsModule,
    DatePickerModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
})
export class PagoEntrenadoresComponent implements OnInit {
  pagos: any[] = [];
  pagosOriginal: any[] = [];
  usuarios: Entrenador[] = [];
  expandedRows = {};
  loading: boolean = true;
  terminoBusqueda: string = '';
  formSave!: FormGroup;
  formUpdate!: FormGroup;
  visibleSave = false;
  visibleUpdate = false;
  visibleDelete = false;
  idPagoEliminar: number = 0;
  medi: any;

  submitted = false;
  maxDate: Date = new Date();
  fechaActual: Date = new Date();


  constructor(
    private pagoService: PagoEntrenadoresService,
    private usuarioService: EntrenadorService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      id_usuario: ['', Validators.required],
      monto: ['', Validators.required],
      fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      estado_funcional: [1],  // o según necesites
    });

    this.formUpdate = this.fb.group({
      id_usuario: ['', Validators.required],
      monto: ['', Validators.required],
      fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      estado_funcional: [1],
    });
  }

  ngOnInit(): void {
    this.getPagos();
    this.getUsuarios();
  }

      getUsuarios() {
      this.usuarioService.getAllEntrenadore().subscribe(
        data => {
          this.usuarios = data.map((usuario: any) => ({
            ...usuario,
            display: `${usuario.nombre} ${usuario.apellido} - ${usuario.cedula}`
          }));
          console.log(this.usuarios);
        }
      );
    }

  getPagos() {
    this.pagoService.getAllPagoEntrenadore().subscribe({
      next: (res) => {
        // Asumo que backend ya agrupa por usuario como en tu método PHP
        this.pagos = res.data;
        this.pagosOriginal = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los pagos' });
        console.error(err);
      }
    });
  }

  filtrarBusqueda() {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    this.pagos = this.pagosOriginal.filter(user => 
      user.nombre?.toLowerCase().includes(termino) ||
      user.apellido?.toLowerCase().includes(termino) ||
      user.cedula?.toLowerCase().includes(termino) ||
      user.genero?.toLowerCase().includes(termino)
    );
  }

  abrirExpand(event: TableRowExpandEvent) {
    this.messageService.add({ severity: 'info', summary: 'Expandido', detail: event.data.nombre, life: 2000 });
  }

  cerrarCollapse(event: TableRowCollapseEvent) {
    this.messageService.add({ severity: 'success', summary: 'Colapsado', detail: event.data.nombre, life: 2000 });
  }

  showSaveDialog() {
    this.formSave.reset();
    this.visibleSave = true;
  }

  store() {
    this.submitted = true;
    if (this.formSave.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete los campos requeridos.' });
      this.formSave.markAllAsTouched();
      return;
    }

    const nuevoPago = {
      ...this.formSave.value,
      fecha: this.formatDate(this.formSave.value.fecha),
    };

    this.pagoService.createPagoEntrenadore(nuevoPago).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Pago registrado correctamente.' });
        this.getPagos();
        this.visibleSave = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el pago.' });
        console.error(err);
      }
    });
  }

  edit(pago: any) {
    this.medi = pago;
    this.formUpdate.patchValue({
      id_usuario: pago.id_usuario,
      monto: pago.monto,
      fecha: new Date(pago.fecha),
      estado_funcional: pago.estado_funcional,
    });
    this.visibleUpdate = true;
  }

  update() {
    if (this.formUpdate.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete los campos requeridos.' });
      this.formUpdate.markAllAsTouched();
      return;
    }

    const updatePago = {
      ...this.formUpdate.value,
      fecha: this.formatDate(this.formUpdate.value.fecha),
    };

    this.pagoService.updatePagoEntrenadore(this.medi.id, updatePago).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Pago actualizado correctamente.' });
        this.getPagos();
        this.visibleUpdate = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el pago.' });
        console.error(err);
      }
    });
  }

  showModalDelete(id: number) {
    this.idPagoEliminar = id;
    this.visibleDelete = true;
  }

  delete() {
    this.pagoService.deletePlanPagoEntrenadore(this.idPagoEliminar).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Pago eliminado correctamente.' });
        this.getPagos();
        this.visibleDelete = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el pago.' });
        console.error(err);
      }
    });
  }

  cancelSave() {
    this.visibleSave = false;
  }

  cancelUpdate() {
    this.visibleUpdate = false;
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }
}
