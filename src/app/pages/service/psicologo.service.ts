import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Psicologo } from '../interfaces/psicologo'; 
import { registroPsicologo } from '../interfaces/psicologo'; 
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PsicologoService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient) {}

    //Registro Psicologo
    getRegistroPsicologo(): Observable<registroPsicologo[]> {
      return this.http.get<registroPsicologo[]>(`${this.apisUrl}/indexPsicologo`);
    }
    
    createRegistroPsicologo(registroPsicologos: registroPsicologo): Observable<any> {
      return this.http.post(`${this.apisUrl}/storePsicologo`, registroPsicologos);
    }

    updateRegistroPsicologo(id: number, registroPsicologos: registroPsicologo): Observable<any> {
      return this.http.put(`${this.apisUrl}/updatePsicologo/${id}`, registroPsicologos);
    }

    deleteRegistroPsicologo(id: number): Observable<any> {
      return this.http.delete(`${this.apisUrl}/destroyPsicologo/${id}`);
    }

    //Control Psicologo
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
