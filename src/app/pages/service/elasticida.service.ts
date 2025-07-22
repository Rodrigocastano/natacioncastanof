import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Elasticida } from '../interfaces/elasticida';
import { environment } from '../../../environments/environments';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ElasticidaService {

  private apisUrl = environment.apisUrls; 
 
    constructor(private http: HttpClient) {}

/*         private headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      Accept: 'application/json'
    }); */


/*   getMisMedidasElasticidad(): Observable<any> {
    return this.http.get<any>(`${this.apisUrl}/misMedidasElasticidad`, { headers: this.headers });
  }

  getMisMedidasNutricionales(): Observable<any> {
    return this.http.get<any>(`${this.apisUrl}/misMedidasNutricionale`, { headers: this.headers });
  }

  getMisMedidasAntropometricas(): Observable<any> {
    return this.http.get<any>(`${this.apisUrl}/misMedidasAntropometrica`, { headers: this.headers });
  } */
    
/*   getElasticidaByUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.apisUrl}/verMedidasPorUsuario/${idUsuario}`);
  } */

/*   obtenerUsuarios(): Observable<Usuario[]> {
      return this.http.get<Usuario[]>(`${this.apisUrl}/usuarios`)} */

    getAllElasticida(): Observable<Elasticida[]> {
      return this.http.get<Elasticida[]>(`${this.apisUrl}/indexMedidaElasticida`);
    }

    getAllTodoElasticida() {
      return this.http.get<any>(`${this.apisUrl}/indexTodaMedidaElasticida`);
    }

    getElasticidaById(id: number): Observable<Elasticida> {
      return this.http.get<Elasticida>(`${this.apisUrl}/showMedidaElasticida/${id}`);
    }

    createElasticida(elasticida: Elasticida): Observable<any> {
      return this.http.post(`${this.apisUrl}/storeMedidaElasticida`, elasticida);
    }

    updateElasticida(id: number, elasticida: Elasticida){
      return this.http.put(`${this.apisUrl}/updateMedidaElasticida/${id}`, elasticida);
    }

    deleteElasticida(id: number){
      return this.http.delete(`${this.apisUrl}/destroyMedidaElasticida/${id}`);
    }



/*     obtenerUsuarios(): Observable<Usuario[]> {
      return this.http.get<Usuario[]>(`${this.apisUrl}/usuarios`);
    } */


 }