import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { Representante } from '../../../app/pages/interfaces/representante'; 
import { RepresentanteService } from '../../../app/pages/service/representante.service';
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
import { CalendarModule } from 'primeng/calendar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-representante',
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
    CalendarModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './representante.component.html',
})
export class RepresentanteComponent implements OnInit  {

  formSave!: FormGroup;
  visibleSave: boolean = false;
  representante: Representante[] = [];
  idRepresentante: number = 0;
  visibleDelete: boolean = false;

  formUpdate!: FormGroup;
  represen: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  
  filtro: string = '';
  buscadorFiltrados: Representante[] = [];
  
  submitted: boolean = false;
  loading: boolean = true;
 
  constructor(
    private fb: FormBuilder,
    private representanteService: RepresentanteService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$') , Validators.minLength(10), Validators.maxLength(10)]],
      telefono: ['', [Validators.pattern(/^$|^\d{10}$/), Validators.minLength(10), Validators.maxLength(10)]],
    });
    this.formUpdate = fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$') , Validators.minLength(10), Validators.maxLength(10)]],
      telefono: ['', [Validators.pattern(/^$|^\d{10}$/) , Validators.minLength(10), Validators.maxLength(10)]],
    });
  }


  ngOnInit(): void {
  this.getRepresentante();
  }

   getRepresentante() {
    this.representanteService.getAllRepresentante().subscribe(
      data => {
        this.representante = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

soloNumeros(event: any): boolean {
  const input = event.target as HTMLInputElement;
  const newValue = input.value.replace(/[^0-9]/g, '');
  this.formSave.get(event.target.id)?.setValue(newValue, { emitEvent: false });
  if (newValue.length > 10) {
    this.formSave.get(event.target.id)?.setValue(newValue.slice(0, 10), { emitEvent: false });
    input.value = newValue.slice(0, 10);
  }
  return false; 
}

  store() {
    this.submitted = true;

    if (this.formSave.invalid) {
      this.errorMessageToast();
      this.formSave.markAllAsTouched();
      return;
    }

    if (this.formSave.valid) {
      const newRepresentante: any = {
        nombre: this.formSave.value.nombre,
        apellido: this.formSave.value.apellido,
        telefono: this.formSave.value.telefono,
        cedula: this.formSave.value.cedula,
      };

      this.representanteService.createRepresentante(newRepresentante).subscribe({
        next: () => {
          this.saveMessageToast();
          this.getRepresentante();
          this.visibleSave = false;
        },
        error: (err) => {
          console.error('Error al guardar la representante:', err);
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
  
  buscador() {
  const termino = this.filtro.toLowerCase().trim();

  if (termino === '') {
  this.representante = [...this.buscadorFiltrados];
  } else {
  this.representante = this.buscadorFiltrados.filter(user =>
    user.nombre?.toLowerCase().includes(termino) ||
    user.apellido?.toLowerCase().includes(termino) ||
    user.cedula?.toLowerCase().includes(termino)
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
      const updateRepresentante: Representante = {
        id: this.idForUpdate,
        nombre: this.formUpdate.value.nombre,
        apellido: this.formUpdate.value.apellido,
        cedula: this.formUpdate.value.cedula,
        telefono: this.formUpdate.value.telefono,
      };

      this.representanteService.updateRepresentante(this.idForUpdate, updateRepresentante).subscribe({
        next: (res) => {
          this.saveMessageToast(); 
          this.getRepresentante();
          this.visibleUpdate = false;
          this.idForUpdate = 0;
        },
        error: (err) => {
          this.errorMessageToast(); 
          console.error('Error actualizando usuario:', err);
        }
      });
    }
  }
        
  edit(id: number) {
  
    this.idForUpdate = id;
    this.represen = this.representante.find(e => e.id == id);
    if (this.represen) {
      this.formUpdate.controls['nombre'].setValue(this.represen?.nombre)
      this.formUpdate.controls['apellido'].setValue(this.represen?.apellido)
      this.formUpdate.controls['cedula'].setValue(this.represen?.cedula)
      this.formUpdate.controls['telefono'].setValue(this.represen?.telefono)
    }
    this.visibleUpdate = true;
  }
      
  cancelUpdate() {
    this.visibleUpdate = false;
    this.cancelMessageToast();
  }

  delete() {
    this.representanteService.deleteRepresentante(this.idRepresentante).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getRepresentante()
        this.idRepresentante = 0
        this.EliminadoMessageToasts(); 
      },
      error: (err) => {
        console.error('Error al eliminar', err);
        this.errorMessageToast();
      }
    });
  }

  showModalDelete(id: number) {
    this.idRepresentante = id;
    this.visibleDelete = true
  }  
    
  exportPdf() {
    const doc = new jsPDF('p', 'pt', 'a4');
    const tableData = this.representante.map((item: any) => [
      item.id,
      item.nombre,
      item.apellido,
      item.cedula,
      item.telefono,
    ]);
    autoTable(doc, {
      head: [['ID', 'Nombre', 'Apellido', 'Cédula', 'Teléfono']],
      body: tableData,
      startY: 30
    });
  
    doc.save('Representante.pdf');
  }
      
      }

