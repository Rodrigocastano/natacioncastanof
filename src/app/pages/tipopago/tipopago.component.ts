import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
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
export class TipopagoComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  tipoPago: TipoPago[] = [];
  idTipoPago: number = 0;
  visibleDelete: boolean = false;
  formUpdate!: FormGroup;
  tipo: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  filtro: string = '';
  buscadorFiltrados: TipoPago[] = [];
  submitted: boolean = false;

  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private tipopagoService: TipopagoService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      nombre: ['', Validators.required]

      
    });
    this.formUpdate = fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getTipoPago();
  }

   getTipoPago() {
    this.tipopagoService.getAllTipoPago().subscribe(
      data => {
        this.tipoPago = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
  
    if (termino === '') {
    this.tipoPago = [...this.buscadorFiltrados];
    } else {
    this.tipoPago = this.buscadorFiltrados.filter(user =>
      user.nombre?.toLowerCase().includes(termino)
    );
    }
    }

     store() 
     {
          this.submitted = true;
        
          if (this.formSave.invalid) {
            this.errorMessageToast();
            this.formSave.markAllAsTouched();
            return;
          }
        
          if (this.formSave.valid) {
            const newTipoPago: any = {
              nombre: this.formSave.value.nombre,
            };
        
            this.tipopagoService.createTipoPago(newTipoPago).subscribe({
              next: () => {
                this.saveMessageToast();
                this.getTipoPago();
                this.visibleSave = false;
              },
              error: (err) => {
                console.error('Error al guardar el tipo de nado:', err);
              }
            });
          }
        }
            
            cancelSave() {
              this.visibleSave = false;
              this.cancelMessageToast();
            }
            
            showSaveDialog() {
              this.formSave.reset();
              this.visibleSave = true;
            }
            
            saveMessageToast() {
              this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Guardado correctamente' });
            }
            
            EliminadoMessageToasts() {
              this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Eliminado correctamente' });
            }
            
            cancelMessageToast() {
              this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Cancelado!...' });
            }
               
            errorMessageToast() {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar la datos.' });
            }
        
            update() {
              if (this.formUpdate.invalid) {
                this.errorMessageToast(); 
                this.formUpdate.markAllAsTouched();
                return;
              }
          
              if (this.formUpdate.valid) {
                const updateTipoPago: TipoPago = {
                  id: this.idForUpdate,
                  nombre: this.formUpdate.value.nombre,
                };
          
                this.tipopagoService.updateTipoPago(this.idForUpdate, updateTipoPago).subscribe({
                  next: (res) => {
                    this.saveMessageToast(); 
                    this.getTipoPago();
                    this.visibleUpdate = false;
                    this.idForUpdate = 0;
                  },
                  error: (err) => {
                    this.errorMessageToast(); 
                    console.error('Error actualizando tipo de nado:', err);
                  }
                });
              }
            }
              
            edit(id: number) {
            
              this.idForUpdate = id;
              this.tipo = this.tipoPago.find(e => e.id == id);
              if (this.tipo) {
                this.formUpdate.controls['nombre'].setValue(this.tipo?.nombre)
        
              }
              this.visibleUpdate = true;
            }
            
            cancelUpdate() {
              this.visibleUpdate = false;
              this.cancelMessageToast();
            }
        
            delete() {
              this.tipopagoService.deleteTipoPago(this.idTipoPago).subscribe({
                next: () => {
                  this.visibleDelete = false;
                  this.getTipoPago()
                  this.idTipoPago = 0
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
              this.visibleDelete = true
            }  
             
          }
    
