import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PagoEntrenadoresService, IngresoMensual } from '../service/pago-entrenadores.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporteentrenadores',
   imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    TableModule,
    TagModule
  ],
  templateUrl: './reporteentrenadores.component.html',
})
export class ReporteentrenadoresComponent {

      fechaInicio: Date | null = null;
      fechaFin:   Date | null = null;
      ingresos:   IngresoMensual[] = [];
      mostrarMensajeVacio: boolean = false;

       constructor(private reportesService: PagoEntrenadoresService) {}

    private firstDay(date: Date): string {
      const d = new Date(date.getFullYear(), date.getMonth(), 1);
      return d.toISOString().split('T')[0];
    }

    private lastDay(date: Date): string {
      const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      return d.toISOString().split('T')[0];
    }

    buscarPagos(): void {
        if (!this.fechaInicio || !this.fechaFin) {
          this.ingresos = [];
          this.mostrarMensajeVacio = false;
          return;
        }

        this.ingresos = [];
        this.mostrarMensajeVacio = false;

        const inicio = this.firstDay(this.fechaInicio);
        const fin = this.lastDay(this.fechaFin);

        this.reportesService.getIngresosMensualesEntrenadores(inicio, fin).subscribe({
          next: data => {
            this.ingresos = data;
            this.mostrarMensajeVacio = data.length === 0;
          },
          error: err => {
            console.error('Error al obtener ingresos', err);
            this.mostrarMensajeVacio = true;
            this.ingresos = [];
          }
        });
    }

    formatMonth(mes: string): string {
      if (mes === 'TOTAL') return 'TOTAL';
      const date = new Date(mes + 'T00:00:00');
      return date.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' });
    }

    descargarPDF(): void {
      if (!this.ingresos.length) return;

      const img = new Image();
      img.src = 'assets/image/natacion-castano1.png';
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        const logoWidth = 50; 
        const logoHeight = 20; 
        const logoX = 14;
        const logoY = 12;
        
        doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);

        doc.setFontSize(16);
        doc.text('Reporte mensual de ingresos', logoX + logoWidth + 10, logoY + 5);
        doc.setFontSize(11).setTextColor(100);
        doc.text('Club Natación Castaño', logoX + logoWidth + 10, logoY + 12);

        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text(
          `Desde: ${this.fechaInicio?.toLocaleDateString()} | Hasta: ${this.fechaFin?.toLocaleDateString()}`,
          logoX, logoY + logoHeight + 5
        );

        autoTable(doc, {
  startY: logoY + logoHeight + 10,
  head: [['Fecha', 'Plan pagados',  'Pendiente', 'Abonado', 'Monto total']],
  body: this.ingresos.map(r => [
    r.mes === 'TOTAL'
      ? 'TOTAL'
      : new Date(r.mes + 'T12:00:00').toLocaleDateString('es-EC', {
          month: 'long', year: 'numeric'
        }),
        r.cantidad_pagos,
    `$${r.total_pendiente.toFixed(2)}`,
    `$${r.total_abonado.toFixed(2)}`,
    `$${r.total_pagado.toFixed(2)}`,
  ]),
  theme: 'grid',
  styles: { fontSize: 10, halign: 'center' },
  columnStyles: {
    1: { halign: 'center' },
    2: { halign: 'center' },
    3: { halign: 'center' },
    4: { halign: 'center' }
  },
  didParseCell: data => {
    if (data.row.index === this.ingresos.length - 1) {
      data.cell.styles.fontStyle = 'bold';
      data.cell.styles.fillColor = [240, 240, 240];
    }
  }
});



        // 5. Pie de página con logo más pequeño
        const footerLogoWidth = 20;
        const footerLogoHeight = 8;
        doc.addImage(
          img, 
          'PNG', 
          pageWidth - footerLogoWidth - 14, // Posición X (derecha)
          doc.internal.pageSize.getHeight() - footerLogoHeight - 10, // Posición Y (abajo)
          footerLogoWidth, 
          footerLogoHeight
        );
        
        // Texto del pie de página
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Generado el ${new Date().toLocaleDateString()}`, 
          14, 
          doc.internal.pageSize.getHeight() - 10
        );

        doc.save('ingresos_mensuales.pdf');
      };
    }

}

