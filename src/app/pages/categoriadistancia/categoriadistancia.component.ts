import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { TipoNado } from '../../../app/pages/interfaces/tiponado'; 
import { CategoriadistanciaService } from '../../../app/pages/service/categoriadistancia.service';
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
import { DatePickerModule } from 'primeng/datepicker';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CategoriaDistancia } from '../interfaces/categoriadistancia';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-categoriadistancia',
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
        DatePickerModule,
        SelectModule,
        DialogModule,
        DropdownModule,
        ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './categoriadistancia.component.html',
})
export class CategoriadistanciaComponent implements OnInit  {

    formSave!: FormGroup;
    visibleSave: boolean = false;
    categoriaDistancia: CategoriaDistancia[] = [];
    idCategoriaDistancia: number = 0;
    visibleDelete: boolean = false;

    formUpdate!: FormGroup;
    categoriadis: any
    idForUpdate: number = 0;
    visibleUpdate: boolean = false;
    
    filtro: string = '';
    buscadorFiltrados: CategoriaDistancia[] = [];
    tipoNado: TipoNado[] = [];
    
    submitted: boolean = false;
    loading: boolean = true;

    constructor(
      private fb: FormBuilder,
      private categoriadistanciaService: CategoriadistanciaService,
      private messageService: MessageService
    ) {
      this.formSave = this.fb.group({
        id_tipo_nado: ['', [Validators.required]],
        distancia: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        
      });
      this.formUpdate = fb.group({
        id_tipo_nado: ['', [Validators.required]],
        distancia: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      });
    }


    ngOnInit(): void {
      this.getCategoriaDistancia();
      this.getTipoNado()
    }

    getCategoriaDistancia() {
      this.categoriadistanciaService.getAllCategoriasDistancia().subscribe(
        data => {
          this.categoriaDistancia = data
          this.buscadorFiltrados = [...data];
          this.loading = false;
        }
      );
    }

    getTipoNados() {
      this.categoriadistanciaService.getAllTipoNado().subscribe(data => {
        this.tipoNado = data
        console.log(this.categoriadis)
      });
    }

    getTipoNado() {
      this.categoriadistanciaService.getAllTipoNado().subscribe(
        data => {
          this.tipoNado = data.map((tipoNado: any) => ({
            ...tipoNado,
            displayTipo: `${tipoNado.tipos} `
          }));
          console.log(this.tipoNado);
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
        const newCategoria: any = {
          distancia: this.formSave.value.distancia,
          id_tipo_nado: this.formSave.value.id_tipo_nado,
        };
  
        this.categoriadistanciaService.createCategoriasDistancia(newCategoria).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getCategoriaDistancia();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar la categoria:', err);
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

      getNombreTipo(id: number): string {
        const grupoEncontrado = this.tipoNado.find(g => g.id === id);
        return grupoEncontrado ? grupoEncontrado.tipos : 'Sin grupo';
      }
    
      buscador() {
      const termino = this.filtro.toLowerCase().trim();
    
      if (termino === '') {
      this.categoriaDistancia = [...this.buscadorFiltrados];
      } else {
      this.categoriaDistancia = this.buscadorFiltrados.filter(user =>
        user.id_tipo_nado?.toLowerCase().includes(termino) 
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
          const updateCategoria: CategoriaDistancia = {
            id: this.idForUpdate,
            distancia: this.formUpdate.value.distancia,
            id_tipo_nado: this.formUpdate.value.id_tipo_nado,
          };
    
          this.categoriadistanciaService.updateCategoriasDistancia(this.idForUpdate, updateCategoria).subscribe({
            next: (res) => {
              this.saveMessageToast(); 
              this.getCategoriaDistancia();
              this.visibleUpdate = false;
              this.idForUpdate = 0;
            },
            error: (err) => {
              this.errorMessageToast(); 
              console.error('Error actualizando categoria:', err);
            }
          });
        }
      }
        
      edit(id: number) {
      
        this.idForUpdate = id;
        this.categoriadis = this.categoriaDistancia.find(e => e.id == id);
        if (this.categoriadis) {
          this.formUpdate.controls['distancia'].setValue(this.categoriadis?.distancia)
          this.formUpdate.controls['id_tipo_nado'].setValue(this.categoriadis?.id_tipo_nado)
          
        }
        this.visibleUpdate = true;
      }
      
      cancelUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }
      
      delete() {
        this.categoriadistanciaService.deleteCategoriasDistancia(this.idCategoriaDistancia).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getCategoriaDistancia()
            this.idCategoriaDistancia = 0
            this.EliminadoMessageToasts(); 
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.errorMessageToast();
          }
        });
      }
        
      showModalDelete(id: number) {
        this.idCategoriaDistancia = id;
        this.visibleDelete = true
      }  
        
      exportPdf() {
        const doc = new jsPDF('p', 'pt', 'a4');
        const tableData = this.categoriaDistancia.map((item: any) => [
          item.id,
          item.nombre,
          item.apellido,
          item.cedula,
          item.telefono,
          item.ciudad,
          item.edad,
          item.genero,
          item.fechaNacimiento
        ]);
        autoTable(doc, {
          head: [['ID', 'Nombre', 'Apellido', 'Cédula', 'Teléfono', 'Ciudad', 'Edad', 'Género', 'Nacimiento']],
          body: tableData,
          startY: 30
        });
      
        doc.save('Usuarios.pdf');
      }
                    
}
      
