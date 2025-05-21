import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaDistancia } from '../interfaces/categoriadistancia'; 
import { TipoNado } from '../interfaces/tiponado'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CategoriadistanciaService {

 private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}
 
    getAllCategoriasDistancia(): Observable<CategoriaDistancia[]> {
      return this.http.get<CategoriaDistancia[]>(`${this.apisUrl}/indexCategoriasDistancia`);
    }

    getAllCategoriasDistanciaTipos(): Observable<CategoriaDistancia[]> {
      return this.http.get<CategoriaDistancia[]>(`${this.apisUrl}/indexCategoriasDistanciaTipo`);
    }
  
    createCategoriasDistancia(categoriaDistancia: CategoriaDistancia): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeCategoriasDistancia`, categoriaDistancia);
    }
  
    updateCategoriasDistancia(id: number, categoriaDistancia: CategoriaDistancia): Observable<any> {
      return this.http.put(`${this.apisUrl}/updateCategoriasDistancia/${id}`, categoriaDistancia);
    }
  
    deleteCategoriasDistancia(id: number): Observable<any> {
      return this.http.delete(`${this.apisUrl}/destroyCategoriasDistancia/${id}`);
    }

    getAllTipoNado(): Observable<TipoNado[]> {
    return this.http.get<TipoNado[]>(`${this.apisUrl}/indexTipoNado`);
    }
  
 }
 