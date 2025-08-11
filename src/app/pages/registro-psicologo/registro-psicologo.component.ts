import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import 'jspdf-autotable';
import { registroPsicologo } from '../../../app/pages/interfaces/psicologo';
import { Ciudad } from '../../../app/pages/interfaces/ciudad';
import { Genero } from '../../../app/pages/interfaces/genero';
import { PsicologoService } from '../service/psicologo.service';
import { CiudadService } from '../service/ciudad.service';
import { GeneroService } from '../service/genero.service';
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

@Component({
  selector: 'app-registro-medico',
  templateUrl: './registro-psicologo.component.html',
  providers: [MessageService],
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
    DatePickerModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule
  ]
})
export class RegistroPsicologoComponent implements OnInit {
      formSave!: FormGroup;
      formUpdate!: FormGroup;
      psicologo: registroPsicologo[] = [];
      visibleSave = false;
      visibleUpdate = false;
      visibleDelete = false;
      idPsicologo: number = 0;
      idForUpdate: number = 0;
      loading = true;
      submitted = false;
      filtro = '';
      buscadorFiltrados: registroPsicologo[] = [];
      genero: Genero[] = [];
      ciudad: Ciudad[] = [];
      user: any
      maxDate: Date = new Date();
      fechaActual: Date = new Date();

      constructor(
        private fb: FormBuilder,
        private psicologoService: PsicologoService,
        private ciudadService: CiudadService,
        private generoService: GeneroService,
        private messageService: MessageService
        )  {
        this.formSave = this.fb.group({
          id_ciudad: ['', [Validators.required]],
          id_genero: ['', [Validators.required]],
          nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
          apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
          email: ['', [Validators.required, Validators.email]],
          cedula: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,10}$/)]],
          telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9 ]{7,15}$/)]],
          direccion: ['', []],
          fechaNacimiento: ['', [Validators.required]],
        });

        this.formUpdate = fb.group({
          id_ciudad: ['', [Validators.required]],
          id_genero: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
          apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
          cedula: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,10}$/)]],
          telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9 ]{7,15}$/)]],
          direccion: ['', []],
          fechaNacimiento: ['', [Validators.required]],
        });
      }

        ngOnInit(): void {
          this.getMedicos();
          this.getCiudad();
          this.getGenero();
        }

        getMedicos() {
          this.psicologoService.getRegistroPsicologo().subscribe(data => {
            this.psicologo = data;
            this.buscadorFiltrados = [...data];
            this.loading = false;
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
        }
  
  
        store() {
          this.submitted = true;
        
          if (this.formSave.invalid) {
            this.errorMessageToast();
            this.formSave.markAllAsTouched();
            return;
          }
        
          if (this.formSave.valid) {
            const formValues = this.formSave.getRawValue();
            const newPsicologo: any = {
              nombre: this.formSave.value.nombre,
              apellido: this.formSave.value.apellido,
              cedula: this.formSave.value.cedula,
              email: this.formSave.value.email,
              telefono: this.formSave.value.telefono,
              direccion: this.formSave.value.direccion,
              fechaNacimiento: this.formatDate(this.formSave.value.fechaNacimiento),

              id_ciudad: this.formSave.value.id_ciudad,
              id_genero: this.formSave.value.id_genero,
              id_rol: 5
            };
        
            console.log('Datos enviados al backend:', newPsicologo);
        
            this.psicologoService.createRegistroPsicologo(newPsicologo).subscribe({
              next: () => {
                this.saveMessageToast();
                this.getMedicos();
                this.visibleSave = false;
              },
              error: (err) => {
                if (err.status === 422) {
                  const backendErrors = err.error.errors;
                  
                  if (backendErrors.email) {
                    this.errorCorreoMessageToast();
                  }
                  if (backendErrors.cedula) {
                    this.errorCedulaMessageToast();
                  }
                } 
                else if (err.status === 409) {
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
          this.psicologo = [...this.buscadorFiltrados];
          } else {
          this.psicologo = this.buscadorFiltrados.filter(user =>
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
    
          const formValues = this.formUpdate.getRawValue(); 
          const updatePsicologo: registroPsicologo = {
            id: this.idForUpdate,
            nombre: formValues.nombre,
            apellido: formValues.apellido,
            cedula: formValues.cedula,
            email: formValues.email,
            telefono: formValues.telefono,
            direccion: formValues.direccion,
            fechaNacimiento: this.formatDate(formValues.fechaNacimiento),
            id_ciudad: formValues.id_ciudad,
            id_genero: formValues.id_genero,
            id_rol: 5
          };
    
          this.psicologoService.updateRegistroPsicologo(this.idForUpdate, updatePsicologo).subscribe({
            next: () => {
              this.saveMessageToast(); 
              this.getMedicos();
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
          this.user = this.psicologo.find(e => e.id == id);
    
          if (this.user) {
            const parseLocalDate = (dateString: string) => {
              return dateString ? new Date(dateString + 'T00:00:00') : null;
            };
    
      
            this.formUpdate.controls['nombre'].setValue(this.user?.nombre)
            this.formUpdate.controls['apellido'].setValue(this.user?.apellido)
            this.formUpdate.controls['cedula'].setValue(this.user?.cedula)
            this.formUpdate.controls['telefono'].setValue(this.user?.telefono)
            this.formUpdate.controls['direccion'].setValue(this.user?.direccion)
            this.formUpdate.controls['email'].setValue(this.user?.email)
            this.formUpdate.controls['id_ciudad'].setValue(this.user?.id_ciudad)
            this.formUpdate.controls['id_genero'].setValue(this.user?.id_genero)
            this.formUpdate.controls['fechaNacimiento'].setValue(
              parseLocalDate(this.user.fechaNacimiento)
            );
            
          }
          this.visibleUpdate = true;
        }
          
        cancelUpdate() {
          this.visibleUpdate = false;
          this.cancelMessageToast();
        }
    
        delete() {
          this.psicologoService.deleteRegistroPsicologo(this.idPsicologo).subscribe({
            next: () => {
              this.visibleDelete = false;
              this.getMedicos()
              this.idPsicologo = 0
              this.EliminadoMessageToasts(); 
            },
            error: (err) => {
              console.error('Error al eliminar:', err);
              this.errorMessageToast();
            }
          });
        }
        
        showModalDelete(id: number) {
          this.idPsicologo = id;
          this.visibleDelete = true
        }  
            
        exportPdf() {
          if (!this.psicologo?.length) return;
        
          const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
          const pageWidth  = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const marginL = 28, marginT = 50;
        
          const logo = new Image();
          logo.src = 'assets/image/natacion-castano1.png';
          doc.addImage(logo, 'PNG', marginL, 18, 50, 20);
          doc.setFont('Helvetica', 'bold').setFontSize(14);
          doc.text('Listado de psicóloco', marginL + 60, 30);
        
          const data = [...this.psicologo]
            .sort((a, b) => a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre))
            .map((e, idx) => [
              idx + 1,                            
              e.nombre,
              e.apellido,
              e.cedula,
              e.telefono,
              this.getNombreCiudad(e.id_ciudad),
              this.getNombreGenero(e.id_genero),
              e.fechaNacimiento
            ]);
        
          autoTable(doc, {
            startY: marginT,
            head: [[
              'Nº', 'Nombre', 'Apellido', 'Cédula', 'Teléfono',
              'Ciudad', 'Género', 'Nacimiento'
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
              7: { cellWidth: 80 },
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
        
          doc.save('Psicólogo.pdf');
        }
                
  }