import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pago } from '../interfaces/pago';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PagoService } from '../service/pago.service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
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
import { EstadoPago } from '../interfaces/estadoPago';
import { TipoPago } from '../interfaces/tipoPagos';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';
import { PlanPagoService } from '../service/plan-pago.service';

@Component({
  selector: 'app-pago',
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
  templateUrl: './pago.component.html',
})
export class PagoComponent implements OnInit{
  
      formSave!: FormGroup;
      visibleSave: boolean = false;
      pago: Pago[] = [];
      idPago: number = 0;
      visibleDelete: boolean = false;

      formUpdate!: FormGroup;
      pag: any
      idForUpdate: boolean = false;
      visibleUpdate: boolean = false;
      usuarios: Usuario[] = [];
      estadoPago: EstadoPago[] = [];
      tipoPago: TipoPago[] = [];
      expandedRows = {};
      cols: any[] = [];
      expanded: boolean = false;
      msgs: ToastMessageOptions[] | null = [];

      submitted: boolean = false;
      maxDate: Date = new Date();
      fechaActual: Date = new Date();
      loading: boolean = true;

      terminoBusqueda: string = '';
      buscarOriginal: Pago[] = [];

      cargando: boolean = false;
      resultado: string = '';

      constructor(
        private fb: FormBuilder,
        private pagoService: PagoService,
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private planPagoService: PlanPagoService
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          /* id_tipo_pago: ['', [Validators.required]], */

          monto: ['', [Validators.required]],
          fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
          monto_abonado: [''],
          fecha_vencimiento: ['', []]
          
        });
        this.formUpdate = fb.group({
          id_estado_pago: ['', [Validators.required]],
          /* id_tipo_pago: ['', [Validators.required]], */
          fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
          id_usuario: ['', [Validators.required]],
          monto: ['', [Validators.required]],
          monto_abonado: ['', [Validators.required]],
          fecha_vencimiento: ['', [Validators.required]]
        });
      }
  
      ngOnInit(): void {
        this.getPago();
        this.getUsuarios();
        this.getTipoPago();
        this.getEstadoPago();
      }

      getPago() {
        this.pagoService.getAllTodoPago().subscribe(
          data => {
            this.pago = data.data
            this.buscarOriginal = data.data; 
            this.loading = false;
          }
        );
      }

      getUsuarios() {
        this.usuarioService.getAllUsuarios().subscribe(
          data => {
            this.usuarios = data.map((usuario: any) => ({
              ...usuario,
              display: `${usuario.nombre} ${usuario.apellido} - ${usuario.cedula}`
            }));
          }
        );
      }

      ejecutarGenerarPagos() {
        this.cargando = true;

        this.planPagoService.generarPagos().subscribe({
          next: (res: any) => {
            console.log(' Comando ejecutado correctamente');
            console.log('Salida del comando:', res.output || res.message);

            this.getPago();
            this.cargando = false;
          },
          error: (err) => {
            console.error(' Error al ejecutar el comando:', err);
            this.cargando = false;
          }
        });
      }


      getTipoPago() {
        this.pagoService.getAllTipoPago().subscribe(
          data => {
            this.tipoPago = data.map((tipoPago: any) => ({
              ...tipoPago,
              displayEstado: `${tipoPago.nombre}`
            }));
          }
        );
      }

      getEstadoPago() {
        this.pagoService.getAllEstadoPago().subscribe(
          data => {
            this.estadoPago = data.map((estadoPago: any) => ({
              ...estadoPago,
              displayTipo: `${estadoPago.pagos}`
            }));
          }
        );
      }

      filtrarBusqueda() {
        const termino = this.terminoBusqueda.trim().toLowerCase();
        this.pago = this.buscarOriginal.filter(usuario => {
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
          /* id_tipo_pago: this.formSave.value.id_tipo_pago, */
          fecha: this.formatDate(this.formSave.value.fecha),
          monto: this.formSave.value.monto,
          monto_abonado: this.formSave.value.monto_abonado ?? 0,
          id_usuario: this.formSave.value.id_usuario,
        };

        this.pagoService.createPago(newPago).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getPago();
            this.visibleSave = false;
          },
          error: (err) => {
            if (err.status === 422) {
               this.errorMontoMessageToast();
            } else {
              console.error('Error al guardar registro del pago:', err);
              this.errorMessageToast();
            }
          }
        });
      }
    }

      getNombreTipoPago(id: number): string {
        const tipo = this.tipoPago.find(tp => tp.id === id);
        return tipo ? tipo.nombre : 'Desconocido';
      }
      
      getNombreEstadoPago(id: number): string {
        const estado = this.estadoPago.find(ep => ep.id === id);
        return estado ? estado.pagos : 'Desconocido';
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
       errorMontoMessageToast() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El monto abonado no puede ser mayor que el monto total del plan.' });
      }

      cancelSave() {
        this.visibleSave = false;
        this.cancelMessageToast();
      }

      update() {
        if (this.formUpdate.invalid) {
          this.errorMessageToast(); 
          this.formUpdate.markAllAsTouched();
          return;
        }
        if (this.formUpdate.valid) {
          const updatePago: Pago = {
            id: this.pag.id,
            /* id_tipo_pago: this.formUpdate.value.id_tipo_pago, */
            id_estado_pago: this.formUpdate.value.id_estado_pago,
            monto: this.formUpdate.value.monto,
            fecha: this.formatDate(this.formUpdate.value.fecha),
            monto_abonado: this.formUpdate.value.monto_abonado,
            fecha_vencimiento: this.formatDate(this.formUpdate.value.fecha_vencimiento),
            id_usuario: this.formUpdate.value.id_usuario,
          };
      
          this.pagoService.updatePago(this.pag.id, updatePago).subscribe({
            next: (res) => {
              this.getPago();
              this.visibleUpdate = false;
              this.saveMessageToast();
            },
            error: (err) => {
              console.error('Error actualizando registro del pago:', err);
              this.errorMessageToast(); 
            }
          });
        }
      }

      edit(elasticId: any) {
        console.log('datos', elasticId)
        this.idForUpdate = true;
        this.pag = elasticId
        if (this.pag) {
          const parseLocalDate = (dateString: string) => {
          return dateString ? new Date(dateString + 'T00:00:00') : null;
        };
          /* this.formUpdate.controls['id_tipo_pago'].setValue(this.pag?.id_tipo_pago) */
          this.formUpdate.controls['id_estado_pago'].setValue(this.pag?.id_estado_pago)
          this.formUpdate.controls['id_usuario'].setValue(this.pag?.id_usuario) 
          this.formUpdate.controls['monto'].setValue(this.pag?.monto) 
          this.formUpdate.controls['monto_abonado'].setValue(this.pag?.monto_abonado) 
          this.formUpdate.controls['fecha_vencimiento'].setValue( parseLocalDate(this.pag.fecha_vencimiento));
          this.formUpdate.controls['fecha'].setValue( parseLocalDate(this.pag.fecha));
        }
        this.visibleUpdate = true;
        
      }

      canceUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }

      delete() {
        this.pagoService.deletePago(this.idPago).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getPago();
            this.idPago = 0;
            this.EliminadoMessageToasts(); 
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.errorMessageToast();
          }
        });
      }
         

      showModalDelete(id: number) {
        this.idPago = id;
        this.visibleDelete = true
      }

onUsuarioChange(idUsuario: number) {
  this.pagoService.getPlanPorUsuario(idUsuario).subscribe({
    next: (plan) => {
      const parseDate = (dateString: string | null) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // mes 0-indexado
      };

      this.formSave.patchValue({
        /* id_tipo_pago: plan.id_tipo_pago, */
        monto: plan.monto,
        fecha: parseDate(plan.fecha_inicio) || new Date(),
        fecha_vencimiento: parseDate(plan.fecha_fin) || null
      });
    },
    error: (err) => {
      this.formSave.patchValue({
        /* id_tipo_pago: null, */
        monto: null,
        fecha: new Date(),
        fecha_vencimiento: null
      });
      console.error('El usuario no tiene plan activo', err);
    }
  });
}


}
