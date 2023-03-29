import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { descarga } from '../interfaces/descarga';

@Injectable({
  providedIn: 'root'
})
export class DemographicService {
  
  
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
  constructor(private http:HttpClient) { }
  
  // Reactions
  getInstitutionReactionsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/reactions/institutions`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getProfessionReactionsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/reactions/degrees`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getCountryReactionsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/reactions/countries`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getLocationReactionsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/reactions/locations`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getCompanyReactionsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/reactions/companys`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getJobReactionsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/reactions/jobs`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  // comments
  getInstitutionCommentsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/comments/institutions`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getProfessionCommentsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/comments/degrees`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getCountryCommentsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/comments/countries`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getLocationCommentsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/comments/locations`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getCompanyCommentsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/comments/companys`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
  getJobCommentsUsers(id_descarga:string,fecha_desde:Date, fecha_hasta:Date):Observable<any>{
    return this.http.post(`${environment.hostname}/graphics/demography/comments/jobs`,{id_descarga, fecha_desde, fecha_hasta},this.HttpUploadOptions);
  }
}
