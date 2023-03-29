import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { descarga } from '../interfaces/descarga';
import { Post } from '../interfaces/post';
import { Comment } from '../interfaces/comment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})


export class JobsService {
  URL_API = environment.hostname + '/jobs'

  constructor(private metodos: HttpClient) { };
  

  obtenerDatosDescargas(idCompany:any) {
    return this.metodos.get<descarga[]>(`${this.URL_API}/obtenerDatosDescargas/${idCompany}`)
  }

  obtenerIdPost(idDescarga:any, fechaDesde:any, fechaHasta:any) {
    return this.metodos.post<any[]>(`${this.URL_API}/obtenerIdPost`, {idDescarga, fechaDesde, fechaHasta})
  }

  obtenerIdUser(idPost:any){
    return this.metodos.get<any[]>(`${this.URL_API}/obtenerIdUser/${idPost}`);
  }

  obtenerJobs(idUser:any){
    return this.metodos.get(`${this.URL_API}/obtenerJobs/${idUser}`, {responseType: 'text'});
  }
}