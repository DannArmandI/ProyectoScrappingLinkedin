import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Date_ } from "../interfaces/date";
import { Account } from "../interfaces/account";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  URL_API = environment.hostname + '/api/accounts'

  accounts : Account[] = []

  public selectedDate : Date_ = {
    from : new Date,
    to : new Date
  }

  public selectedAccount : Account = {
    user_name: '',
    password: '',
    priority: 0 ,
    Estado:1,
    cliente:sessionStorage.getItem("cliente"),
  }

  constructor(private http: HttpClient) { }

  getAccounts() {
    return this.http.get<Account[]>(`${this.URL_API}`);
  }
  get2Accounts(id:any) {
    return this.http.get<Account[]>(`${this.URL_API}/${id}`);
  }

    // se obtienen cuentas en el siguiente formato:
    // [
    //   {
    //     "id_account": 3,
    //     "user_name": "ejemplo1@gmail.com",
    //     "password": "ejemplopass1",
    //     "priority": 0
    //   }, ... ,
    //   {
    //     "id_account": 2,
    //     "user_name": "ejemplo2@gmail.com",
    //     "password": "ejemplopass2",
    //     "priority": 4
    //   }
    // ]

  createAccount(account: Account){
    return this.http.post(this.URL_API,account);
  }

  deleteAccount(id_account: string){
    return this.http.delete(`${this.URL_API}/${id_account}`)
  }


  updateAccount(account: Account){
    return this.http.put(`${this.URL_API}/${account.id_account}`, account)
  }

  activateAccount(id_account: string){
    return this.http.put(`${this.URL_API}/activate/${id_account}`,{})
  }
}
