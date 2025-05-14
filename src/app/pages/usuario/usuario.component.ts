import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { Usuario } from '../../../app/pages/interfaces/usuario'; 
import { Grupo } from '../../../app/pages/interfaces/grupo'; 
import { Genero } from '../../../app/pages/interfaces/genero'; 
import { Ciudad } from '../../../app/pages/interfaces/ciudad'; 
import { UsuarioService } from '../../../app/pages/service/usuario.service';
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
import { GrupoService } from '../service/grupo.service';
import { GeneroService } from '../service/genero.service';
import { CiudadService } from '../service/ciudad.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-usuario',
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
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent implements OnInit  {

  formSaveUsuario!: FormGroup;
  visibleSave: boolean = false;
  usuario: Usuario[] = [];
  idUsuario: number = 0;
  visibleDelete: boolean = false;

  formUpdateUsuario!: FormGroup;
  user: any
  idForUpdate: number = 0;
  visibleUpdate: boolean = false;
  
  filtro: string = '';
  buscadorFiltrados: Usuario[] = [];
  grupo: Grupo[] = [];
  genero: Genero[] = [];
  ciudad: Ciudad[] = [];
  submitted: boolean = false;
  maxDate: Date = new Date();
  fechaActual: Date = new Date();
  loading: boolean = true;
  
  
    constructor(
      private fb: FormBuilder,
      private usuarioService: UsuarioService,
      private grupoService :GrupoService,
      private ciudadService: CiudadService,
      private generoService: GeneroService,
      private messageService: MessageService
    ) {
      this.formSaveUsuario = this.fb.group({
        id_grupo: ['', [Validators.required]],
        id_ciudad: ['', [Validators.required]],
        id_genero: ['', [Validators.required]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        direccion: ['', []],
        edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        fechaNacimiento: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
        fechaInscripcion: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
  
      });
      this.formUpdateUsuario = fb.group({
        id_grupo: ['', [Validators.required]],
        id_ciudad: ['', [Validators.required]],
        id_genero: ['', [Validators.required]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        direccion: ['', []],
        edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        fechaNacimiento: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
        fechaInscripcion: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
      });
    }

    ngOnInit(): void {
      this.getUsuarios();
      this.getGrupo()
      this.getGenero()
      this.getCiudad()
    }

    getUsuarios() {
      this.usuarioService.getAllUsuarios().subscribe(
        data => {
          this.usuario = data
          this.buscadorFiltrados = [...data];
          this.loading = false;
          console.log(this.usuario)
        }
      );
    }

    getGrupo() {
      this.grupoService.getAllGrupo().subscribe(data => {
        this.grupo = data
      });
    }

     getGenero() {
      this.generoService.getAllGenero().subscribe(data => {
        this.genero = data
      });
    }

     getCiudad() {
      this.ciudadService.getAllCiudad().subscribe(data => {
        this.ciudad = data
      });
    }

    formatDate = (date: Date): string => {
      const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return adjustedDate.toISOString().split('T')[0];
    };

    store() {
      this.submitted = true;
      if (this.formSaveUsuario.invalid) {
        this.errorMessageToast();
        this.formSaveUsuario.markAllAsTouched();
        return;
      }
    
      if (this.formSaveUsuario.valid) {
        const newUsuario: any = {
          nombre: this.formSaveUsuario.value.nombre,
          apellido: this.formSaveUsuario.value.apellido,
          cedula: this.formSaveUsuario.value.cedula,
          telefono: this.formSaveUsuario.value.telefono,
          direccion: this.formSaveUsuario.value.direccion,
          edad: this.formSaveUsuario.value.edad,
          fechaNacimiento: this.formatDate(this.formSaveUsuario.value.fechaNacimiento),
          fechaInscripcion: this.formatDate(this.formSaveUsuario.value.fechaInscripcion),
          id_ciudad: this.formSaveUsuario.value.id_ciudad,
          id_genero: this.formSaveUsuario.value.id_genero,
          id_grupo: this.formSaveUsuario.value.id_grupo,
          id_rol: 3
        };
        console.log('Datos a enviar al backend:', newUsuario);
        this.usuarioService.createUsuario(newUsuario).subscribe({
          next: () => {
           
            this.saveMessageToast();
            this.getUsuarios();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error recibido:', err); 
            if (err.status === 409) { 
              this.errorCedulaMessageToast(); 
            } else {
              this.errorMessageToast(); 
            }
          }
        });
      }
    }
    

    cancelSave() {
      this.visibleSave = false;
      this.cancelMessageToast();
    }

    showSaveDialog() {
      this.formSaveUsuario.reset();
      this.visibleSave = true;
    }

    soloNumeros(event: KeyboardEvent) {
      const charCode = event.charCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    }

    errorCedulaMessageToast() {
      this.messageService.add({
        severity: 'error',
        summary: 'Cédula duplicada',
        detail: 'Ya existe un usuario registrado con esta cédula.'
      });
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar el usuario.' });
    }

    getNombreGrupo(id: number): string {
      const grupoEncontrado = this.grupo.find(g => g.id === id);
      return grupoEncontrado ? grupoEncontrado.nombre : 'Sin grupo';
    }

    getNombreGenero(id: number): string {
      const generoEncontrado = this.genero.find(g => g.id === id);
      return generoEncontrado ? generoEncontrado.nombre : 'Sin grupo';
    }

    getNombreCiudad(id: number): string {
      const ciudadEncontrado = this.ciudad.find(g => g.id === id);
      return ciudadEncontrado ? ciudadEncontrado.nombre : 'Sin grupo';
    }

    buscador() {
      const termino = this.filtro.toLowerCase().trim();
        if (termino === '') {
        this.usuario = [...this.buscadorFiltrados];
        } else {
        this.usuario = this.buscadorFiltrados.filter(user =>
          user.nombre?.toLowerCase().includes(termino) ||
          user.apellido?.toLowerCase().includes(termino) ||
          user.cedula?.toLowerCase().includes(termino)
        );
        }
    }
  
    update() {
      this.submitted = true;
    
      if (this.formUpdateUsuario.invalid) {
        this.errorMessageToast(); 
        this.formUpdateUsuario.markAllAsTouched();
        return;
      }
    
      if (this.formUpdateUsuario.valid) {
        const updateUsuario: Usuario = {
          id: this.idForUpdate,
          nombre: this.formUpdateUsuario.value.nombre,
          apellido: this.formUpdateUsuario.value.apellido,
          cedula: this.formUpdateUsuario.value.cedula,
          telefono: this.formUpdateUsuario.value.telefono,
          direccion: this.formUpdateUsuario.value.direccion,
          edad: this.formUpdateUsuario.value.edad,
          fechaNacimiento: this.formatDate(this.formUpdateUsuario.value.fechaNacimiento),
          fechaInscripcion: this.formatDate(this.formUpdateUsuario.value.fechaInscripcion),
          id_ciudad: this.formUpdateUsuario.value.id_ciudad,
          id_genero: this.formUpdateUsuario.value.id_genero,
          id_grupo: this.formUpdateUsuario.value.id_grupo,
          id_rol: 3
        };
    
        this.usuarioService.updateUsuario(this.idForUpdate, updateUsuario).subscribe({
          next: (res) => {
            this.saveMessageToast(); 
            this.getUsuarios();
            this.visibleUpdate = false;
            this.idForUpdate = 0;
          },
          error: (err) => {
            if (err.status === 409 && err.error.message === 'Cédula duplicada') {
              this.errorCedulaMessageToast();
            } 

            else {
              this.errorMessageToast();
            }
            console.error('Error actualizando usuario:', err);
          }
        });
      }
    }

    edit(id: number) {
      this.idForUpdate = id;
      this.user = this.usuario.find(e => e.id == id);
      
      if (this.user) {
        const parseLocalDate = (dateString: string) => {
          return dateString ? new Date(dateString + 'T00:00:00') : null;
        };
    
        this.formUpdateUsuario.controls['nombre'].setValue(this.user.nombre);
        this.formUpdateUsuario.controls['apellido'].setValue(this.user.apellido);
        this.formUpdateUsuario.controls['cedula'].setValue(this.user?.cedula)
        this.formUpdateUsuario.controls['telefono'].setValue(this.user?.telefono)
        this.formUpdateUsuario.controls['direccion'].setValue(this.user?.direccion)
        this.formUpdateUsuario.controls['edad'].setValue(this.user?.edad)
        this.formUpdateUsuario.controls['id_ciudad'].setValue(this.user?.id_ciudad)
        this.formUpdateUsuario.controls['id_genero'].setValue(this.user?.id_genero)
        this.formUpdateUsuario.controls['id_grupo'].setValue(this.user?.id_grupo)
        this.formUpdateUsuario.controls['fechaNacimiento'].setValue(
          parseLocalDate(this.user.fechaNacimiento)
        );
        this.formUpdateUsuario.controls['fechaInscripcion'].setValue(
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
      this.usuarioService.deleteUsuario(this.idUsuario).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getUsuarios()
          this.idUsuario = 0
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
    
    showModalDelete(id: number) {
      this.idUsuario = id;
      this.visibleDelete = true
    }  
    
    exportPdf() {
      const doc = new jsPDF('p', 'pt', 'a4');
      const tableData = this.usuario.map((item: any) => [
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
