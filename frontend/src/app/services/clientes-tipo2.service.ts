import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Date_ } from "../interfaces/date";
import { ClientesTipo2 } from '../interfaces/clientes-tipo2';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ClientesTipo2Service {

  URL_API = environment.hostname + '/clientesTipo2'

  clientesTipo2: ClientesTipo2[] = []

  public selectedClientesTipo2 : ClientesTipo2 = {
    rut_cliente: '',
    dni: '',
    razon_social: '',
    fecha_inicio_contrato: null,
    fecha_fin_contrato: null,
    correo_electronico: '',
    id_plan: 0
  }

  constructor(private http:HttpClient) { }

  mostrarClientesTipo2() {
    return this.http.get<ClientesTipo2[]>(`${this.URL_API}`)
  }

  mostrarClienteTipo2(id_cliente:any) {
    return this.http.get(`${this.URL_API}/mostrar/${id_cliente}`)
  }

  agregarClienteTipo2(clienteTipo2: ClientesTipo2){
    return this.http.post(this.URL_API,clienteTipo2);
  }

  editarClienteTipo2(clienteTipo2: ClientesTipo2, id_cliente:any){
    return this.http.put(`${this.URL_API}/${id_cliente}`, clienteTipo2)
  }

  desactivarClienteTipo2(id_cliente: string){
    return this.http.delete(`${this.URL_API}/desactivar/${id_cliente}`)
  }

  activarClienteTipo2(id_cliente: string){
    return this.http.delete(`${this.URL_API}/activar/${id_cliente}`)
  }
}