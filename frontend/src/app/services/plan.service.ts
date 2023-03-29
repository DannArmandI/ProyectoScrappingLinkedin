import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Plan } from '../interfaces/plan';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {
  URL_API = environment.hostname + '/api/planes'

  planes : Plan[] = []

  public selectedPlan : Plan = {
    nombre_plan: '',
    numero_usuarios: 0,
    numero_menciones: 0,
    precio_CLP: 0,
    precio_USD: 0,
    cantidad_reportes: 0,
    porcentaje_descuento: 0,
    duracion_almacenamiento: 0
  }

constructor(private metodos: HttpClient) { };

  mostrarPlanes(){
    return this.metodos.get<Plan[]>(`${this.URL_API}/mostrarTodos`);
  }

  mostrarPlan(id_plan:any):Observable<any>{
    return this.metodos.get(`${this.URL_API}/mostrarUno/${id_plan }`);
  }

  agregarPlan(plan: Plan):Observable<any>{
    return this.metodos.post(`${this.URL_API}/agregar`,plan);
  }

  editarPlan(objetoPlan:any, id_plan:any):Observable<any>{
    console.log("pln serv edit obj");
    return this.metodos.put(`${this.URL_API}/editar/${id_plan}`, objetoPlan)
  }

  desactivarPlan(id_plan: string):Observable<any>{
    return this.metodos.delete(`${this.URL_API}/desactivar/${id_plan }`)
  }

  activarPlan(id_plan: string):Observable<any>{
    return this.metodos.delete(`${this.URL_API}/activar/${id_plan }`)
  }
}