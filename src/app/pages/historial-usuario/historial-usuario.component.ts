import { Component, OnInit } from '@angular/core';
import { HistorialUsuario } from '../interfaces/historialusuario'; 
import { HistorialUsuarioService } from '../service/historial-usuario.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GrupoService } from '../service/grupo.service';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { formatDate } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.component.html',
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    ToastModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    MessageModule,
    SelectModule,
    DatePickerModule,
  ]
})
export class HistorialUsuarioComponent implements OnInit {
  formSave!: FormGroup;
  submitted: boolean = false;
  visibleSave: boolean = false;
  historial: HistorialUsuario[] = [];
  loading: boolean = true;
  filtro: string = '';
  grupos: any[] = [];
  formUpdate!: FormGroup;
  usuarios: Usuario[] = [];
  idGrupoUsuario: number = 0;
  visibleDelete: boolean = false;
  idForUpdate: boolean = false;
  pag: any
  visibleUpdate: boolean = false;
  maxDate: Date = new Date();
  fechaActual: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private historialService: HistorialUsuarioService,
    private messageService: MessageService,
    private grupoService: GrupoService,
    private usuarioService: UsuarioService,
  ) {
         this.formSave = this.fb.group({
            id_usuario: ['', Validators.required],
            id_grupo: ['', Validators.required],
            fecha_inicio: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
            fecha_fin: [[]],
            estado_funcional: ['', []],
            turno: [null, Validators.required] 
          });

          this.formUpdate = this.fb.group({
            id_usuario: ['', Validators.required],
            id_grupo: ['', Validators.required],
            fecha_inicio: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
            fecha_fin: [[]],
            estado_funcional: ['', []],
            turno: [null, Validators.required] 
          });
        }
  

  ngOnInit(): void {
    this.getUsuarioGrupo();
    this.getUsuario();
    this.loadGrupos();
  }

    getUsuarioGrupo(): void {
      this.loading = true;
      this.historialService.getAllUsuarioGrupo().subscribe({
        next: (data) => {
          this.historial = data;
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar el historial de entrenador-grupo'
          });
          this.loading = false;
        }
      });
    }

    loadGrupos() {
      this.grupoService.getAllGrupo().subscribe(grupos => {
          this.grupos = grupos;
      });
    }

    getUsuario() {
      this.usuarioService.getAllUsuarios().subscribe(
        data => {
          this.usuarios = data.map((usuario: any) => ({
            ...usuario,
            display: `${usuario.nombre} ${usuario.apellido} - ${usuario.cedula}`
          }));
        }
      );
    }

    store()
    {
      this.submitted = true;

      if (this.formSave.invalid) {
        this.errorMessageToast();
        this.formSave.markAllAsTouched();
        return;
      }

      if (this.formSave.valid) {
        const presenteValue = this.formSave.value.estado_funcional !== null && this.formSave.value.estado_funcional !== undefined 
        ? this.formSave.value.estado_funcional 
        : true; 

        const newPago: any = {
          id_usuario: this.formSave.value.id_usuario,
          id_grupo: this.formSave.value.id_grupo,
          fecha_inicio: this.formatDate(this.formSave.value.fecha_inicio),
          /* fecha_fin: this.formatDate(this.formSave.value.fecha_fin), */
          estado_funcional: presenteValue, 
          turno: this.formSave.value.turno, 
        };
        console.log('Datos enviados al backend:', newPago);

        this.historialService.createUsuarioGrupos(newPago).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getUsuarioGrupo();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar esta matricula:', err);
            
          }
        });
      }
    }

    showSaveDialog()
    {
      this.formSave.reset();
      this.visibleSave = true;
    }

    saveMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Guardado correctamente' });
    }

    errorMessageToast() {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar el datos.' });
    }

    cancelMessageToast() {
      this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Cancelado!...' });
    }

    EliminadoMessageToasts() {
      this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Eliminado correctamente' });
    }
        
    formatDate = (date: Date): string => {
      const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return adjustedDate.toISOString().split('T')[0];
    };

    cancelSave() {
      this.visibleSave = false;
      this.cancelMessageToast();
    }

    delete() {
      this.historialService.destroyUsuarioGrupo(this.idGrupoUsuario).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getUsuarioGrupo();
          this.idGrupoUsuario = 0;
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }

    showModalDelete(id: number) {
      this.idGrupoUsuario = id;
      this.visibleDelete = true
    }

    edit(planPagoId: any) {
        this.idForUpdate = true;
        this.pag = planPagoId;

        if (this.pag) {
            const parseLocalDate = (dateString: string) => {
                return dateString ? new Date(dateString + 'T00:00:00') : null;
            };
            this.formUpdate.patchValue({
                id_usuario: this.pag.id_usuario,
                id_grupo: this.pag.id_grupo,
                estado_funcional: this.pag.estado_funcional === 1,
                fecha_inicio: parseLocalDate(this.pag.fecha_inicio),
                fecha_fin: parseLocalDate(this.pag.fecha_fin),
                turno: this.pag.turno ?? null,
            });

        }

        this.visibleUpdate = true;
    }

    canceUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }

    update() {
      if (this.formUpdate.invalid) return;

      const formData = this.formUpdate.value;

      const payload = {
          id: this.pag.id,
          id_usuario: formData.id_usuario,
          id_grupo: formData.id_grupo,
          fecha_inicio: this.formatDate(formData.fecha_inicio),
          fecha_fin: formData.fecha_fin ? this.formatDate(formData.fecha_fin) : null,
          estado_funcional: formData.estado_funcional ? 1 : 0,
          turno: formData.turno,
      };

      console.log('Payload completo:', JSON.stringify(payload, null, 2));

      this.historialService.updateUsuarioGrupos(this.pag.id, payload).subscribe({
          next: () => {
              this.getUsuarioGrupo();
              this.visibleUpdate = false;
              this.saveMessageToast();
          },
          error: (err) => {
              console.error('Error del backend:', {
                  request: payload,
                  response: err.error
              });
              this.errorMessageToast();
          }
      });
    }

    getNombreCompleto(registro: HistorialUsuario): string {
      return `${registro.nombre} ${registro.apellido}`;
    }

    cancelarMatricula(id: number) {
      this.historialService.cancelarMatricula(id).subscribe({
        next: () => {
          this.getUsuarioGrupo(); // Recarga la tabla
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Matrícula cancelada correctamente' });
        },
        error: (err) => {
          console.error('Error al cancelar matrícula:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cancelar la matrícula' });
        }
      });
    }


}
