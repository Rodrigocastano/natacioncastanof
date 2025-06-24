import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}



    getAllCompleto() {
      return this.http.get<any>(`${this.apisUrl}/pagosCompleto`);
    }

    getAllPendiente() {
      return this.http.get<any>(`${this.apisUrl}/pagosPendiente`);
    }
}
