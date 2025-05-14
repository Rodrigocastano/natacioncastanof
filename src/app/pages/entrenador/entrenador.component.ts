import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { Entrenador } from '../../../app/pages/interfaces/entrenador'; 
import { Grupo } from '../../../app/pages/interfaces/grupo'; 
import { EntrenadorService } from '../../../app/pages/service/entrenador.service';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';
import { GrupoService } from '../service/grupo.service';

@Component({
  selector: 'app-entrenador',
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
  templateUrl: './entrenador.component.html',
})
export class EntrenadorComponent implements OnInit  {

    formSave!: FormGroup;
    visibleSave: boolean = false;
    entrenador: Entrenador[] = [];
    idEntrenador: number = 0;
    visibleDelete: boolean = false;

    formUpdate!: FormGroup;
    user: any
    idForUpdate: number = 0;
    visibleUpdate: boolean = false;
    
    filtro: string = '';
    buscadorFiltrados: Entrenador[] = [];
    grupo: Grupo[] = [];
    
    submitted: boolean = false;
    mostrarPassword: boolean = false;
    maxDate: Date = new Date();
    fechaActual: Date = new Date();
    loading: boolean = true;

    constructor(
      private fb: FormBuilder,
      private entrenadorService: EntrenadorService,
      private grupoService :GrupoService,
      private messageService: MessageService
    ) {
      this.formSave = this.fb.group({
        id_grupo: ['', [Validators.required]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        ciudad: ['', []],
        cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        direccion: ['', []],
        genero: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        fechaNacimiento: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
        fechaInscripcion: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
        
      });
      this.formUpdate = fb.group({
        id_grupo: ['', [Validators.required]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', []],
        ciudad: ['', []],
        cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        direccion: ['', []],
        genero: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        fechaNacimiento: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
        fechaInscripcion: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
      });
    }


    ngOnInit(): void {
    this.getentrenador();
    this.getGrupo()
    
    }

   getentrenador() {
    this.entrenadorService.getAllEntrenadore().subscribe(
      data => {
        this.entrenador = data
        this.buscadorFiltrados = [...data];
        this.loading = false;
       
      }
    );
  }

  getGrupo() {
    this.grupoService.getAllGrupo().subscribe(data => {
      this.grupo = data
      console.log(this.grupo)
    });
  }

  formatDate = (date: Date): string => {
    const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return adjustedDate.toISOString().split('T')[0];
  };

  soloNumeros(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
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
      const newEntrenador: any = {
        nombre: this.formSave.value.nombre,
        apellido: this.formSave.value.apellido,
        cedula: this.formSave.value.cedula,
        ciudad: this.formSave.value.ciudad,
        email: this.formSave.value.email,
        password: this.formSave.value.password,
        telefono: this.formSave.value.telefono,
        direccion: this.formSave.value.direccion,
        genero: this.formSave.value.genero,
        edad: this.formSave.value.edad,
        fechaNacimiento: this.formatDate(this.formSave.value.fechaNacimiento),
        fechaInscripcion: this.formatDate(this.formSave.value.fechaInscripcion),
        id_grupo: this.formSave.value.id_grupo,
        id_rol: 2
      };
  
      this.entrenadorService.createEntrenadore(newEntrenador).subscribe({
        next: () => {
          this.saveMessageToast();
          this.getentrenador();
          this.visibleSave = false;
        },
        error: (err) => {
          if (err.status === 409 && err.error.message === 'Cédula duplicada') {
            this.errorCedulaMessageToast();
          } 
          else if (err.status === 422 && err.error.message.includes('email')) {
            this.errorCorreoMessageToast();
          } 
          else {
            this.errorMessageToast();
          }
        }
      });
    }
  }
  
  errorCedulaMessageToast() {
    this.messageService.add({
      severity: 'error',
      summary: 'Cédula duplicada',
      detail: 'Ya existe un entrenador registrado con esta cédula.'
    });
  }
  
  errorCorreoMessageToast() {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo duplicado',
      detail: 'Ya existe un entrenador registrado con este correo.'
    });
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

      getNombreGrupo(id: number): string {
        const grupoEncontrado = this.grupo.find(g => g.id === id);
        return grupoEncontrado ? grupoEncontrado.nombre : 'Sin grupo';
      }
    
      buscador() {
      const termino = this.filtro.toLowerCase().trim();
    
      if (termino === '') {
      this.entrenador = [...this.buscadorFiltrados];
      } else {
      this.entrenador = this.buscadorFiltrados.filter(user =>
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
      
        const updateUsuario: Entrenador = {
          id: this.idForUpdate,
          nombre: this.formUpdate.value.nombre,
          apellido: this.formUpdate.value.apellido,
          cedula: this.formUpdate.value.cedula,
          ciudad: this.formUpdate.value.ciudad,
          email: this.formUpdate.value.email,
          password: this.formUpdate.value.password,
          telefono: this.formUpdate.value.telefono,
          direccion: this.formUpdate.value.direccion,
          genero: this.formUpdate.value.genero,
          edad: this.formUpdate.value.edad,
          fechaNacimiento: this.formatDate(this.formUpdate.value.fechaNacimiento),
          fechaInscripcion: this.formatDate(this.formUpdate.value.fechaInscripcion),
          id_grupo: this.formUpdate.value.id_grupo,
          id_rol: 2
        };
        console.log('Datos enviados al backend:', updateUsuario);
      
        this.entrenadorService.updateEntrenadore(this.idForUpdate, updateUsuario).subscribe({
          next: (res) => {
            this.saveMessageToast(); 
            this.getentrenador();
            this.visibleUpdate = false;
            this.idForUpdate = 0;
          },
          error: (err) => {
            if (err.status === 409 && err.error?.message === 'Cédula duplicada') {
              this.errorCedulaMessageToast();
            } else {
              this.errorMessageToast();
            }
            console.error('Error actualizando entrenador:', err);
          }
        });
      }

      edit(id: number) {
      
        this.idForUpdate = id;
        this.user = this.entrenador.find(e => e.id == id);

        if (this.user) {
          const parseLocalDate = (dateString: string) => {
            return dateString ? new Date(dateString + 'T00:00:00') : null;
          };

    
          this.formUpdate.controls['nombre'].setValue(this.user?.nombre)
          this.formUpdate.controls['apellido'].setValue(this.user?.apellido)
          this.formUpdate.controls['cedula'].setValue(this.user?.cedula)
          this.formUpdate.controls['ciudad'].setValue(this.user?.ciudad)
          this.formUpdate.controls['telefono'].setValue(this.user?.telefono)
          this.formUpdate.controls['direccion'].setValue(this.user?.direccion)
          this.formUpdate.controls['password'].setValue(this.user?.password)
          this.formUpdate.controls['email'].setValue(this.user?.email)
          this.formUpdate.controls['genero'].setValue(this.user?.genero)
          this.formUpdate.controls['edad'].setValue(this.user?.edad)
          this.formUpdate.controls['id_grupo'].setValue(this.user?.id_grupo)
          this.formUpdate.controls['fechaNacimiento'].setValue(
            parseLocalDate(this.user.fechaNacimiento)
          );
          this.formUpdate.controls['fechaInscripcion'].setValue(
            parseLocalDate(this.user.fechaInscripcion)
          );
          
        }
        this.visibleUpdate = true;
      }
      
      cancelUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }

        delete() {
          this.entrenadorService.deleteEntrenadore(this.idEntrenador).subscribe({
            next: () => {
              this.visibleDelete = false;
              this.getentrenador()
              this.idEntrenador = 0
              this.EliminadoMessageToasts(); 
            },
            error: (err) => {
              console.error('Error al eliminar:', err);
              this.errorMessageToast();
            }
          });
        }
      
        showModalDelete(id: number) {
          this.idEntrenador = id;
          this.visibleDelete = true
        }  
          
        exportPdf() {
          const doc = new jsPDF('p', 'pt', 'a4');
          const tableData = this.entrenador.map((item: any) => [
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
        
          doc.save('Entrenador.pdf');
        }
            
      }
