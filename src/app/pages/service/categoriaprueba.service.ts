import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaPrueba } from '../interfaces/categoriaprueba'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CategoriapruebaService {
private apisUrl = environment.apisUrls; 

   constructor(private http: HttpClient) {}

  getAllCategoriaPrueba(): Observable<CategoriaPrueba[]> {
    return this.http.get<CategoriaPrueba[]>(`${this.apisUrl}/indexCategoriaPrueba`);
  }

  createCategoriaPrueba(categoriaPrueba: CategoriaPrueba): Observable<any> {
    return this.http.post(`${this.apisUrl}/storeCategoriaPrueba`, categoriaPrueba);
  }

  updateCategoriaPrueba(id: number, categoriaPrueba: CategoriaPrueba): Observable<any> {
    return this.http.put(`${this.apisUrl}/updateCategoriaPrueba/${id}`, categoriaPrueba);
  }

  deleteCategoriaPrueba(id: number): Observable<any> {
    return this.http.delete(`${this.apisUrl}/destroyCategoriaPrueba/${id}`);
  }
}
