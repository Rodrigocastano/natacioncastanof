import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Psicologo } from '../interfaces/psicologo'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PsicologoService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

     getAllTodoPsicologos() {
      return this.http.get<any>(`${this.apisUrl}/indexControlPsicologo`);
    }

   createPsicologos(psicologo: Psicologo): Observable<any> {
     return this.http.post(`${this.apisUrl}/storeControlPsicologo`, psicologo);
   }
 
   updatePsicologos(id: number, psicologo: Psicologo){
     return this.http.put(`${this.apisUrl}/updateControlPsicologo/${id}`, psicologo);
   }

   deletePsicologos(id: number){
     return this.http.delete(`${this.apisUrl}/destroyControlPsicologo/${id}`);
   }
}
