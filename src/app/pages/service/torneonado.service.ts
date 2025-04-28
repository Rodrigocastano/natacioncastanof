import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TorneoNado } from '../interfaces/torneonado';
import { AreaNado } from '../interfaces/areanado';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TorneonadoService {

 private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

     getAllTodoTorneoNado() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaTorneoNadador`);
    }
 
    createTorneoNado(torneoNado: TorneoNado): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeTorneoNadador`, torneoNado);
    }
 
    updateTorneoNado(id: number, torneoNado: TorneoNado){
      return this.http.put(`${this.apisUrl}/updateTorneoNadador/${id}`, torneoNado);
    }
 
    deleteTorneoNado(id: number){
      return this.http.delete(`${this.apisUrl}/destroyTorneoNadador/${id}`);
    }

    getAllAreaNado(): Observable<AreaNado[]> {
      return this.http.get<AreaNado[]>(`${this.apisUrl}/indexAreaNado`);
    }
      
}