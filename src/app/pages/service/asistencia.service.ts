import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asistencia } from '../interfaces/asistencia'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

    private headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      Accept: 'application/json'
    });

    obtenerMisAsistencias(): Observable<Asistencia[]> {
      return this.http.get<Asistencia[]>(`${this.apisUrl}/verMisAsistencias`, { headers: this.headers });
    }

    guardarMisAsistencias(asistencias: Partial<Asistencia>[]): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeMisAsistencias`, { asistencias }, { headers: this.headers });
    }


    getAllTodoAsistencias() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaAsistencia`);
    }

    createAsistenciasBatch(asistencias: Partial<Asistencia>[]): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeBatchAsistencia`, { asistencias });
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

  getUsuariosByGrupo(idGrupo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apisUrl}/usuarioGrupo/${idGrupo}`);
  }

  getUsuariosByEntrenados(idGrupo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apisUrl}/getGruposByEntrenado/${idGrupo}`);
  }

/*   getUsuariosByGrupoYHorario(idGrupo: number, idHorario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apisUrl}/getUsuariosByGrupoYHorario/${idHorario}/${idGrupo}`);
  } */

  getUsuariosByGrupoYHorario(idGrupo: number, idHorario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apisUrl}/getUsuariosByGrupoYHorario/${idGrupo}/${idHorario}`);
}




}
