import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { PruebaTorneo } from '../../../app/pages/interfaces/pruebatorneo'; 
import { PruebatorneoService } from '../../../app/pages/service/pruebatorneo.service';
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
import { CategoriaPrueba } from '../interfaces/categoriaprueba';
import { CategoriapruebaService } from '../../../app/pages/service/categoriaprueba.service';
import { Torneo } from '../../../app/pages/interfaces/torneo'; 
import { TorneoService } from '../../../app/pages/service/torneo.service';
import { CategoriaTipo } from '../../../app/pages/interfaces/categoriatipo'; 
import { CategoriatipoService } from '../../../app/pages/service/categoriatipo.service';

@Component({
  selector: 'app-pruebatorneo',
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
  templateUrl: './pruebatorneo.component.html',
})
export class PruebatorneoComponent implements OnInit  {

    formSave!: FormGroup;
    visibleSave: boolean = false;
    pruebaTorneo: PruebaTorneo[] = [];
    idTorneo: number = 0;
    visibleDelete: boolean = false;
    formUpdate!: FormGroup;
    torneoPru: any
    idForUpdate: number = 0;
    visibleUpdate: boolean = false;
    filtro: string = '';
    buscadorFiltrados: PruebaTorneo[] = [];
    submitted: boolean = false;
    categoriaPrueba: CategoriaPrueba[] = [];
    categoriaTipo: CategoriaTipo[] = [];
    torneo: Torneo[] = [];
    maxDate: Date = new Date();
    fechaActual: Date = new Date();
    loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private pruebatorneoService: PruebatorneoService,
    private torneoService: TorneoService,
    private categoriapruebaService: CategoriapruebaService,
    private categoriatipoService: CategoriatipoService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      distancia: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      id_torneo: ['', [Validators.required]],
      id_categoria_prueba: ['', [Validators.required]],
      id_caregoria_tipo: ['', [Validators.required]],
      
    });
    this.formUpdate = fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      distancia: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      id_torneo: ['', [Validators.required]],
      id_categoria_prueba: ['', [Validators.required]],
      id_caregoria_tipo: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.getPruebaTorneo();
    this.getTorneo();
    this.getCategoriaPrueba();
    this.getCategoriaTipo();
  }

getPruebaTorneo() {
  this.pruebatorneoService.getAllPruebaTorneo().subscribe(
    data => {
      this.pruebaTorneo = data;
      this.buscadorFiltrados = [...data];
      this.loading = false;
    }
  );
}



   getTorneo() {
        this.torneoService.getAllTorneo().subscribe( 
          data => {
            this.torneo = data.map((torneo: any) => ({
              ...torneo,
              displayTorneo: `${torneo.nombre}`
            }));
            console.log(this.torneo);
          }
        );
      }

      getCategoriaPrueba() {
        this.categoriapruebaService.getAllCategoriaPrueba().subscribe( 
          data => {
            this.categoriaPrueba = data.map((categoriaPrueba: any) => ({
              ...categoriaPrueba,
              displayPrueba: `${categoriaPrueba.nombre}`
            }));
            console.log(this.categoriaPrueba);
          }
        );
      }

      getCategoriaTipo() {
        this.categoriatipoService.getAllCategoriaTipo().subscribe( 
          data => {
            this.categoriaTipo = data.map((categoriaTipo: any) => ({
              ...categoriaTipo,
              displayTipo: `${categoriaTipo.nombre}`
            }));
            console.log(this.categoriaTipo);
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
      distancia: this.formSave.value.distancia,
      id_torneo: this.formSave.value.id_torneo,
      id_categoria_prueba: this.formSave.value.id_categoria_prueba,
      id_caregoria_tipo: this.formSave.value.id_caregoria_tipo,

    };

    this.pruebatorneoService.createPruebaTorneo(newTorneo).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getPruebaTorneo();
        this.visibleSave = false;
      },
      error: (err) => {
        console.error('Error al guardar el torneo:', err);
      }
    });
  }
}

  getNombreTorneo(id: number): string {
    const estado = this.torneo.find(ep => ep.id === id);
    return estado ? estado.nombre : 'Desconocido';
  }

  getNombrePrueba(id: number): string {
    const estado = this.categoriaPrueba.find(ep => ep.id === id);
    return estado ? estado.nombre : 'Desconocido';
  }
  getNombreTipo(id: number): string {
    const estado = this.categoriaTipo.find(ep => ep.id === id);
    return estado ? estado.nombre : 'Desconocido';
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
  this.pruebaTorneo = [...this.buscadorFiltrados];
  } else {
  this.pruebaTorneo = this.buscadorFiltrados.filter(user =>
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
          const updateTorneo: PruebaTorneo = {
            id: this.idForUpdate,
            nombre: this.formUpdate.value.nombre,
            distancia: this.formUpdate.value.distancia,
            id_torneo: this.formUpdate.value.id_torneo,
            id_categoria_prueba: this.formUpdate.value.id_categoria_prueba,
            id_caregoria_tipo: this.formUpdate.value.id_caregoria_tipo,
          };
    
          this.pruebatorneoService.updatePruebaTorneo(this.idForUpdate, updateTorneo).subscribe({
            next: (res) => {
              this.saveMessageToast(); 
              this.getPruebaTorneo();
              this.visibleUpdate = false;
              this.idForUpdate = 0;
            },
            error: (err) => {
              this.errorMessageToast(); 
              console.error('Error actualizando Prueba torneo:', err);
            }
          });
        }
      }
        
      edit(id: number) {
      
        this.idForUpdate = id;
        this.torneoPru = this.pruebaTorneo.find(e => e.id == id);
        if (this.torneoPru) {
          this.formUpdate.controls['nombre'].setValue(this.torneoPru?.nombre)
          this.formUpdate.controls['distancia'].setValue(this.torneoPru?.distancia);
          this.formUpdate.controls['id_torneo'].setValue(this.torneoPru?.id_torneo);
          this.formUpdate.controls['id_categoria_prueba'].setValue(this.torneoPru?.id_categoria_prueba);
          this.formUpdate.controls['id_caregoria_tipo'].setValue(this.torneoPru?.id_caregoria_tipo);
        }
        this.visibleUpdate = true;
      }
      
      cancelUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }

      delete() {
        this.pruebatorneoService.deletePruebaTorneo(this.idTorneo).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getPruebaTorneo()
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
