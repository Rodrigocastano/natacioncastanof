import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardService } from '../service/dashboard.service';
import { Dashboards } from '../interfaces/dashboards';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, ProgressSpinnerModule],
    templateUrl: '/dashboard.html'

})
export class Dashboard implements OnInit {

    loading: boolean = true;

    completo: any[] = [];
    pendiente: any[] = [];
    abonado: any[] = [];

    visibleCompleto = 5;
    visiblePendiente = 5;
    visibleAbonado = 5;
  
    verMas(tipo: string) {
      if (tipo === 'completo') this.visibleCompleto += 5;
      if (tipo === 'pendiente') this.visiblePendiente += 5;
      if (tipo === 'abonado') this.visibleAbonado += 5;
    }

    verMenos(tipo: string) {
        if (tipo === 'completo' && this.visibleCompleto > 5) this.visibleCompleto -= 5;
        if (tipo === 'pendiente' && this.visiblePendiente > 5) this.visiblePendiente -= 5;
        if (tipo === 'abonado' && this.visibleAbonado > 5) this.visibleAbonado -= 5;
    }

    agrupadosCompleto: any[] = [];
    agrupadosAbonado: any[] = [];
    agrupadosPendiente: any[] = [];

  

    constructor(
        private fb: FormBuilder,
        private dashboardService: DashboardService,
      ){}


      ngOnInit(): void {
        this.getAbonado();
        this.getCompleto();
        this.getPendiente();
        

      }

      getCompleto() {
        this.dashboardService.getAllCompleto().subscribe(data => {
          this.completo = data.data;
          this.agrupadosCompleto = this.agruparPagosPorUsuario(this.completo);
          this.loading = false;
        });
      }
      
      getAbonado() {
        this.dashboardService.getAllAbonado().subscribe(data => {
          this.abonado = data.data;
          this.agrupadosAbonado = this.agruparPagosPorUsuario(this.abonado);
          this.loading = false;
        });
      }
      
      getPendiente() {
        this.dashboardService.getAllPendiente().subscribe(data => {
          this.pendiente = data.data;
          this.agrupadosPendiente = this.agruparPagosPorUsuario(this.pendiente);
          this.loading = false;
        });
      }
      


      agruparPagosPorUsuario(pagos: any[]): any[] {
        const mapa = new Map<string, any[]>();
      
        pagos.forEach(pago => {
          const clave = `${pago.nombre}_${pago.apellido}`; // o usa pago.usuario_id si tienes
          if (!mapa.has(clave)) {
            mapa.set(clave, []);
          }
          mapa.get(clave)!.push(pago);
        });
      
        return Array.from(mapa.entries()).map(([clave, pagos]) => ({
          usuario: clave,
          pagos,
          mostrarTodos: false
        }));
      }
      
      


}

