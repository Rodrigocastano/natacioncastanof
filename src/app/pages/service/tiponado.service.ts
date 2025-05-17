import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoNado } from '../interfaces/tiponado'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TiponadoService {

  private apisUrl = environment.apisUrls; 
  
     constructor(private http: HttpClient) {}
  
    getAllTipoNado(): Observable<TipoNado[]> {
      return this.http.get<TipoNado[]>(`${this.apisUrl}/indexTipoNado`);
    }
  
    createTipoNado(tipoNado: TipoNado): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeTipoNado`, tipoNado);
    }
  
    updateTipoNado(id: number, tipoNado: TipoNado): Observable<any> {
      return this.http.put(`${this.apisUrl}/updateTipoNado/${id}`, tipoNado);
    }
  
    deleteTipoNado(id: number): Observable<any> {
      return this.http.delete(`${this.apisUrl}/destroyTipoNado/${id}`);
    }
}
