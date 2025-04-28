import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from '../interfaces/medico'; 
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apisUrl = environment.apisUrls; 

  constructor(private http: HttpClient, private router: Router) {}

     getAllTodoMedico() {
      return this.http.get<any>(`${this.apisUrl}/indexControlMedico`);
    }
 
    createMedico(medico: Medico): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeControlMedico`, medico);
    }
 
    updateMedico(id: number, medico: Medico){
      return this.http.put(`${this.apisUrl}/updateControlMedico/${id}`, medico);
    }
 
    deleteMedico(id: number){
      return this.http.delete(`${this.apisUrl}/destroyControlMedico/${id}`);
    }

}

