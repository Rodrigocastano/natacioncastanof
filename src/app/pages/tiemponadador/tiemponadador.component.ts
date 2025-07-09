import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { CategoriadistanciaService } from '../service/categoriadistancia.service';
import { CategoriaDistancia } from '../interfaces/categoriadistancia';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
import { TiemponadadorService } from '../service/tiemponadador.service';
import { TiempoNadador } from '../interfaces/tiemponadador';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';
import { TiponadoService } from '../service/tiponado.service';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-tiemponadador',
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
    RadioButtonModule,
    TextareaModule,
    MessageModule,
    ToastModule,
    ReactiveFormsModule,
    DatePickerModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule,
    InputMaskModule
  ],
  providers: [MessageService],
  templateUrl: './tiemponadador.component.html',
})
export class TiemponadadorComponent implements OnInit{
  
      formSave!: FormGroup;
      visibleSave: boolean = false;
      tiempoNadador: TiempoNadador[] = [];
      idTiempoNadador: number = 0;
      visibleDelete: boolean = false;

      formUpdate!: FormGroup;
      tiempoNa: any
      idForUpdate: boolean = false;
      visibleUpdate: boolean = false;
      usuarios: Usuario[] = [];
      categoriaDistancia: CategoriaDistancia[] = [];

      expandedRows = {};
      cols: any[] = [];
      expanded: boolean = false;
      msgs: ToastMessageOptions[] | null = [];

      submitted: boolean = false;
      maxDate: Date = new Date();
      fechaActual: Date = new Date();
      loading: boolean = true;

      terminoBusqueda: string = '';
      buscarOriginal: TiempoNadador[] = [];

      tiposNado: any[] = [];
  
      constructor(
        private fb: FormBuilder,
        private tiemponadadorService: TiemponadadorService,
        private usuarioService: UsuarioService,
        private categoriadistanciaService: CategoriadistanciaService,
        private messageService: MessageService,
        private tiponadoService: TiponadoService
        
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          id_categoria: ['', [Validators.required]],
          tiempo: ['', [Validators.required]],
          fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
          
        });
        this.formUpdate = fb.group({
          id_usuario: ['', [Validators.required]],
          id_categoria: ['', [Validators.required]],
          tiempo: ['', [Validators.required]],
          fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
        });
      }
  
      ngOnInit(): void {
        this.getTorneoNado();
        this.getUsuarios();
        this.getCategoria()
      }

      getTorneoNado() {
        this.tiemponadadorService.getAllTodoTiemposNado().subscribe(
          data => {
            this.tiempoNadador = data.data
            this.buscarOriginal = data.data; 
            this.loading = false;
          }
        );
      }

      getUsuarios() {
        this.usuarioService.getAllUsuarios().subscribe(
          data => {
            this.usuarios = data.map((usuario: any) => ({
              ...usuario,
              display: `${usuario.nombre} ${usuario.apellido} - ${usuario.cedula}`
            }));
            console.log(this.usuarios);
          }
        );
      }

      getCategoria() {
        this.categoriadistanciaService.getAllCategoriasDistanciaTipos().subscribe(data => {
          this.categoriaDistancia = data.map(c => {
            const tipoNombre = typeof c.id_tipo_nado === 'object' 
              ? c.id_tipo_nado.nombre 
              : this.tiposNado.find(t => t.id === c.id_tipo_nado)?.nombre;
            return { ...c, displayCategoria: `${c.distancia} - ${tipoNombre || c.id_tipo_nado}` };
          });
        });
      }
      
      filtrarBusqueda() {
        const termino = this.terminoBusqueda.trim().toLowerCase();
        this.tiempoNadador = this.buscarOriginal.filter(usuario => {
          return (
            usuario.nombre?.toLowerCase().includes(termino) ||
            usuario.apellido?.toLowerCase().includes(termino) ||
            usuario.cedula?.toLowerCase().includes(termino)
          );
        });
      }

      abrirExpand(event: TableRowExpandEvent) {
        this.messageService.add({ 
          severity: 'info', 
          summary: 'Abierto Expandicion de', 
          detail: event.data.nombre, 
          life: 3000 });
      }

      cerrarCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({
            severity: 'success',
            summary: 'Cerrado Expandicion de ',
            detail: event.data.nombre,
            life: 3000
        });
      }

      store() {
        this.submitted = true;

        if (this.formSave.invalid) {
          this.errorMessageToast();
          this.formSave.markAllAsTouched();
          return;
        }

        const tiempoStr: string = this.formSave.value.tiempo; 
        const [hStr, mStr, sStr] = tiempoStr.split(':');
        const h = Number(hStr), m = Number(mStr), s = Number(sStr);

        if ([h, m, s].some(n => isNaN(n))) { 
          this.errorMessageToast();
          return;
        }
        const tiempoFormateado = tiempoStr.padStart(8, '0'); 

        const newTorneo: any = {
          id_usuario:  this.formSave.value.id_usuario,
          id_categoria: this.formSave.value.id_categoria,
          fecha:        this.formatDate(this.formSave.value.fecha),
          tiempo:       tiempoFormateado,
        };

        this.tiemponadadorService.createTiemposNado(newTorneo).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getTorneoNado();
            this.visibleSave = false;
          },
          error: (err) => console.error('Error al guardar registro del tiempo:', err)
        });
      }

      showSaveDialog() {
        this.formSave.reset();
        this.visibleSave = true;
      }
  
      formatDate = (date: Date): string => {
        const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return adjustedDate.toISOString().split('T')[0];
      };
    
      saveMessageToast() {
        this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Guardado correctamente' });
      }
  
      cancelMessageToast() {
        this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Cancelado!...' });
      }
  
      errorMessageToast() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al guardar el datos.' });
      }
  
      EliminadoMessageToasts() {
        this.messageService.add({ severity: 'success', summary: 'Éxitos', detail: 'Eliminado correctamente' });
      }
  
      cancelSave() {
        this.visibleSave = false;
        this.cancelMessageToast();
      }

      convertirTiempoAMinutos(tiempo: string): number {
            const [horas, minutos, segundos] = tiempo.split(':').map(Number);
            const totalMinutos = horas * 60 + minutos + Math.floor(segundos / 60);
            return totalMinutos;
      }
      
      update() {
        if (this.formUpdate.invalid) {
            this.errorMessageToast();
            this.formUpdate.markAllAsTouched();
            return;
        }

        
        if (this.formUpdate.valid) {
            const tiempoEnMinutos = this.formUpdate.value.tiempo;
    
            const updateTiempo: TiempoNadador = {
                id: this.tiempoNa.id,
                id_usuario: this.formUpdate.value.id_usuario?.id ?? this.formUpdate.value.id_usuario,
                id_categoria: this.formUpdate.value.id_categoria,
                tiempo: tiempoEnMinutos,
                fecha: this.formatDate(this.formUpdate.value.fecha),
            };

            console.log('Datos enviados al backend:', updateTiempo);
    
    
            this.tiemponadadorService.updateTiemposNado(this.tiempoNa.id, updateTiempo).subscribe({
                next: (res) => {
                    this.getTorneoNado();
                    this.visibleUpdate = false;
                    this.saveMessageToast();
                },
                error: (err) => {
                    console.error('Error actualizando registro torneo nado:', err);
                    this.errorMessageToast();
                }
            });
        }
      }
            
      edit(tiempoId: any) {
          this.idForUpdate = true;
          this.tiempoNa = tiempoId;
      
          if (this.tiempoNa) {
              const parseLocalDate = (dateString: string) => {
              return dateString ? new Date(dateString + 'T00:00:00') : null;
              };
              this.formUpdate.controls['id_usuario'].setValue(this.tiempoNa?.id_usuario);
              this.formUpdate.controls['id_categoria'].setValue(this.tiempoNa?.id_categoria);
              this.formUpdate.controls['fecha'].setValue(
              parseLocalDate(this.tiempoNa.fecha)
              );

              if (this.tiempoNa?.tiempo) {
                  const tiempoString = this.tiempoNa.tiempo;
                  const [horas, minutos, segundos] = tiempoString.split(':').map(Number);
                  const totalMinutos = horas * 60 + minutos + Math.floor(segundos / 60);
      
                  this.formUpdate.controls['tiempo'].setValue(totalMinutos); 
              }
          }
      
          this.visibleUpdate = true;
      }
      
      canceUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }
      
      delete() {
        this.tiemponadadorService.deleteTiemposNado(this.idTiempoNadador).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getTorneoNado();
            this.idTiempoNadador = 0;
            this.EliminadoMessageToasts(); 
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.errorMessageToast(); 
          }
        });
      }
      
      showModalDelete(id: number) {
        this.idTiempoNadador = id;
        this.visibleDelete = true
      }
      
      }
      