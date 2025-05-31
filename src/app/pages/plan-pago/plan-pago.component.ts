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
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
import { TipoPago } from '../interfaces/tipoPagos';
import { TipopagoService } from '../service/tipopago.service';
import { PlanPago } from '../interfaces/planpago';
import { PlanPagoService } from '../service/plan-pago.service';
import { formatDate } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-plan-pago',
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
    ProgressSpinnerModule,
    MultiSelectModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './plan-pago.component.html',
})
export class PlanPagoComponent implements OnInit{
  
      formSave!: FormGroup;
      visibleSave: boolean = false;
      planPago: PlanPago[] = [];
      idPago: number = 0;
      visibleDelete: boolean = false;

      formUpdate!: FormGroup;
      pag: any
      idForUpdate: boolean = false;
      visibleUpdate: boolean = false;
      usuarios: Usuario[] = [];
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
      buscarOriginal: PlanPago[] = [];
      opcionesDiass: any[] = [];

      constructor(
        private fb: FormBuilder,
        private planPagoService: PlanPagoService,
        private usuarioService: UsuarioService,
        private tipopagoService: TipopagoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          id_tipo_pago: ['', [Validators.required]],
          monto: ['', [Validators.required]],
          fecha_inicio: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
          fecha_fin: [[]],
          fecha_cobro: this.fb.group({
            frecuencia: [''],   
            dias: [[]],  }),
          estado_funcional: ['', []],
      
        });
        this.formUpdate = fb.group({
          id_usuario: ['', [Validators.required]],
          id_tipo_pago: ['', [Validators.required]],
          monto: ['', [Validators.required]],
          fecha_inicio: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
          fecha_fin: [[]],
          fecha_cobro: this.fb.group({
            frecuencia: [''],   
            dias: [[]],  }),
          estado_funcional: ['', []],
        });
      }
  
            ngOnInit(): void {
              this.getPlanPago();
              this.getUsuarios();
              this.getTipoPago();
            }

            // Método para confirmar la cancelación (con visualización del ID)
confirmarCancelacion(plan: any) {
    this.confirmationService.confirm({
        message: `¿Estás seguro de cancelar el plan ID: ${plan.id}?`,
        header: 'Confirmar cancelación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, cancelar',
        rejectLabel: 'No',
        accept: () => {
            this.cancelarPlan(plan);
        }
    });
}

// Método para cancelar el plan (con ID en mensajes)
cancelarPlan(plan: any) {
    const fechaActual = new Date();
    const payload = {
        fecha_fin: this.formatDate(fechaActual),
        estado_funcional: 0
    };

    this.planPagoService.CancelarPlan(plan.id, payload).subscribe({
        next: () => {
            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `Plan ID: ${plan.id} cancelado correctamente (${this.formatDate(fechaActual)})`
            });
            this.getPlanPago();
        },
        error: (err) => {
            console.error('Error al cancelar plan:', err);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `No se pudo cancelar el plan ID: ${plan.id}`
            });
        }
    });
}

// Versión para diálogo de edición (con ID)
cancelarPlanDesdeDialogo() {
    const planId = this.formUpdate.value.id; // Asumiendo que el formulario tiene el ID
    
    this.confirmationService.confirm({
        message: `¿Cancelar el plan ID: ${planId}? Se establecerá la fecha fin a hoy.`,
        header: 'Confirmar cancelación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, cancelar',
        rejectLabel: 'No',
        accept: () => {
            const fechaActual = new Date();
            this.formUpdate.patchValue({
                fecha_fin: fechaActual,
                estado_funcional: 0
            });
            
            this.messageService.add({
                severity: 'info',
                summary: 'Cancelación pendiente',
                detail: `Plan ID: ${planId} marcado para cancelación. Guarda los cambios.`
            });
        }
    });
}

            getPlanPago() {
              this.planPagoService.getAllPlanPago().subscribe(
                data => {
                  this.planPago = data
                  this.buscarOriginal = data; 
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

            getTipoPago() {
              this.tipopagoService.getAllTipoPago().subscribe(
                data => {
                  this.tipoPago = data.map((tipoPago: any) => ({
                    ...tipoPago,
                    displayEstado: `${tipoPago.nombre}`
                  }));
                }
              );
            }

            filtrarBusqueda() {
              const termino = this.terminoBusqueda.trim().toLowerCase();
              this.planPago = this.buscarOriginal.filter(usuario => {
                return (
                  usuario.nombre?.toLowerCase().includes(termino) ||
                  usuario.apellido?.toLowerCase().includes(termino) ||
                  usuario.cedula?.toLowerCase().includes(termino)
                );
              });
            }

            frecuencia = [
              { label: 'Diaria', value: 'diaria' },
              { label: 'Semanal', value: 'semanal' },
              { label: 'Quincenal', value: 'quincenal' },
              { label: 'Mensual', value: 'mensual' }
            ];

            diasDelMes = Array.from({ length: 31 }, (_, i) => ({
              label: `${i + 1}`, value: i + 1
            }));

            diasSemana = [
              { label: 'Lunes', value: 1 },
              { label: 'Martes', value: 2 },
              { label: 'Miércoles', value: 3 },
              { label: 'Jueves', value: 4 },
              { label: 'Viernes', value: 5 },
              { label: 'Sábado', value: 6 },
              { label: 'Domingo', value: 0 }
            ];

            opcionDiario = [{ label: 'Diario', value: 'diario' }];

            get opcionesDias() {
              const frecuencia = this.formSave.get('fecha_cobro.frecuencia')?.value;
              
              switch(frecuencia) {
                case 'diario':
                  return this.opcionDiario;
                case 'semanal':
                  return this.diasSemana;
                case 'mensual':
                case 'quincenal':
                default:
                  return this.diasDelMes;
              }
            }

            onFrecuenciaChange() {
              this.formSave.get('fecha_cobro.dias')?.setValue([]);
              if (this.formSave.get('fecha_cobro.frecuencia')?.value === 'diario') {
                this.formSave.get('fecha_cobro.dias')?.setValue(['diario']);
              }
            }

            store() {
                  this.submitted = true;
              
                  if (this.formSave.invalid) {
                    this.errorMessageToast();
                    this.formSave.markAllAsTouched();
                    return;
                  }
              
                  if (this.formSave.valid) {
                    const presenteValue = this.formSave.value.estado_funcional !== null && this.formSave.value.estado_funcional !== undefined 
                    ? this.formSave.value.estado_funcional 
                    : true; 

                    const newPago: any = {
                      id_usuario: this.formSave.value.id_usuario,
                      id_tipo_pago: this.formSave.value.id_tipo_pago,
                      monto: this.formSave.value.monto,
                      fecha_inicio: this.formatDate(this.formSave.value.fecha_inicio),
                      fecha_fin: this.formatDate(this.formSave.value.fecha_fin),
                      fecha_cobro: this.formSave.value.fecha_cobro,
                      estado_funcional: presenteValue,
                      
                    };
                    console.log('Datos enviados al backend:', newPago);
              
                    this.planPagoService.createPlanPago(newPago).subscribe({
                      next: () => {
                        this.saveMessageToast();
                        this.getPlanPago();
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
              return tipo ? tipo.nombre : 'Desconocido';
            }

      
            showSaveDialog() {
              this.formSave.reset();
              this.visibleSave = true;
            }
      
            formatDate = (date: Date): string => {
              const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
              return adjustedDate.toISOString().split('T')[0];
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

            frecuencias = [
              {label: 'Diario', value: 'diario'},
              {label: 'Semanal', value: 'semanal'},
              {label: 'Quincenal', value: 'quincenal'},
              {label: 'Mensual', value: 'mensual'}
            ];
      
            update() {
              if (this.formUpdate.invalid) return;

              const formData = this.formUpdate.value;

              const payload = {
                id: this.pag.id,
                id_usuario: formData.id_usuario,
                id_tipo_pago: formData.id_tipo_pago,
                monto: Number(formData.monto),
                fecha_inicio: this.formatDate(formData.fecha_inicio),
                fecha_fin: this.formatDate(formData.fecha_fin),
                fecha_cobro: { 
                  frecuencia: formData.fecha_cobro.frecuencia,
                  dias: formData.fecha_cobro.dias.map(Number)
                },
                estado_funcional: formData.estado_funcional ? 1 : 0
              };

              console.log('Payload completo:', JSON.stringify(payload, null, 2));

              this.planPagoService.updatePlanPago(this.pag.id, payload).subscribe({
                next: () => {
                  this.getPlanPago();
                  this.visibleUpdate = false;
                  this.saveMessageToast();
                },
                error: (err) => {
                  console.error('Error del backend:', {
                    request: payload,
                    response: err.error
                  });
                  this.errorMessageToast();
                }
              });
            }

            
            edit(planPagoId: any) {
              this.idForUpdate = true;
              this.pag = planPagoId;

              console.log('Datos estructurados (this.pag):', JSON.parse(JSON.stringify(this.pag)));

              if (this.pag) {
                const parseLocalDate = (dateString: string) => {
                  return dateString ? new Date(dateString + 'T00:00:00') : null;
                };

                // ✅ Parsear fecha_cobro si viene como string
                let fechaCobroParsed: any = this.pag.fecha_cobro;
                if (typeof fechaCobroParsed === 'string') {
                  try {
                    fechaCobroParsed = JSON.parse(fechaCobroParsed);
                  } catch (e) {
                    console.error('Error al parsear fecha_cobro:', e);
                    fechaCobroParsed = { frecuencia: '', dias: [] };
                  }
                }

                // Convertir los días si es diario
                let diasValue = fechaCobroParsed?.dias;
                if (fechaCobroParsed?.frecuencia === 'diario' && (!diasValue || !diasValue.includes('diario'))) {
                  diasValue = ['diario'];
                }

                // Actualizar el formulario principal
                this.formUpdate.patchValue({
                  id_usuario: this.pag.id_usuario,
                  id_tipo_pago: this.pag.id_tipo_pago,
                  monto: this.pag.monto,
                  estado_funcional: this.pag.estado_funcional === 1, // Convertir a boolean
                  fecha_inicio: parseLocalDate(this.pag.fecha_inicio),
                  fecha_fin: this.pag.fecha_fin ? new Date(this.pag.fecha_fin) : null,
                });

                // Actualizar el grupo fecha_cobro
                const fechaCobroGroup = this.formUpdate.get('fecha_cobro') as FormGroup;
                if (fechaCobroGroup) {
                  fechaCobroGroup.patchValue({
                    frecuencia: fechaCobroParsed?.frecuencia || '',
                    dias: diasValue || []
                  });
                }

                // Cambiar opciones de días según frecuencia seleccionada
                this.cambiarOpcionesDias(fechaCobroParsed?.frecuencia);
              }

              this.visibleUpdate = true;
            }

            cambiarOpcionesDias(frecuencia: string) {
              if (frecuencia === 'diario') {
                this.opcionesDiass = ['diario'];
              } else if (frecuencia === 'semanal') {
                this.opcionesDiass = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
              } else if (frecuencia === 'quincenal') {
                this.opcionesDiass = [1, 15];
              } else if (frecuencia === 'mensual') {
                this.opcionesDiass = Array.from({ length: 31 }, (_, i) => i + 1);
              } else {
                this.opcionesDiass = [];
              }
            }

            get opcionesDiasUpdate() {
              const frecuencia = this.formUpdate.get('fecha_cobro.frecuencia')?.value;
              
              switch(frecuencia) {
                case 'diario':
                  return this.opcionDiario;
                case 'semanal':
                  return this.diasSemana;
                case 'mensual':
                case 'quincenal':
                default:
                  return this.diasDelMes;
              }
            }

            onFrecuenciaChangeUpdate() {
              this.formUpdate.get('fecha_cobro.dias')?.setValue([]);
              if (this.formUpdate.get('fecha_cobro.frecuencia')?.value === 'diario') {
                this.formUpdate.get('fecha_cobro.dias')?.setValue(['diario']);
              }
            }
      
            canceUpdate() {
              this.visibleUpdate = false;
              this.cancelMessageToast();
            }
      
            delete() {
              this.planPagoService.deletePlanPago(this.idPago).subscribe({
                next: () => {
                  this.visibleDelete = false;
                  this.getPlanPago();
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
      
