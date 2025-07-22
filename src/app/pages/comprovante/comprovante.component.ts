import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ComprovanteService, PagoUsuario } from '../service/comprovante.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-comprovante',
  standalone: true,
  templateUrl: './comprovante.component.html',
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    TableModule,
    ToolbarModule
  ]
})
export class ComprovanteComponent implements OnInit {

  fechaInicio: Date | null = null;
  fechaFin:   Date | null = null;
  usuarios: any[] = [];
  usuarioSel: any | null = null;
  pagos: PagoUsuario[] = [];
  mostrarMensajeVacio: boolean = false;

  constructor(private comproService: ComprovanteService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.comproService.obtenerUsuarios().subscribe({
      next: usuarios => {
        this.usuarios = usuarios.map(u => ({
          ...u,
          nombreCompleto: `${u.nombre} ${u.apellido} - ${u.cedula} `
        }));
      },
      error: err => console.error('Error al cargar usuarios:', err)
    });
  }

  private firstDay(date: Date): string {
    return new Date(date.getFullYear(), date.getMonth(), 1)
           .toISOString().split('T')[0];
  }

  private lastDay(date: Date): string {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
           .toISOString().split('T')[0];
  }

  buscarPagos(): void {
    if (!this.fechaInicio || !this.fechaFin || !this.usuarioSel) {
      return;
    }

    this.pagos = [];
    this.mostrarMensajeVacio = false;

    const inicio = this.firstDay(this.fechaInicio);
    const fin = this.lastDay(this.fechaFin);

    this.comproService.getPagosPorUsuario(inicio, fin, this.usuarioSel.id).subscribe({
      next: data => {
        this.pagos = data;
        this.mostrarMensajeVacio = data.length === 0;
      },
      error: err => {
        console.error('Error al obtener pagos', err);
        this.mostrarMensajeVacio = true;

      }
    });
  }

  descargarPDF(): void {
    if (!this.pagos.length || !this.usuarioSel) return;

    const img = new Image();
    img.src = 'assets/image/natacion-castano1.png';
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const doc = new jsPDF();
      const pageW = doc.internal.pageSize.getWidth();
      const x = 14, y = 12, logoW = 50, logoH = 20;

      doc.addImage(img, 'PNG', x, y, logoW, logoH);
      doc.setFontSize(16).text('Comprobante de pagos del usuario', x + logoW + 10, y + 5);
      doc.setFontSize(11).setTextColor(100)
         .text('Club Natación Castaño', x + logoW + 10, y + 12)
         .text(
           `Usuario: ${this.usuarioSel.nombreCompleto}`,
           x + logoW + 10, y + 19
         );

      /* Fechas */
      doc.setFontSize(10).setTextColor(0);
      doc.text(
        `Desde: ${this.fechaInicio?.toLocaleDateString()}  |  Hasta: ${this.fechaFin?.toLocaleDateString()}`,
        x, y + logoH + 5
      );


        autoTable(doc, {
          startY: y + logoH + 10,
          head: [['Fecha', 'Plan pagados', 'Pendiente', 'Abonado', 'Monto total']],
          body: this.pagos.map(p => [
            p.mes === 'TOTAL'
              ? 'TOTAL'
              : new Date(p.mes + 'T12:00:00').toLocaleDateString('es-EC', { month: 'long', year: 'numeric' }),
            p.cantidad_pagos,
            `$${p.total_pendiente.toFixed(2)}`,
            `$${p.total_abonado.toFixed(2)}`,
            `$${p.total_monto.toFixed(2)}`
          ]),
            theme: 'grid',
            styles: { fontSize: 9, halign: 'center' },
            didParseCell: ({ row, cell }) => {
              if (row.index === this.pagos.length - 1) {
                cell.styles.fontStyle = 'bold';
                cell.styles.fillColor = [240, 240, 240];
              }
            }
        });

      const footW = 20, footH = 8;
      doc.addImage(img, 'PNG', pageW - footW - 14,
                   doc.internal.pageSize.getHeight() - footH - 10, footW, footH);
      doc.setFontSize(8).setTextColor(100)
         .text(`Generado el ${new Date().toLocaleDateString()}`,
               14, doc.internal.pageSize.getHeight() - 10);

      doc.save(`comprobante_usuario_${this.usuarioSel.id}.pdf`);
    };
  }

}
