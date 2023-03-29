import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Company } from "../interfaces/company";
import { Date_ } from "../interfaces/date";
import {descarga} from "../interfaces/descarga"

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  
  URL_API = environment.hostname + '/api/downloads'
  constructor(private http: HttpClient) { }
  getDownloads(id:any) {
    return this.http.get<descarga[]>(`${this.URL_API}/${id}`)
  }
  getDownloadsDone(id:any) {
    return this.http.get<descarga[]>(`${this.URL_API}_done/${id}`)
  }


  AddDownloads(download:any) {
    return this.http.post(`${this.URL_API}/Add`,download)
  }
  UpdateDownloads(download:any) {
    return this.http.post(`${this.URL_API}/${download.id_descarga}`,download)
  }
  deleteDownloads(id:any) {
    return this.http.delete(`${this.URL_API}/${id}`)
  }
  ActivateDownloads(id:any){
    return this.http.put(`${this.URL_API}/${id}`,{})
  }
  // getDownloads() {
  //   return this.http.get<descarga[]>(`${this.URL_API}`)
  // }
}
