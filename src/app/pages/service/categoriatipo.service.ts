import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaTipo } from '../interfaces/categoriatipo'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CategoriatipoService {

  private apisUrl = environment.apisUrls; 
  
     constructor(private http: HttpClient) {}
  
    getAllCategoriaTipo(): Observable<CategoriaTipo[]> {
      return this.http.get<CategoriaTipo[]>(`${this.apisUrl}/indexCategoriaTipo`);
    }
  
    createCategoriaTipo(categoriaTipo: CategoriaTipo): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeCategoriaTipo`, categoriaTipo);
    }
  
    updateCategoriaTipo(id: number, categoriaTipo: CategoriaTipo): Observable<any> {
      return this.http.put(`${this.apisUrl}/updateCategoriaTipo/${id}`, categoriaTipo);
    }
  
    deleteCategoriaTipo(id: number): Observable<any> {
      return this.http.delete(`${this.apisUrl}/destroyCategoriaTipo/${id}`);
    }
}
