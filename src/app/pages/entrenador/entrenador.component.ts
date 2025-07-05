import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { Entrenador } from '../../../app/pages/interfaces/entrenador'; 
import { Grupo } from '../../../app/pages/interfaces/grupo'; 
import { Ciudad } from '../../../app/pages/interfaces/ciudad'; 
import { Genero } from '../../../app/pages/interfaces/genero'; 
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
import { CiudadService } from '../service/ciudad.service';
import { GeneroService } from '../service/genero.service';

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
    genero: Genero[] = [];
    ciudad: Ciudad[] = [];
    submitted: boolean = false;
    mostrarPassword: boolean = false;
    maxDate: Date = new Date();
    fechaActual: Date = new Date();
    loading: boolean = true;

    constructor(
      private fb: FormBuilder,
      private entrenadorService: EntrenadorService,
      private grupoService :GrupoService,
      private ciudadService: CiudadService,
      private generoService: GeneroService,
      private messageService: MessageService
    ) {
      this.formSave = this.fb.group({
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

      this.formSave.get('fechaNacimiento')?.valueChanges.subscribe((date) => {
        if (date) {
          const age = this.calculateAge(new Date(date));
          this.formSave.get('edad')?.setValue(age, {emitEvent: false});
        }
      });

      this.formUpdate = fb.group({
        id_grupo: ['', [Validators.required]],
        id_ciudad: ['', [Validators.required]],
        id_genero: ['', [Validators.required]],
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', []],
        cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        direccion: ['', []],
        edad: [{value: '', disabled: true}, [Validators.required, Validators.pattern('^[0-9]+$')]], 
        fechaNacimiento: ['', [Validators.required]],
        fechaInscripcion: [formatDate(new Date(), 'yyyy-MM-dd', 'en')]
      });

      this.formUpdate.get('fechaNacimiento')?.valueChanges.subscribe((date) => {
        if (date) {
          const age = this.calculateAge(new Date(date));
          this.formUpdate.get('edad')?.setValue(age, { emitEvent: false });
        }
      });
    }


    ngOnInit(): void {
        this.getentrenador();
        this.getGrupo()
        this.getGenero()
        this.getCiudad()
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

    soloNumeros(event: any): boolean {
  // Obtiene el valor actual del input
  const input = event.target as HTMLInputElement;
  // Elimina cualquier carácter no numérico
  const newValue = input.value.replace(/[^0-9]/g, '');
  
  // Actualiza el valor en el formulario
  this.formSave.get(event.target.id)?.setValue(newValue, { emitEvent: false });
  
  // Limita a 10 caracteres
  if (newValue.length > 10) {
    this.formSave.get(event.target.id)?.setValue(newValue.slice(0, 10), { emitEvent: false });
    input.value = newValue.slice(0, 10);
  }
  
  return false; // Previene el comportamiento por defecto
}

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

    formatDate = (date: Date): string => {
      const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return adjustedDate.toISOString().split('T')[0];
    }

   /*  soloNumeros(event: KeyboardEvent) {
      const charCode = event.charCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault();
      }
    } */

    store() {
      this.submitted = true;
      this.formSave.get('edad')?.enable();
    
      if (this.formSave.invalid) {
        this.errorMessageToast();
        this.formSave.markAllAsTouched();
        this.formSave.get('edad')?.disable();
        return;
      }
    
      if (this.formSave.valid) {
          const formValues = this.formSave.getRawValue();
          this.formSave.get('edad')?.disable();

        const newEntrenador: any = {
          nombre: this.formSave.value.nombre,
          apellido: this.formSave.value.apellido,
          cedula: this.formSave.value.cedula,
          email: this.formSave.value.email,
          password: this.formSave.value.password,
          telefono: this.formSave.value.telefono,
          direccion: this.formSave.value.direccion,
          edad: formValues.edad,
          fechaNacimiento: this.formatDate(this.formSave.value.fechaNacimiento),
          fechaInscripcion: this.formatDate(this.formSave.value.fechaInscripcion),
          id_ciudad: this.formSave.value.id_ciudad,
          id_genero: this.formSave.value.id_genero,
          id_grupo: this.formSave.value.id_grupo,
          id_rol: 2
        };
    
        console.log('Datos enviados al backend:', newEntrenador);

        this.entrenadorService.createEntrenadore(newEntrenador).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getentrenador();
            this.visibleSave = false;
          },
          error: (err) => {
            if (err.status === 409 && err.error.message === 'Identificación duplicada') {
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

      errorCedulaMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Identificación duplicada', detail: 'Ya existe un entrenador registrado con esta identificación.'});
    }
  
    errorCorreoMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Correo duplicado', detail: 'Ya existe un entrenador registrado con este correo.'});
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
      this.formUpdate.get('edad')?.enable();

      if (this.formUpdate.invalid) {
        this.errorMessageToast(); 
        this.formUpdate.markAllAsTouched();
        this.formUpdate.get('edad')?.disable();
        return;
      }

      const formValues = this.formUpdate.getRawValue();
      this.formUpdate.get('edad')?.disable();

      const updateUsuario: Entrenador = {
        id: this.idForUpdate,
        nombre: formValues.nombre,
        apellido: formValues.apellido,
        cedula: formValues.cedula,
        email: formValues.email,
        password: formValues.password,
        telefono: formValues.telefono,
        direccion: formValues.direccion,
        edad: formValues.edad,
        fechaNacimiento: this.formatDate(formValues.fechaNacimiento),
        fechaInscripcion: this.formatDate(formValues.fechaInscripcion),
        id_ciudad: formValues.id_ciudad,
        id_genero: formValues.id_genero,
        id_grupo: formValues.id_grupo,
        id_rol: 2
      };

      this.entrenadorService.updateEntrenadore(this.idForUpdate, updateUsuario).subscribe({
        next: () => {
          this.saveMessageToast(); 
          this.getentrenador();
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
      this.user = this.entrenador.find(e => e.id == id);

      if (this.user) {
        const parseLocalDate = (dateString: string) => {
          return dateString ? new Date(dateString + 'T00:00:00') : null;
        };

  
        this.formUpdate.controls['nombre'].setValue(this.user?.nombre)
        this.formUpdate.controls['apellido'].setValue(this.user?.apellido)
        this.formUpdate.controls['cedula'].setValue(this.user?.cedula)
        this.formUpdate.controls['telefono'].setValue(this.user?.telefono)
        this.formUpdate.controls['direccion'].setValue(this.user?.direccion)
        this.formUpdate.controls['password'].setValue(this.user?.password)
        this.formUpdate.controls['email'].setValue(this.user?.email)
        this.formUpdate.controls['edad'].setValue(this.user?.edad)
        this.formUpdate.controls['id_ciudad'].setValue(this.user?.id_ciudad)
        this.formUpdate.controls['id_genero'].setValue(this.user?.id_genero)
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
  if (!this.entrenador?.length) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginL = 28, marginT = 50;

  const logo = new Image();
  logo.src = 'assets/image/natacion-castano1.png';
  doc.addImage(logo, 'PNG', marginL, 18, 50, 20);
  doc.setFont('Helvetica', 'bold').setFontSize(14);
  doc.text('Listado de entrenadores', marginL + 60, 30);

  const data = [...this.entrenador]
    .sort((a, b) => a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre))
    .map((e, idx) => [
      idx + 1,                            
      e.nombre,
      e.apellido,
      e.cedula,
      e.telefono,
      this.getNombreCiudad(e.id_ciudad),
      this.getNombreGenero(e.id_genero),
      e.edad,
      e.fechaNacimiento
    ]);

  autoTable(doc, {
    startY: marginT,
    head: [[
      'Nº', 'Nombre', 'Apellido', 'Cédula', 'Teléfono',
      'Ciudad', 'Género', 'Edad', 'Nacimiento'
    ]],
    body: data,
    theme: 'striped',
    styles:    { fontSize: 9, halign: 'center', overflow: 'linebreak' },
    headStyles:{ fillColor: [22,160,133], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 25 },
      3: { cellWidth: 80 },
      4: { cellWidth: 75 },
      5: { cellWidth: 60 },
      7: { cellWidth: 33 },
      8: { cellWidth: 65 }
    },
    margin: { left: marginL, right: marginL }
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8).setTextColor(100);
    doc.text(`Página ${i} de ${pageCount}`,
             pageWidth - marginL - 40,
             pageHeight - 10);
    if (i === pageCount) {
      doc.text(`Generado: ${new Date().toLocaleDateString()}`,
               marginL,
               pageHeight - 10);
    }
  }

  doc.save('Entrenadores.pdf');
}
         
}