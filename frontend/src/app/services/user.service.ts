import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../interfaces/user";
import { observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Observable string sources
  private url_userSubject = new Subject<string>();
  private id_companySubject = new Subject<Number>();
  // Observable string streams
  url_userSubject$ = this.url_userSubject.asObservable();
  id_companySubject$ = this.id_companySubject.asObservable();

  public url_ : Object = {
    url_user : '',
    algo: ''
  }

  selectedUrl_user : any
  users : User[] = []
  companyUsers : User[] = []
  usersTopTen : User[] = []
  countReactionsUsers : number[] = []

  URL_API = environment.hostname + '/api/users'



  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(this.URL_API)
  }

  getUser(url_user : string) {
    this.url_ = {url_user : url_user}
    return this.http.post<User[]>(`${this.URL_API}/info`, this.url_)
  }

  getUserById(idUser : number) {
    console.log("id user "+idUser);
    return this.http.get<User[]>(`${this.URL_API}/user/${idUser}`)
  }

  getCompanyUsers(id_company : Number) {
    return this.http.get<User[]>(`${this.URL_API}/${id_company}`)
  }

  getIdCompany(id_company: Number) {
    this.id_companySubject.next(id_company);
  }

  getUrl_user(url_user : string) {
    this.url_userSubject.next(url_user);
  }

  clearUsers(){
    this.companyUsers = []
  }
}
