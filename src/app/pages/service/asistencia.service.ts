import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asistencia } from '../interfaces/asistencia'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

     getAllTodoAsistencias() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaAsistencia`);
    }
 
    createAsistencia(sistencia: Asistencia): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeAsistencia`, sistencia);
    }
 
    updateAsistencia(id: number, sistencia: Asistencia){
      return this.http.put(`${this.apisUrl}/updateAsistencia/${id}`, sistencia);
    }
 
    deleteAsistencia(id: number){
      return this.http.delete(`${this.apisUrl}/destroyAsistencia/${id}`);
    }
}
