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
    DropdownModule
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
  
      constructor(
        private fb: FormBuilder,
        private pagoService: PagoService,
        private usuarioService: UsuarioService,
        private messageService: MessageService
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          id_tipo_pago: ['', [Validators.required]],
          id_estado_pago: ['', [Validators.required]],
          monto: ['', [Validators.required]],
          fecha: ['', [Validators.required]]
          
        });
        this.formUpdate = fb.group({
          id_estado_pago: ['', [Validators.required]],
          id_tipo_pago: ['', [Validators.required]],
          fecha: ['', [Validators.required]],
          id_usuario: ['', [Validators.required]],
          monto: ['', [Validators.required]],
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
            console.log(data.data);
            
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
            console.log(this.usuarios);
          }
        );
      }

      getTipoPago() {
        this.pagoService.getAllTipoPago().subscribe(
          data => {
            this.tipoPago = data.map((tipoPago: any) => ({
              ...tipoPago,
              displayEstado: `${tipoPago.tipos}`
            }));
            console.log(this.tipoPago);
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
            console.log(this.estadoPago);
          }
        );
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
          id_tipo_pago: this.formSave.value.id_tipo_pago,
          id_estado_pago: this.formSave.value.id_estado_pago,
          fecha: this.formatDate(this.formSave.value.fecha),
          monto: this.formSave.value.monto,
          id_usuario: this.formSave.value.id_usuario,
        };
  
        this.pagoService.createPago(newPago).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getPago();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar registro del pago:', err);
            
          }
        });
      }
      }

      getNombreTipoPago(id: number): string {
        const tipo = this.tipoPago.find(tp => tp.id === id);
        return tipo ? tipo.tipos : 'Desconocido';
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
        return date.toISOString().split('T')[0];
      };
  
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

      update() {
        if (this.formUpdate.invalid) {
          this.errorMessageToast(); 
          this.formUpdate.markAllAsTouched();
          return;
        }
        if (this.formUpdate.valid) {
          const updatePago: Pago = {
            id: this.pag.id,
            id_tipo_pago: this.formUpdate.value.id_tipo_pago,
            id_estado_pago: this.formUpdate.value.id_estado_pago,
            monto: this.formUpdate.value.monto,
            fecha: this.formatDate(this.formUpdate.value.fecha),
            id_usuario: this.formUpdate.value.id_usuario,
          };
      
          this.pagoService.updatePago(this.pag.id, updatePago).subscribe({
            next: (res) => {
              this.getPago();
              this.visibleUpdate = false;
              this.saveMessageToast();
            },
            error: (err) => {
              console.error('Error actualizando registro psicologo:', err);
              this.errorMessageToast(); 
            }
          });
        }
      }

      edit(elasticId: any) {
        this.idForUpdate = true;
        this.pag = elasticId
        if (this.pag) {
          this.formUpdate.controls['id_tipo_pago'].setValue(this.pag?.id_tipo_pago)
          this.formUpdate.controls['id_estado_pago'].setValue(this.pag?.id_estado_pago)
          this.formUpdate.controls['fecha'].setValue(new Date(this.pag?.fecha))
          this.formUpdate.controls['id_usuario'].setValue(this.pag?.id_usuario) 
          this.formUpdate.controls['monto'].setValue(this.pag?.monto) 
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

}
