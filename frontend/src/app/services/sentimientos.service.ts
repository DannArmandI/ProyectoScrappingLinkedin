import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { descarga } from '../interfaces/descarga';
import { Post } from '../interfaces/post';
import { Comment } from 'src/app/interfaces/comment';
import { AnyRecord } from 'dns';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SentimientosService {

  URL_API = environment.hostname + '/sentimientos'

  constructor(private http:HttpClient) { }

  obtenerDatosDescargas(idCompany:any) { 
    return this.http.get<descarga[]>(`${this.URL_API}/obtenerDatosDescargas/${idCompany}`)
  }

  obtenerIdPost(idDescarga:any, fechaDesde:any, fechaHasta:any):Observable<any> {
    return this.http.post<Post[]>(`${this.URL_API}/obtenerIdPost`, {idDescarga, fechaDesde, fechaHasta})
  }

  obtenerSentimientos(idPost:any) {
    return this.http.get<Comment[]>(`${this.URL_API}/obtenerSentimientos/${idPost}`)
  }
}