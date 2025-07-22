import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Grupo } from '../interfaces/grupo';
import { GrupoService } from '../service/grupo.service';

@Component({
  selector: 'app-grupo',
  standalone: true,
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
  templateUrl: './grupo.component.html'
})
export class GrupoComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  grupo: Grupo[] = [];
  idGrupo: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: Grupo[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;

  constructor(
    private fb: FormBuilder,
    private grupoService: GrupoService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
    });
    this.formUpdate = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
    });
  }

  ngOnInit(): void {
    this.getGrupo();
  }

  getGrupo() {
    this.grupoService.getAllGrupo().subscribe(
      data => {
        this.grupo = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
    const termino = this.filtro.toLowerCase().trim();
    this.grupo = termino === '' 
      ? [...this.buscadorFiltrados] 
      : this.buscadorFiltrados.filter(user => user.nombre?.toLowerCase().includes(termino));
  }

  store() {
    this.submitted = true;

    if (this.formSave.invalid) {
      this.errorMessageToast();
      return;
    }

    const newGrupo: any =  {
      nombre: this.formSave.value.nombre,
    };

    this.grupoService.createGrupo(newGrupo).subscribe({
      next: () => {
        this.saveMessageToast();
        this.getGrupo();
        this.formSave.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('Error al guardar el grupo:', err);

        if (err.status === 409) {
          this.errorIngresoMessageToast();
        }  else {
          this.errorMessageToast();
        }
      }
    });
  }


  edit(usuario: Grupo) {
    this.editing = true;
    this.idForUpdate = usuario.id;
    this.formUpdate.patchValue({
      nombre: usuario.nombre
    });
  }

  cancelEdit() {
    this.editing = false;
    this.formUpdate.reset();
    this.cancelMessageToast();
  }

  update() {
      this.submitted = true;
      
      if (this.formUpdate.invalid) {
          this.errorMessageToast();
          return;
      }

      const updateGrupo: Grupo = {
          id: this.idForUpdate,
          nombre: this.formUpdate.value.nombre,
      };

      this.grupoService.updateGrupo(this.idForUpdate, updateGrupo).subscribe({
          next: () => {
              this.saveMessageToast();
              this.getGrupo();
              this.editing = false;
              this.formUpdate.reset();
              this.submitted = false;
          },
          error: (err) => {
              if (err.status === 409) {
                  this.errorIngresoMessageToast();
                  this.errorMessageToast();
              }
          }
      });
  }

  delete() {
    this.grupoService.deleteGrupo(this.idGrupo).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getGrupo();
        this.EliminadoMessageToasts();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.errorMessageToast();
      }
    });
  }

  showModalDelete(id: number) {
    this.idGrupo = id;
    this.visibleDelete = true;
  }

  // Mensajes Toast
  saveMessageToast() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El grupo se guardó correctamente' });
  }

  EliminadoMessageToasts() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El grupo se eliminó correctamente' });
  }

  cancelMessageToast() {
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Solicitud cancelada' });
  }

  errorMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar el grupo' });
  }

  errorIngresoMessageToast() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un grupo con ese nombre registrado' });
  }

}