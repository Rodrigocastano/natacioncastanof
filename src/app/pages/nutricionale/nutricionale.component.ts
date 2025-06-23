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
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { NutricionaleService } from '../service/nutricionale.service';
import { Nutricionales } from '../interfaces/nutricionales';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-nutricionale',
  imports: 
  [
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
    DatePickerModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './nutricionale.component.html',
})
export class NutricionaleComponent implements OnInit{
  
  formSave!: FormGroup;
  visibleSave: boolean = false;
  nutricionale: Nutricionales[] = [];
  idNutricionale: number = 0;
  visibleDelete: boolean = false;

  formUpdate!: FormGroup;
  nutric: any
  idForUpdate: boolean = false;
  visibleUpdate: boolean = false;
  usuarios: Usuario[] = [];

  expandedRows = {};
  cols: any[] = [];
  expanded: boolean = false;
  msgs: ToastMessageOptions[] | null = [];

  submitted: boolean = false;
  maxDate: Date = new Date();
  fechaActual: Date = new Date();
  currentDate: Date = new Date();
  loading: boolean = true;

  terminoBusqueda: string = '';
  buscarOriginal: Nutricionales[] = [];

  visibleUserMeasureDialog: boolean = false;
selectedUser: any;
  
  constructor(
      private fb: FormBuilder,
      private nutricionaleService: NutricionaleService,
      private usuarioService: UsuarioService,
      private messageService: MessageService
    ) {
      this.formSave = this.fb.group({
        id_usuario: ['', [Validators.required]],
        caloria_consumida: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        proteina_consumida: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
        
      });
      this.formUpdate = fb.group({
        caloria_consumida: ['', [Validators.required]],
        proteina_consumida: ['', [Validators.required]],
        id_usuario: ['', [Validators.required]],
        fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
      });
    }

    ngOnInit(): void {
      this.getNutricionales();
      this.getUsuarios();
    }

    getNutricionales() {
      this.nutricionaleService.getAllTodoNutricionale().subscribe(
        data => {
          this.nutricionale = data.data
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
          console.log(this.usuarios);
        }
      );
    }

    filtrarBusqueda() {
      const termino = this.terminoBusqueda.trim().toLowerCase();
      this.nutricionale = this.buscarOriginal.filter(usuario => {
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
        const newUsuario: any = {
          caloria_consumida: this.formSave.value.caloria_consumida,
          proteina_consumida: this.formSave.value.proteina_consumida,
          fecha: this.formatDate(this.formSave.value.fecha),
          id_usuario: this.formSave.value.id_usuario,
        };
  
        this.nutricionaleService.createNutricionale(newUsuario).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getNutricionales();
            this.visibleSave = false;
            this.visibleUserMeasureDialog = false;
          },
          error: (err) => {
            console.error('Error al guardar la medida elasticida:', err);
            
          }
        });
      }
    }

    prepareNewMedida(usuario: any) {
        this.selectedUser = usuario;
        this.formSave.reset();
        
        const today = new Date();
        this.currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        this.formSave.patchValue({
            id_usuario: usuario.id,
            fecha: this.currentDate
        });
        
        this.visibleUserMeasureDialog = true;
    }

obtenerMedidasOrdenadas(measures: any[]): any[] {
  // Ordenamos de más antiguo a más reciente y tomamos los últimos 8
  return [...measures]
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(-8);
}

compararCaloriasAnterior(medidasOrdenadas: any[], index: number): string {
  // No mostrar flecha para el primer registro
  if (index === 0) return '';
  
  const actual = medidasOrdenadas[index].caloria_consumida;
  const anterior = medidasOrdenadas[index - 1].caloria_consumida;

  if (actual > anterior) return 'increase';
  if (actual < anterior) return 'decrease';
  return ''; // No mostrar flecha si son iguales
}

// Nueva función para comparar proteína
compararProteinaAnterior(medidasOrdenadas: any[], index: number): string {
  // No mostrar flecha para el primer registro
  if (index === 0) return '';
  
  const actual = parseFloat(medidasOrdenadas[index].proteina_consumida);
  const anterior = parseFloat(medidasOrdenadas[index - 1].proteina_consumida);

  if (actual > anterior) return 'increase';
  if (actual < anterior) return 'decrease';
  return ''; // No mostrar flecha si son iguales
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

    update() {
      if (this.formUpdate.invalid) {
        this.errorMessageToast(); 
        this.formUpdate.markAllAsTouched();
        return;
      }
      if (this.formUpdate.valid) {
        const updateNutricionales: Nutricionales = {
          id: this.nutric.id,
          proteina_consumida: this.formUpdate.value.proteina_consumida,
          caloria_consumida: this.formUpdate.value.caloria_consumida,
          fecha: this.formatDate(this.formUpdate.value.fecha),
          id_usuario: this.formUpdate.value.id_usuario,
        };
    
        this.nutricionaleService.updateNutricionale(this.nutric.id, updateNutricionales).subscribe({
          next: (res) => {
            this.getNutricionales();
            this.visibleUpdate = false;
            this.saveMessageToast();
          },
          error: (err) => {
            console.error('Error actualizando medid nutricional:', err);
            this.errorMessageToast(); 
          }
        });
      }
    }
    
    edit(nutricionaId: any) {
      this.idForUpdate = true;
      this.nutric = nutricionaId
      if (this.nutric) {
         const parseLocalDate = (dateString: string) => {
          return dateString ? new Date(dateString + 'T00:00:00') : null;
        };
        this.formUpdate.controls['proteina_consumida'].setValue(this.nutric?.proteina_consumida)
        this.formUpdate.controls['caloria_consumida'].setValue(this.nutric?.caloria_consumida)
        this.formUpdate.controls['id_usuario'].setValue(this.nutric?.id_usuario) 
        this.formUpdate.controls['fecha'].setValue(
          parseLocalDate(this.nutric.fecha)
        );
      }
      this.visibleUpdate = true;
      
    }
    
    canceUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }
          
    delete() {
      this.nutricionaleService.deleteNutricionale(this.idNutricionale).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getNutricionales();
          this.idNutricionale = 0;
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
       
    showModalDelete(id: number) {
      this.idNutricionale = id;
      this.visibleDelete = true
    }
    
    }

