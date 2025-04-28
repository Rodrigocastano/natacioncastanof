import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TiempoNadador } from '../interfaces/tiemponadador';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TiemponadadorService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

     getAllTodoTiemposNado() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaTiemposNado`);
    }
 
    createTiemposNado(tiempoNadador: TiempoNadador): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeTiemposNado`, tiempoNadador);
    }
 
    updateTiemposNado(id: number, tiempoNadador: TiempoNadador){
      return this.http.put(`${this.apisUrl}/updateTiemposNado/${id}`, tiempoNadador);
    }
 
    deleteTiemposNado(id: number){
      return this.http.delete(`${this.apisUrl}/destroyTiemposNado/${id}`);
    }

}