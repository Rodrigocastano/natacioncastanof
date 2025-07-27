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
import { PruebaTorneo } from '../interfaces/pruebatorneo';
import { PruebanadadorService } from '../service/pruebanadador.service';
import { PruebaNadador } from '../interfaces/pruebanadador';
import { PruebatorneoService } from '../service/pruebatorneo.service';
import { Usuario } from '../interfaces/usuario';
import { UsuarioService } from '../service/usuario.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-pruebanadador',
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
  templateUrl: './pruebanadador.component.html',
})
export class PruebanadadorComponent implements OnInit{
  
      formSave!: FormGroup;
      visibleSave: boolean = false;
      pruebaNadador: PruebaNadador[] = [];
      idPruebaNadador: number = 0;
      visibleDelete: boolean = false;

      formUpdate!: FormGroup;
      tiempoNa: any
      idForUpdate: boolean = false;
      visibleUpdate: boolean = false;
      usuarios: Usuario[] = [];
      pruebaTorneo: PruebaTorneo[] = [];

      expandedRows = {};
      cols: any[] = [];
      expanded: boolean = false;
      msgs: ToastMessageOptions[] | null = [];

      submitted: boolean = false;
      maxDate: Date = new Date();
      fechaActual: Date = new Date();
      loading: boolean = true;

      terminoBusqueda: string = '';
      buscarOriginal: PruebaNadador[] = [];

      tiposNado: any[] = [];
  
      constructor(
        private fb: FormBuilder,
        private pruebanadadorService: PruebanadadorService,
        private usuarioService: UsuarioService,
        private pruebatorneoService: PruebatorneoService,
        private messageService: MessageService,
        
      ) {
        this.formSave = this.fb.group({
          id_usuario: ['', [Validators.required]],
          id_prueba_torneo: ['', [Validators.required]],
          tiempo: ['', [Validators.required]],
          fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
          
        });
        this.formUpdate = fb.group({
          id_usuario: ['', [Validators.required]],
          id_prueba_torneo: ['', [Validators.required]],
          tiempo: ['', [Validators.required]],
          fecha: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
        });
      }

  
      ngOnInit(): void {
        this.getPruebaNadador();
        this.getUsuarios();
        this.getPruebaTorneo()
      }

      getPruebaNadador() {
        this.pruebanadadorService.getAllTodoPruebaNadador().subscribe(
          data => {
             console.log('Datos recibidos:', data);
            this.pruebaNadador = data.data
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

getPruebaTorneo() {
  this.pruebatorneoService.getAllPruebaTorneoNombre().subscribe( 
    data => {
      this.pruebaTorneo = data.map((pruebaTorneo: any) => ({
        ...pruebaTorneo,
        displayPrueba: `${pruebaTorneo.nombre} - ${pruebaTorneo.categoria_tipo}`
      }));
      console.log(this.pruebaTorneo);
    }
  );
}

      
      filtrarBusqueda() {
        const termino = this.terminoBusqueda.trim().toLowerCase();
        this.pruebaNadador = this.buscarOriginal.filter(usuario => {
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

        const newPrueba: any = {
          id_usuario: this.formSave.value.id_usuario,
          id_prueba_torneo: this.formSave.value.id_prueba_torneo,
          fecha: this.formatDate(this.formSave.value.fecha),
          tiempo: tiempoFormateado,
        };

        this.pruebanadadorService.createPruebaNadador(newPrueba).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getPruebaNadador();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar registro de prueba nadador:', err);
          }
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
    
            const updatePrueba: PruebaNadador = {
                id: this.tiempoNa.id,
               id_usuario: this.formUpdate.value.id_usuario,
                id_prueba_torneo: this.formUpdate.value.id_prueba_torneo,
                tiempo: tiempoEnMinutos,
                fecha: this.formatDate(this.formUpdate.value.fecha),
            };
     console.log('Datos que se enviarán en la actualización:', updatePrueba);
            this.pruebanadadorService.updatePruebaNadador(this.tiempoNa.id, updatePrueba).subscribe({
                next: (res) => {
                    this.getPruebaNadador();
                    this.visibleUpdate = false;
                    this.saveMessageToast();
                },
                error: (err) => {
                    console.error('Error actualizando registro prueba nado:', err);
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
              this.formUpdate.controls['id_usuario'].setValue(this.tiempoNa?.id_usuario) 
              this.formUpdate.controls['id_prueba_torneo'].setValue(this.tiempoNa?.id_prueba_torneo);
              this.formUpdate.controls['fecha'].setValue(
              parseLocalDate(this.tiempoNa.fecha)
              );
              this.formUpdate.controls['tiempo'].setValue(this.tiempoNa?.tiempo);
              /* tiempo: this.tiempoNa.tiempo  */
          }
      
          this.visibleUpdate = true;
      }
      
      canceUpdate() {
        this.visibleUpdate = false;
        this.cancelMessageToast();
      }
      
      delete() {
        this.pruebanadadorService.deletePruebaNadador(this.idPruebaNadador).subscribe({
          next: () => {
            this.visibleDelete = false;
            this.getPruebaNadador();
            this.idPruebaNadador = 0;
            this.EliminadoMessageToasts(); 
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.errorMessageToast(); 
          }
        });
      }
      
      showModalDelete(id: number) {
        this.idPruebaNadador = id;
        this.visibleDelete = true
      }

      corregirTiempo() {
        const value = this.formSave.get('tiempo')?.value;
        if (!value) return;

        const parts = value.split(':');
        if (parts.length !== 3) return;

        let [hh, mm, ss] = parts.map(Number);

        if (isNaN(hh)) hh = 0;
        if (isNaN(mm)) mm = 0;
        if (isNaN(ss)) ss = 0;

        if (mm > 59) mm = 59;
        if (ss > 59) ss = 59;

        const tiempoFormateado = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
        this.formSave.get('tiempo')?.setValue(tiempoFormateado);
      }

      validarTiempo(event: any, formName: 'formSave' | 'formUpdate') {
        const input = event.target as HTMLInputElement;
        let caretPos = input.selectionStart || 0;

        let rawValue = input.value.replace(/[^0-9]/g, ''); // Solo números
        rawValue = rawValue.slice(0, 6);

        let hh = rawValue.slice(0, 2);
        let mm = rawValue.slice(2, 4);
        let ss = rawValue.slice(4, 6);

        hh = hh.padEnd(2, '0');
        mm = mm.padEnd(2, '0');
        ss = ss.padEnd(2, '0');

        if (parseInt(mm) > 59) mm = '59';
        if (parseInt(ss) > 59) ss = '59';

        const tiempoFormateado = `${hh}:${mm}:${ss}`;

        this[formName].get('tiempo')?.setValue(tiempoFormateado, { emitEvent: false });

        setTimeout(() => {
          input.selectionStart = input.selectionEnd = caretPos;
        }, 0);
      }
      
      prepararTiempo() {
        const control = this.formSave.get('tiempo');
        let value = control?.value;
        if (!value || !/^\d{2}:\d{2}:\d{2}$/.test(value)) {
          control?.setValue('00:00:00', { emitEvent: false });
        }
      }

    


      
}
      
