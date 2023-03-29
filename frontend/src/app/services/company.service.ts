import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Company } from "../interfaces/company";
import { Date_ } from "../interfaces/date";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  URL_API = environment.hostname + '/api/companies'

  companies : Company[] = []
  selectedCompanies : Company[] = []


  constructor(private http: HttpClient) { }

  getCompanies() {
    return this.http.get<Company[]>(this.URL_API);
  }
  get2Companies(cliente:any) {
    return this.http.get<Company[]>(`${this.URL_API}/${cliente}`);
  }
  get2CompaniesDownload(cliente:any) {
    return this.http.get<Company[]>(`${this.URL_API}_download/${cliente}`);
  }
  get2CompaniesDownloadSA() {
    return this.http.get<Company[]>(`${this.URL_API}_download_sa`);
  }
  AgregarCompany(A:any){
    return this.http.post(`${this.URL_API}/Agregar`,A);
  }
  EditarCompany(A:any,id:any){
    return this.http.put(`${this.URL_API}/Actualizar/${id}`,A);
  }
  ActivarCompany(id:any){
    return this.http.put(`${this.URL_API}/Activar/${id}`,{});
  }
  EliminarCompany(id:any){
    return this.http.delete(`${this.URL_API}/Eliminar/${id}`);
  }
  clearPosts(){
    this.selectedCompanies = []
  }

}
