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
import { AreaNado } from '../interfaces/areanado';
import { CategoriadistanciaService } from '../service/categoriadistancia.service';
import { CategoriaDistancia } from '../interfaces/categoriadistancia';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
import { TorneonadoService } from '../service/torneonado.service';
import { TorneoNado } from '../interfaces/torneonado';
import { TorneoService } from '../service/torneo.service';
import { Torneo } from '../interfaces/torneo';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-torneonado',
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
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './torneonado.component.html',
})
export class TorneonadoComponent implements OnInit{
  
      formSave!: FormGroup;
      visibleSave: boolean = false;
      torneoNado: TorneoNado[] = [];
      idTorneoNado: number = 0;
      visibleDelete: boolean = false;

      formUpdate!: FormGroup;
      torneoNa: any
      idForUpdate: boolean = false;
      visibleUpdate: boolean = false;
      usuarios: Usuario[] = [];
      torneo: Torneo[] = [];
      areanado: AreaNado[] = [];
      categoriaDistancia: CategoriaDistancia[] = [];

      expandedRows = {};
      cols: any[] = [];
      expanded: boolean = false;
      msgs: ToastMessageOptions[] | null = [];

      submitted: boolean = false;
      maxDate: Date = new Date();
      loading: boolean = true;

       terminoBusqueda: string = '';
      buscarOriginal: TorneoNado[] = [];
  
      constructor(
        private fb: FormBuilder,
        private TorneonadoService: TorneonadoService,
        private torneoService: TorneoService,
        private usuarioService: UsuarioService,
        private categoriadistanciaService: CategoriadistanciaService,
        private messageService: MessageService
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          id_torneo: ['', [Validators.required]],
          id_area_nado: ['', [Validators.required]],
          id_categoria: ['', [Validators.required]],
          tiempo: ['', [Validators.required]],
          fecha: ['', [Validators.required]]
          
        });
        this.formUpdate = fb.group({
          id_usuario: ['', [Validators.required]],
          id_torneo: ['', [Validators.required]],
          id_area_nado: ['', [Validators.required]],
          id_categoria: ['', [Validators.required]],
          tiempo: ['', [Validators.required]],
          fecha: ['', [Validators.required]]
        });
      }
  
      ngOnInit(): void {
        this.getTorneoNado();
        this.getUsuarios();
        this.getAreaNado();
        this.getTorneo();
        this.getCategoria()
      }

      getTorneoNado() {
        this.TorneonadoService.getAllTodoTorneoNado().subscribe(
          data => {
            this.torneoNado = data.data
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

      getAreaNado() {
        this.TorneonadoService.getAllAreaNado().subscribe(
          data => {
            this.areanado = data.map((areanado: any) => ({
              ...areanado,
              displayArea: `${areanado.areas}`
            }));
            console.log(this.areanado);
          }
        );
      }

      getTorneo() {
        this.torneoService.getAllTorneo().subscribe(
          data => {
            this.torneo = data.map((torneo: any) => ({
              ...torneo,
              displayTorneo: `${torneo.nombre}`
            }));
            console.log(this.torneo);
          }
        );
      }

      tiposNado = [
        { id: 1, nombre: 'Libre' },
        { id: 2, nombre: 'Mariposa' },
        { id: 3, nombre: 'Espalda' },
        { id: 4, nombre: 'Pecho' }
      ];
      
      getCategoria() {
        this.categoriadistanciaService.getAllCategoriasDistancia().subscribe(
          data => {
            this.categoriaDistancia = data.map((categoriaDistancia: any) => {
              const tipo = this.tiposNado.find(t => t.id === categoriaDistancia.id_tipo_nado);
              return {
                ...categoriaDistancia,
                displayCategoria: `${categoriaDistancia.distancia} - ${tipo ? tipo.nombre : categoriaDistancia.id_tipo_nado}`
              };
            });
            console.log(this.categoriaDistancia);
          }
        );
      }

      filtrarBusqueda() {
        const termino = this.terminoBusqueda.trim().toLowerCase();
        this.torneoNado = this.buscarOriginal.filter(usuario => {
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
      
        if (this.formSave.valid) {
          const tiempoMinutos = this.formSave.value.tiempo;
          const horas = Math.floor(tiempoMinutos / 60);
          const minutos = tiempoMinutos % 60;
          const tiempoFormateado = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:00`;
      
          const newTorneo: any = {
            id_usuario: this.formSave.value.id_usuario,
            id_torneo: this.formSave.value.id_torneo,
            id_area_nado: this.formSave.value.id_area_nado,
            id_categoria: this.formSave.value.id_categoria,
            fecha: this.formatDate(this.formSave.value.fecha),
            tiempo: tiempoFormateado,
          };
      
          this.TorneonadoService.createTorneoNado(newTorneo).subscribe({
            next: () => {
              this.saveMessageToast();
              this.getTorneoNado();
              this.visibleSave = false;
            },
            error: (err) => {
              console.error('Error al guardar registro del pago:', err);
            }
          });
        }
      }

      getNombreTorneo(id: number): string {
        const estado = this.torneo.find(tp => tp.id === id);
        return estado ? estado.nombre : 'Desconocido';
      }
        
      getNombreCategoria(id: number): string {
        const categoria = this.categoriaDistancia.find(c => c.id === id);
        return categoria ? `${categoria.distancia} metros` : 'Desconocido';
      }
        
      getNombreAreaNado(id: number): string {
        const estado = this.areanado.find(ep => ep.id === id);
        return estado ? estado.areas : 'Desconocido';
      }
  
      showSaveDialog() {
        this.formSave.reset();
        this.visibleSave = true;
      }
  
      formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
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
    
            const updatePago: TorneoNado = {
                id: this.torneoNa.id,
                id_usuario: this.formUpdate.value.id_usuario?.id ?? this.formUpdate.value.id_usuario,
                id_area_nado: this.formUpdate.value.id_area_nado,
                id_categoria: this.formUpdate.value.id_categoria,
                id_torneo: this.formUpdate.value.id_torneo,
                tiempo: tiempoEnMinutos,
                fecha: this.formatDate(this.formUpdate.value.fecha),
            };
    
            this.TorneonadoService.updateTorneoNado(this.torneoNa.id, updatePago).subscribe({
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
      
      edit(elasticId: any) {
          this.idForUpdate = true;
          this.torneoNa = elasticId;
      
          if (this.torneoNa) {
              this.formUpdate.controls['id_usuario'].setValue(this.torneoNa?.id_usuario);
              this.formUpdate.controls['id_area_nado'].setValue(this.torneoNa?.id_area_nado);
              this.formUpdate.controls['id_categoria'].setValue(this.torneoNa?.id_categoria);
              this.formUpdate.controls['id_torneo'].setValue(this.torneoNa?.id_torneo);
              this.formUpdate.controls['fecha'].setValue(new Date(this.torneoNa?.fecha));

              if (this.torneoNa?.tiempo) {
                  const tiempoString = this.torneoNa.tiempo; // por ejemplo: '00:34:00'
                  const [horas, minutos, segundos] = tiempoString.split(':').map(Number);
                  const totalMinutos = horas * 60 + minutos + Math.floor(segundos / 60);
      
                  this.formUpdate.controls['tiempo'].setValue(totalMinutos);  // Establecer el tiempo en minutos
              }
          }
      
          this.visibleUpdate = true;
      }

      canceUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }

      delete() {
        this.TorneonadoService.deleteTorneoNado(this.idTorneoNado).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getTorneoNado();
            this.idTorneoNado = 0;
            this.EliminadoMessageToasts(); 
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.errorMessageToast(); 
          }
        });
      }

      showModalDelete(id: number) {
        this.idTorneoNado = id;
        this.visibleDelete = true
      }

}
