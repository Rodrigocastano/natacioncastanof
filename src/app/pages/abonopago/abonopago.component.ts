import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AbonopagoService } from '../service/abonopago.service';
import { AbonoPago } from '../interfaces/abonopago';
import { PagoService } from '../service/pago.service';
import { Pago } from '../interfaces/pago';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-abonopago',
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
  providers: [MessageService],
  templateUrl: './abonopago.component.html',
})
export class AbonopagoComponent implements OnInit{
  
      formSave!: FormGroup;
      visibleSave: boolean = false;
      abonoPago: AbonoPago[] = [];
      idAbonoPago: number = 0;
      visibleDelete: boolean = false;

      formUpdate!: FormGroup;
      abonoPa: any
      idForUpdate: boolean = false;
      visibleUpdate: boolean = false;
      pago: Pago[] = [];
      expandedRows = {};
      cols: any[] = [];
      expanded: boolean = false;
      msgs: ToastMessageOptions[] | null = [];

      submitted: boolean = false;
      maxDate: Date = new Date();
      fechaActual: Date = new Date();
      loading: boolean = true;
      abonoPagoSelect: any[] = [];

      terminoBusqueda: string = '';
      buscarOriginal: AbonoPago[] = [];
      pagosParaEditar: Pago[] = [];

      pagoTodos: any[] = [];       // Para edición
      pagoPendientes: any[] = [];  // Para registro de nuevos abonos


      constructor(
        private fb: FormBuilder,
        private pagoService: PagoService,
        private abonopagoService: AbonopagoService,
        private messageService: MessageService
      ) {
        this.formSave = this.fb.group({
          id_registro_pago: ['', [Validators.required]],
          monto: ['', [Validators.required]],
          fecha: []
          
        });
        this.formUpdate = fb.group({
          id_registro_pago: ['', [Validators.required]],
          monto: ['', [Validators.required]],
          fecha: []
        });
      }
  
      ngOnInit(): void {
        this.getAbonoPago();
        this.getPagos();
        this.getPendientes();

          setInterval(() => {
            this.getPendientes();
          }, 30000);

          setInterval(() => {
            this.getPagos();
          }, 30000);
      }

      getAbonoPago() {
        this.abonopagoService.getAllAbonoPago().subscribe(data => {

          this.abonoPago = data.data;
          this.buscarOriginal = data.data;
          this.loading = false;
          this.abonoPagoSelect = [];
          data.data.forEach((usuario: any) => {
            usuario.abonosPagos.forEach((abono: any) => {
              this.abonoPagoSelect.push({
                id: abono.id_registro_pago,
                display: `${usuario.nombre} ${usuario.apellido} - ${abono.fecha}`
              });
            });
          });
        });
      }

      getPagos() {
        this.pagoService.getAllRegistroPago().subscribe(data => {
          this.pagoTodos = data.map(p => ({
            ...p,
            id_registro_pago: p.id,
            displayPago: `${p.nombre} ${p.apellido} | ${p.fecha} | Monto: $${p.monto} | Abonado: $${p.monto_abonado}`
          }));
          console.log('Todos los pagos para editar:', this.pagoTodos);
        });
      }

      getPendientes() {
        this.pagoService.getAllRegistroPendiente().subscribe(data => {
          this.pagoPendientes = data.map(p => ({
            ...p,
            id_registro_pago: p.id,
            displayPendiente: `${p.nombre} ${p.apellido} | ${p.fecha} | Monto: $${p.monto} | Abonado: $${p.monto_abonado}`
          }));
          console.log('Pagos pendientes para registrar:', this.pagoPendientes);
        });
      }


      filtrarBusqueda() {
        const termino = this.terminoBusqueda.trim().toLowerCase();
        this.abonoPa = this.buscarOriginal.filter(usuario => {
          return (
            usuario.nombre?.toLowerCase().includes(termino) ||
            usuario.apellido?.toLowerCase().includes(termino) ||
            usuario.cedula?.toLowerCase().includes(termino)
          );
        });
      }

      abrirExpand(event: TableRowExpandEvent) {
        this.messageService.add({ 
          severity: 'info', 
          summary: 'Abierto Expandicion de', 
          detail: event.data.nombre, 
          life: 3000 });
      }

      cerrarCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({
            severity: 'success',
            summary: 'Cerrado Expandicion de ',
            detail: event.data.nombre,
            life: 3000
        });
      }

      store() {
        this.submitted = true;
    
        if (this.formSave.invalid) {
          this.errorMessageToast();
          this.formSave.markAllAsTouched();
          return;
        }
    
        if (this.formSave.valid) {
          const newPago: any = {
            id_registro_pago: this.formSave.value.id_registro_pago,
            /* fecha: this.formatDate(this.formSave.value.fecha), */
            monto: this.formSave.value.monto,
          };
    
          this.abonopagoService.createAbonoPago(newPago).subscribe({
            next: () => {
              this.saveMessageToast();
              this.getAbonoPago();
              this.visibleSave = false;
            },
            error: (err) => {
              console.error('Error al guardar registro del pago:', err);
              
            }
          });
        }
      }

      getNombrePago(id: number): string {
        const tipo = this.pago.find(tp => tp.id === id);
        return tipo ? tipo.fecha_vencimiento : 'Desconocido';
      }
      
      showSaveDialog() {
        this.formSave.reset();
        this.visibleSave = true;
      }

      formatDate = (date: Date): string => {
        const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return adjustedDate.toISOString().split('T')[0];
      }
    
      saveMessageToast() {
        this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Guardado correctamente' });
      }

      cancelMessageToast() {
        this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Cancelado!...' });
      }

      errorMessageToast() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar el datos.' });
      }

      EliminadoMessageToasts() {
        this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Eliminado correctamente' });
      }

      cancelSave() {
        this.visibleSave = false;
        this.cancelMessageToast();
      }

      edit(elasticId: any) {
        this.idForUpdate = true;
        this.abonoPa = elasticId;

        if (this.abonoPa) {
          const pagoRelacionado = this.pagoTodos.find(p => p.id_registro_pago === this.abonoPa.id_registro_pago);

          this.pagosParaEditar = pagoRelacionado ? [pagoRelacionado] : [];

          this.formUpdate.patchValue({
            id_registro_pago: this.abonoPa.id_registro_pago,
            monto: this.abonoPa.monto,
            fecha: new Date(this.abonoPa.fecha)
          });
        }

        this.visibleUpdate = true;
      }

      update() {
        if (this.formUpdate.invalid) {
          this.errorMessageToast();
          this.formUpdate.markAllAsTouched();
          return;
        }

        const updatePago: AbonoPago = {
          id: this.abonoPa.id,
          id_registro_pago: this.formUpdate.value.id_registro_pago,
          monto: this.formUpdate.value.monto,
        };

        this.abonopagoService.updateAbonoPago(this.abonoPa.id, updatePago).subscribe({
          next: (res) => {
            this.getAbonoPago();
            this.visibleUpdate = false;
            this.saveMessageToast();
          },
          error: (err) => {
            console.error('Error actualizando el abono pago:', err.error);
            this.errorMessageToast();
          }
        });
      }

      canceUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }

      delete() {
        console.log('ID a eliminar:', this.abonoPa);
        this.abonopagoService.deleteAbonoPago(this.abonoPa).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getAbonoPago();
            this.abonoPa = 0;
            this.EliminadoMessageToasts(); 
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.errorMessageToast();
          }
        });
      }

      showModalDelete(id: number) {
        this.abonoPa = id;
        this.visibleDelete = true;
      }

}
