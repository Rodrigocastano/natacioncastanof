import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { Usuario } from '../../../app/pages/interfaces/usuario'; 
import { Grupo } from '../../../app/pages/interfaces/grupo'; 
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
    DatePickerModule
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
  
  submitted: boolean = false;
  maxDate: Date = new Date();
  
    constructor(
      private fb: FormBuilder,
      private usuarioService: UsuarioService,
      private messageService: MessageService
    ) {
      this.formSaveUsuario = this.fb.group({
        id_grupo: ['', [Validators.required]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        ciudad: ['', []],
        cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        telefono: ['', [Validators.pattern(/^$|^\d{10}$/)]],
        direccion: ['', []],
        genero: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        fechaNacimiento: ['', [Validators.required]],
        fechaInscripcion: ['', [Validators.required]]
        
      });
      this.formUpdateUsuario = fb.group({
        id_grupo: ['', [Validators.required]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        ciudad: ['', []],
        cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        telefono: ['', [Validators.pattern(/^$|^\d{10}$/)]],
        direccion: ['', []],
        genero: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        fechaNacimiento: ['', [Validators.required]],
        fechaInscripcion: ['', [Validators.required]]
      });
    }

    ngOnInit(): void {
      this.getUsuarios();
      this.getGrupo()
    }

    getUsuarios() {
      this.usuarioService.getAllUsuarios().subscribe(
        data => {
          this.usuario = data
          this.buscadorFiltrados = [...data];
          console.log(this.usuario)
        }
      );
    }

    getGrupo() {
      this.usuarioService.getAllGrupo().subscribe(data => {
        this.grupo = data
        console.log(this.grupo)
      });
    }

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
          ciudad: this.formSaveUsuario.value.ciudad,
          telefono: this.formSaveUsuario.value.telefono,
          direccion: this.formSaveUsuario.value.direccion,
          genero: this.formSaveUsuario.value.genero,
          edad: this.formSaveUsuario.value.edad,
          fechaNacimiento: this.formatDate(this.formSaveUsuario.value.fechaNacimiento),
          fechaInscripcion: this.formatDate(this.formSaveUsuario.value.fechaInscripcion),
          id_grupo: this.formSaveUsuario.value.id_grupo,
          id_rol: 3
        };

        this.usuarioService.createUsuario(newUsuario).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getUsuarios();
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
      this.formSaveUsuario.reset();
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

    getNombreGrupo(id: number): string {
      const grupoEncontrado = this.grupo.find(g => g.id === id);
      return grupoEncontrado ? grupoEncontrado.nombre : 'Sin grupo';
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
          ciudad: this.formUpdateUsuario.value.ciudad,
          telefono: this.formUpdateUsuario.value.telefono,
          direccion: this.formUpdateUsuario.value.direccion,
          genero: this.formUpdateUsuario.value.genero,
          edad: this.formUpdateUsuario.value.edad,
          fechaNacimiento: this.formatDate(this.formUpdateUsuario.value.fechaNacimiento),
          fechaInscripcion: this.formatDate(this.formUpdateUsuario.value.fechaInscripcion),
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
            this.errorMessageToast(); 
            console.error('Error actualizando usuario:', err);
          }
        });
      }
    }
    
    edit(id: number) {
    
      this.idForUpdate = id;
      this.user = this.usuario.find(e => e.id == id);
      if (this.user) {
        this.formUpdateUsuario.controls['nombre'].setValue(this.user?.nombre)
        this.formUpdateUsuario.controls['apellido'].setValue(this.user?.apellido)
        this.formUpdateUsuario.controls['cedula'].setValue(this.user?.cedula)
        this.formUpdateUsuario.controls['ciudad'].setValue(this.user?.ciudad)
        this.formUpdateUsuario.controls['telefono'].setValue(this.user?.telefono)
        this.formUpdateUsuario.controls['direccion'].setValue(this.user?.direccion)
        this.formUpdateUsuario.controls['genero'].setValue(this.user?.genero)
        this.formUpdateUsuario.controls['edad'].setValue(this.user?.edad)
        this.formUpdateUsuario.controls['fechaNacimiento'].setValue(new Date(this.user?.fechaNacimiento))
        this.formUpdateUsuario.controls['fechaInscripcion'].setValue(new Date(this.user?.fechaInscripcion))
        this.formUpdateUsuario.controls['id_grupo'].setValue(this.user?.id_grupo)
        
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
