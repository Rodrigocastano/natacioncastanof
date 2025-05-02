import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { Torneo } from '../../../app/pages/interfaces/torneo'; 
import { TorneoService } from '../../../app/pages/service/torneo.service';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-torneo',
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
  templateUrl: './torneo.component.html',
})
export class TorneoComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  torneo: Torneo[] = [];
  idTorneo: number = 0;
  visibleDelete: boolean = false;
  formUpdate!: FormGroup;
  torn: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  filtro: string = '';
  buscadorFiltrados: Torneo[] = [];
  submitted: boolean = false;

  maxDate: Date = new Date();
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private torneoService: TorneoService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      fecha: ['', [Validators.required]],

      
    });
    this.formUpdate = fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      fecha: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.getTorneo();
  }

   getTorneo() {
    this.torneoService.getAllTorneo().subscribe(
      data => {
        this.torneo = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

 store() {
  this.submitted = true;

  if (this.formSave.invalid) {
    this.errorMessageToast();
    this.formSave.markAllAsTouched();
    return;
  }

  if (this.formSave.valid) {
    const newTorneo: any = {
      nombre: this.formSave.value.nombre,
      fecha: this.formatDate(this.formSave.value.fecha),
    };

    this.torneoService.createTorneo(newTorneo).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getTorneo();
        this.visibleSave = false;
      },
      error: (err) => {
        console.error('Error al guardar la usuario:', err);
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

formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

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

      buscador() {
      const termino = this.filtro.toLowerCase().trim();
    
      if (termino === '') {
      this.torneo = [...this.buscadorFiltrados];
      } else {
      this.torneo = this.buscadorFiltrados.filter(user =>
        user.nombre?.toLowerCase().includes(termino)
      );
      }
      }
      
      update() {
        if (this.formUpdate.invalid) {
          this.errorMessageToast(); 
          this.formUpdate.markAllAsTouched();
          return;
        }
    
        if (this.formUpdate.valid) {
          const updateTorneo: Torneo = {
            id: this.idForUpdate,
            nombre: this.formUpdate.value.nombre,
            fecha: this.formatDate(this.formUpdate.value.fecha),
          };
    
          this.torneoService.updateTorneo(this.idForUpdate, updateTorneo).subscribe({
            next: (res) => {
              this.saveMessageToast(); 
              this.getTorneo();
              this.visibleUpdate = false;
              this.idForUpdate = 0;
            },
            error: (err) => {
              this.errorMessageToast(); 
              console.error('Error actualizando torneo:', err);
            }
          });
        }
      }
        
      edit(id: number) {
      
        this.idForUpdate = id;
        this.torn = this.torneo.find(e => e.id == id);
        if (this.torn) {
          this.formUpdate.controls['nombre'].setValue(this.torn?.nombre)
          this.formUpdate.controls['fecha'].setValue(new Date(this.torn?.fecha))
        }
        this.visibleUpdate = true;
      }
      
      cancelUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }

      delete() {
        this.torneoService.deleteTorneo(this.idTorneo).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getTorneo()
            this.idTorneo = 0
            this.EliminadoMessageToasts(); 
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.errorMessageToast();
          }
        });
      }
                
      showModalDelete(id: number) {
        this.idTorneo = id;
        this.visibleDelete = true
      }  

          
    }
