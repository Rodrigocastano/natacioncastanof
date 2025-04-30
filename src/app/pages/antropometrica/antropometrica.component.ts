import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Antropometrica } from '../interfaces/antropometrica';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AntropometricaService } from '../service/antropometrica.service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-antropometrica',
  imports: [
    CommonModule,
    /* toolbar */
    ButtonModule,
    ToolbarModule,
    /* table */
    InputIconModule,
    IconFieldModule,
    TableModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    /* mensaje */
    MessageModule,
    ToastModule,
    /* formulario */
    ReactiveFormsModule,
    DatePickerModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './antropometrica.component.html',
})
export class AntropometricaComponent implements OnInit{

    formSave!: FormGroup;
    visibleSave: boolean = false;
    antropometrica: Antropometrica[] = [];
    idAntropometrica: number = 0;
    visibleDelete: boolean = false;

    formUpdate!: FormGroup;
    antropome: any
    idForUpdate: boolean = false;
    visibleUpdate: boolean = false;
    usuarios: Usuario[] = [];

    expandedRows = {};
    cols: any[] = [];
    expanded: boolean = false;
    msgs: ToastMessageOptions[] | null = [];

    submitted: boolean = false;
    maxDate: Date = new Date();
    loading: boolean = true;

    constructor(
          private fb: FormBuilder,
          private antropometricaService: AntropometricaService,
          private usuarioService: UsuarioService,
          private messageService: MessageService
        ) {
          this.formSave = this.fb.group({
            id_usuario: ['', [Validators.required]],
            peso: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
            talla: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
            envergadura: ['', []],
            circuferencia_braquial: ['', []],
            pliegue_cutanio: ['', []],
            perimetro_cintura: ['', []],
            perimetro_cadera: ['', []],
            diametro_sagital: ['', []],
            fecha: ['', [Validators.required]]
            
          });
          this.formUpdate = fb.group({
            peso: ['', []],
            talla: ['', []],
            envergadura: ['', []],
            circuferencia_braquial: ['', []],
            pliegue_cutanio: ['', []],
            perimetro_cintura: ['', []],
            perimetro_cadera: ['', []],
            diametro_sagital: ['', []],
            fecha: ['', []],
            id_usuario: ['', []]
          });
    }
  
    ngOnInit(): void {
      this.getAntropometrica();
      this.getUsuarios();
    }

    getAntropometrica() {
      this.antropometricaService.getAllTodoAntropometrica().subscribe(
        data => {
          this.antropometrica = data.data
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
        const formValues = this.formSave.value;
    
        const newAntropometrica: any = {
          peso: formValues.peso,
          talla: formValues.talla,
          envergadura: formValues.envergadura || null,
          circuferencia_braquial: formValues.circuferencia_braquial || null,
          pliegue_cutanio: formValues.pliegue_cutanio || null,
          perimetro_cintura: formValues.perimetro_cintura || null,
          perimetro_cadera: formValues.perimetro_cadera || null,
          diametro_sagital: formValues.diametro_sagital || null,
          fecha: this.formatDate(formValues.fecha),
          id_usuario: formValues.id_usuario,
        };
    
        this.antropometricaService.createAntropometrica(newAntropometrica).subscribe({
          next: () => {
            this.saveMessageToast();
            this.getAntropometrica();
            this.visibleSave = false;
          },
          error: (err) => {
            console.error('Error al guardar la medida antropométrica:', err);
            this.errorMessageToast();
          }
        });
      }
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

    update() {
      if (this.formUpdate.invalid) {
        this.errorMessageToast(); 
        this.formUpdate.markAllAsTouched();
        return;
      }
      if (this.formUpdate.valid) {
        const updateAntropometrica: Antropometrica = {
          id: this.antropome.id,
          peso: this.formUpdate.value.peso,
          talla: this.formUpdate.value.talla,
          envergadura: this.formUpdate.value.envergadura,
          circuferencia_braquial: this.formUpdate.value.circuferencia_braquial,
          pliegue_cutanio: this.formUpdate.value.pliegue_cutanio,
          perimetro_cintura: this.formUpdate.value.perimetro_cintura,
          perimetro_cadera: this.formUpdate.value.perimetro_cadera,
          diametro_sagital: this.formUpdate.value.diametro_sagital,
          fecha: this.formatDate(this.formUpdate.value.fecha),
          id_usuario: this.formUpdate.value.id_usuario,
        };
    
        this.antropometricaService.updateAntropometrica(this.antropome.id, updateAntropometrica).subscribe({
          next: (res) => {
            this.getAntropometrica();
            this.visibleUpdate = false;
            this.saveMessageToast();
          },
          error: (err) => {
            console.error('Error actualizando medida antropometrica:', err);
            this.errorMessageToast(); 
          }
        });
      }
    }

    edit(elasticId: any) {
      console.log(elasticId)
      this.idForUpdate = true;
      this.antropome = elasticId
      if (this.antropome) {
        this.formUpdate.controls['peso'].setValue(this.antropome?.peso)
        this.formUpdate.controls['talla'].setValue(this.antropome?.talla)
        this.formUpdate.controls['envergadura'].setValue(this.antropome?.envergadura)
        this.formUpdate.controls['circuferencia_braquial'].setValue(this.antropome?.circuferencia_braquial)
        this.formUpdate.controls['pliegue_cutanio'].setValue(this.antropome?.pliegue_cutanio)
        this.formUpdate.controls['perimetro_cintura'].setValue(this.antropome?.perimetro_cintura)
        this.formUpdate.controls['perimetro_cadera'].setValue(this.antropome?.perimetro_cadera)
        this.formUpdate.controls['diametro_sagital'].setValue(this.antropome?.diametro_sagital)
        this.formUpdate.controls['fecha'].setValue(new Date(this.antropome?.fecha))
        this.formUpdate.controls['id_usuario'].setValue(this.antropome?.id_usuario) 
      }
      this.visibleUpdate = true;
      
    }

    canceUpdate() {
      this.visibleUpdate = false;
      this.cancelMessageToast();
    }

    delete() {
      this.antropometricaService.deleteAntropometrica(this.idAntropometrica).subscribe({
        next: () => {
          this.visibleDelete = false;
          this.getAntropometrica();
          this.idAntropometrica = 0;
          this.EliminadoMessageToasts(); 
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMessageToast();
        }
      });
    }
            
    showModalDelete(id: number) {
      this.idAntropometrica = id;
      this.visibleDelete = true
    }

}
