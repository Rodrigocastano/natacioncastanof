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
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        direccion: ['', []],
        edad: [{value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+$')]], 
        fechaNacimiento: ['', [Validators.required]],
        fechaInscripcion: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
      });

      this.formSaveUsuario.get('fechaNacimiento')?.valueChanges.subscribe((date) => {
        if (date) {
          const age = this.calculateAge(new Date(date));
          this.formSaveUsuario.get('edad')?.setValue(age, {emitEvent: false});
        }
      });
      
      this.formUpdateUsuario = fb.group({
        id_grupo: ['', [Validators.required]],
        id_ciudad: ['', [Validators.required]],
        id_genero: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', []],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        direccion: ['', []],
        edad: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]+$')]],
        fechaNacimiento: ['', [Validators.required]],
        fechaInscripcion: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
      });

      this.formUpdateUsuario.get('fechaNacimiento')?.valueChanges.subscribe((date) => {
        if (date) {
          const age = this.calculateAge(new Date(date));
          this.formUpdateUsuario.get('edad')?.setValue(age, { emitEvent: false });
        }
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

    calculateAge(birthDate: Date): number {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
          age--;
        }
        
        return age;
    }


    soloNumeros(event: any): boolean {
      const input = event.target as HTMLInputElement;
      const newValue = input.value.replace(/[^0-9]/g, '');
      this.formSaveUsuario.get(event.target.id)?.setValue(newValue, { emitEvent: false });
      if (newValue.length > 10) {
        this.formSaveUsuario.get(event.target.id)?.setValue(newValue.slice(0, 10), { emitEvent: false });
        input.value = newValue.slice(0, 10);
      }
      
      return false;
    }

   store() {
  this.submitted = true;
  this.formSaveUsuario.get('edad')?.enable();

  if (this.formSaveUsuario.invalid) {
    this.errorMessageToast();
    this.formSaveUsuario.markAllAsTouched();
    this.formSaveUsuario.get('edad')?.disable();
    return;
  }

  if (this.formSaveUsuario.valid) {
    const formValues = this.formSaveUsuario.getRawValue();
    this.formSaveUsuario.get('edad')?.disable();

    const newUsuario: any = {
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      email: formValues.email,
      password: formValues.password,
      cedula: formValues.cedula,
      telefono: formValues.telefono,
      direccion: formValues.direccion,
      edad: formValues.edad,
      fechaNacimiento: this.formatDate(formValues.fechaNacimiento),
      fechaInscripcion: this.formatDate(formValues.fechaInscripcion),
      id_ciudad: formValues.id_ciudad,
      id_genero: formValues.id_genero,
      id_grupo: formValues.id_grupo,
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
      if (err.status === 409 && err.error.message === 'Identificación duplicada') {
        this.errorCedulaMessageToast();
      } else if (err.status === 422 && err.error.message.includes('email')) {
            this.errorCorreoMessageToast();
          } 
          else {
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



    errorCedulaMessageToast() {
      this.messageService.add({
        severity: 'error',
        summary: 'Identificación duplicada',
        detail: 'Ya existe un usuario registrado con esta identificación.'
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

      errorCorreoMessageToast() {
    this.messageService.add({
      severity: 'error',
      summary: 'Correo duplicado',
      detail: 'Ya existe un entrenador registrado con este correo.'
    });
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

  this.formUpdateUsuario.get('edad')?.enable();

  if (this.formUpdateUsuario.invalid) {
    this.errorMessageToast();
    this.formUpdateUsuario.markAllAsTouched();
    this.formUpdateUsuario.get('edad')?.disable();
    return;
  }

  const formValues = this.formUpdateUsuario.getRawValue();
  this.formUpdateUsuario.get('edad')?.disable(); 

  const updateUsuario: Usuario = {
    id: this.idForUpdate,
    nombre: formValues.nombre,
    apellido: formValues.apellido,
    email: formValues.email,
    password: formValues.password,
    cedula: formValues.cedula,
    telefono: formValues.telefono,
    direccion: formValues.direccion,
    edad: formValues.edad,
    fechaNacimiento: this.formatDate(formValues.fechaNacimiento),
    fechaInscripcion: this.formatDate(formValues.fechaInscripcion),
    id_ciudad: formValues.id_ciudad,
    id_genero: formValues.id_genero,
    id_grupo: formValues.id_grupo,
    id_rol: 3
  };

  this.usuarioService.updateUsuario(this.idForUpdate, updateUsuario).subscribe({
    next: () => {
      this.saveMessageToast();
      this.getUsuarios();
      this.visibleUpdate = false;
      this.idForUpdate = 0;
    },
    error: (err) => {
      if (err.status === 409 && err.error.message === 'Cédula duplicada') {
        this.errorCedulaMessageToast();
      } else if (err.status === 422 && err.error.message.includes('email')) {
            this.errorCorreoMessageToast();
          } 
          else {
            this.errorMessageToast();
          }
    }
  });
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
        this.formUpdateUsuario.controls['password'].setValue(this.user?.password)
        this.formUpdateUsuario.controls['email'].setValue(this.user?.email)
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
