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
import { Horario } from '../interfaces/horario';
import { HorarioService } from '../service/horario.service';

@Component({
  selector: 'app-horario',
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
  templateUrl: './horario.component.html',
})
export class HorarioComponent implements OnInit {

  formSave!: FormGroup;
  formUpdate!: FormGroup;
  horario: Horario[] = [];
  idHorario: number = 0;
  visibleDelete: boolean = false;
  filtro: string = '';
  buscadorFiltrados: Horario[] = [];
  submitted: boolean = false;
  loading: boolean = true;
  editing: boolean = false;
  idForUpdate: number = 0;
    hora: Date | undefined;

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioService,
    private messageService: MessageService
  ) {
    this.formSave = this.fb.group({
      hora: ['', Validators.required]
    });
    this.formUpdate = this.fb.group({
      hora: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getHorario();
  }

  getHorario() {
    this.horarioService.getAllHorario().subscribe(
      data => {
        this.horario = data;
        this.buscadorFiltrados = [...data];
        this.loading = false;
      }
    );
  }

  buscador() {
      const termino = this.filtro.toLowerCase().trim();
      this.horario = termino === '' 
        ? [...this.buscadorFiltrados] 
        : this.buscadorFiltrados.filter(g => g.hora?.toLowerCase().includes(termino));
  }
  
  store() {
      this.submitted = true;

      if (this.formSave.invalid) {
          this.errorMessageToast();
          return;
      }

      const newGenero: any = {
          hora: this.formSave.value.hora,
      };

      this.horarioService.createHorario(newGenero).subscribe({
          next: () => {
              this.saveMessageToast();
              this.getHorario();
              this.formSave.reset();
              this.submitted = false;
          },
          error: (err) => {
              console.error('Error al guardar el horario:', err);
              
              if (err.status === 409) {
                  this.errorIngresoMessageToast();
              } else {
                  this.errorMessageToast();
              }
          }
      });
  }

  edit(horario: Horario) {
    this.editing = true;
    this.idForUpdate = horario.id;
    this.formUpdate.patchValue({
      hora: horario.hora
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
  
      const updateHorario: Horario = {
          id: this.idForUpdate,
          hora: this.formUpdate.value.hora,
      };
  
      this.horarioService.updateHorario(this.idForUpdate, updateHorario).subscribe({
          next: () => {
              this.saveMessageToast();
              this.getHorario();
              this.editing = false;
              this.formUpdate.reset();
              this.submitted = false;
          },
          error: (err) => {
              console.error('Error actualizando horario:', err);
              
              if (err.status === 409) {
                  this.errorIngresoMessageToast();
              } else {
                  this.errorMessageToast();
              }
          }
      });
  }
  
  delete() {
    this.horarioService.deleteHorario(this.idHorario).subscribe({
      next: () => {
        this.visibleDelete = false;
        this.getHorario();
        this.EliminadoMessageToasts();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.errorMessageToast();
      }
    });
  }

  showModalDelete(id: number) {
    this.idHorario = id;
    this.visibleDelete = true;
  }
  
    // Mensajes Toast
    saveMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El horario se guardó correctamente' });
    }
  
    EliminadoMessageToasts() {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El horario se eliminó correctamente' });
    }
  
    cancelMessageToast() {
      this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Operación cancelada' });
    }
  
    errorMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar el horario' });
    }
  
    errorIngresoMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ya existe un horario con ese nombre registrado' });
    }
  }
