import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuarios:usuario[] = []
  constructor(private http:HttpClient) {

  }
  HttpUploadOptions = {
    headers: new HttpHeaders(
      {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Content-Type': 'application/json',
    }
    ),
  };
  Editar(usuario:usuario,id:any):Observable<any>{
    return this.http.put(`${environment.hostname}/update/${id}`,usuario);
  }
  Usuarios(id:any):Observable<any>{
    return this.http.get(`${environment.hostname}/admin/user/${id}`);
  }
  getUsuarios():Observable<any>{
    return this.http.get<usuario[]>(`${environment.hostname}/Usuarios`);
  }
  postUsuario(nombre:any , apellido:any , rut:any , password:any , mail:any , telefono:any , pais:any , ciudad:any ):Observable<any>{
    return this.http.post(`${environment.hostname}/AgregarUsuario`,JSON.stringify({"nombre":nombre,"apellido":apellido ,"rut":rut , "password":password , "mail":mail, "telefono":telefono , "pais":pais , "ciudad":ciudad}),this.HttpUploadOptions);
  }
  deleteUsuario(rut:any):Observable<any>{
    return this.http.delete(`${environment.hostname}/EliminarUsuario/${rut}`,this.HttpUploadOptions);
  }
  putUsuario(rut:any,nombre:any):Observable<any>{
    return this.http.put(`${environment.hostname}/ModificarUsuario/${rut}`,JSON.stringify({"nombre":nombre,"rut":rut}),this.HttpUploadOptions);
  }
  IniciarUsuario(mail:any,password:any):Observable<any>{
    return this.http.post(`${environment.hostname}/`,JSON.stringify({"email":mail,"password":password}),this.HttpUploadOptions);
  }
  desactivarUsuario(idUsuario:any):Observable<any>{
    return this.http.put(`${environment.hostname}/user/deactivate/${idUsuario}`,this.HttpUploadOptions);
  }
  activarUsuario(idUsuario:any):Observable<any>{
    return this.http.put(`${environment.hostname}/user/activate/${idUsuario}`,this.HttpUploadOptions);
  }

  registrarUsuario(usuario:usuario):Observable<any>{
    return this.http.post(`${environment.hostname}/register`, usuario, this.HttpUploadOptions)
  }
  updatePassword(idUsuario:any, password:any, newPassword:any):Observable<any>{
    return this.http.put(`${environment.hostname}/update/password/${idUsuario}`,{password, newPassword});
  }
  

}
