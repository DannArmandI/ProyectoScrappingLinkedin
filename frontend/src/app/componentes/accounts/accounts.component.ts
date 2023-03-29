import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Account } from '../../interfaces/account';
import { AccountService } from 'src/app/services/account.service';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  //showMe: boolean ;

  public selectedAccount: Account = {
    user_name: '',
    password: '',
    priority: 0,
    Estado: 1,
    cliente: sessionStorage.getItem('cliente'),
  };
  num = 1;
  title = ""
  datasource: MatTableDataSource<Account>
  displayedColumns: string[] = ["correo",	"password"	,"estado"	,"acciones"];
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  constructor(public accountService: AccountService, private _liveAnnouncer: LiveAnnouncer) {}

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts() {
    console.log(sessionStorage.getItem('cliente'));
    this.accountService
      .get2Accounts(sessionStorage.getItem('cliente'))
      .subscribe(
        (res) => {
          this.accountService.accounts = res;
          this.datasource = new MatTableDataSource(this.accountService.accounts);
          this.datasource.sort = this.sort;
          this.datasource.paginator = this.paginator;
        },
        (err) => {
          console.log(err);
        }
      );
  }
  agregarCuenta(form: NgForm) {
    var now = new Date();
    var jsonDate = now.toJSON();
    var then = new Date(jsonDate);

    if (form.value.user_name == null || form.value.password == null) {
      console.log(form.value);
      form.reset();
      alert('Error xD');
      return 0;
    }
    if (form.value.id_account) {
      this.accountService.selectedAccount = {
        id_account: form.value.id_account,
        Estado: 1,
        user_name: form.value.user_name,
        password: form.value.password,
        priority: this.accountService.accounts.length + 1,
        cliente: sessionStorage.getItem('cliente'),
      };
      this.accountService
        .updateAccount(this.accountService.selectedAccount)
        .subscribe(
          (res) => {
            form.reset();
            this.num = 0;
            console.log(res);
          },
          (err) => console.log(err)
        );
    } else {
      this.accountService
        .createAccount(this.accountService.selectedAccount)
        .subscribe(
          (res) => {
            alert("Cuenta creada con exito!")
            this.getAccounts();
            this.num = 0;
            form.reset();
          },
          (err) => console.log(err)
        );
    }
    return 0;
  }
  // addAccount(form: NgForm ){
  //   var now = new Date();
  //   var jsonDate = now.toJSON();
  //   var then = new Date(jsonDate);

  //   if(form.value.user_name == null || form.value.user_name == '' || form.value.password == '' || form.value.password == null){
  //     form.reset()
  //     alert("Error")
  //     return 0
  //   }

  //   if(form.value.id_account || this.num==3){
  //     console
  //     this.accountService.selectedAccount = {
  //       id_account: form.value.id_account,
  //       user_name: form.value.user_name,
  //       password: form.value.password,
  //       Estado:1,
  //       priority: (this.accountService.accounts.length+1),
  //       cliente:sessionStorage.getItem("cliente")
  //     }

  //     this.accountService.updateAccount(this.accountService.selectedAccount).subscribe(
  //       res=>{
  //         form.reset()
  //         console.log(res)
  //       },
  //       err =>console.log(err)
  //     )
  //   }else{
  //     this.accountService.createAccount(this.accountService.selectedAccount).subscribe(
  //       res=> {
  //         this.getAccounts()
  //         form.reset()
  //       },
  //       err => console.log(err)
  //     );
  //   }
  //   return 0
  // }

  deleteAccount(id_account: any) {
    // if(confirm('Are u sure you want delete it?')){
    this.accountService.deleteAccount(id_account).subscribe(
      (res) => {
        console.log(res);
        this.getAccounts();
      },
      (err) => console.log(err)
    );
    // }
  }

  activateAccount(id_account: any) {
    
    this.accountService.activateAccount(id_account).subscribe(
      (res) => {
        console.log(res);
        this.getAccounts();
      },
      (err) => console.log(err)
    );
  }

  editAccount(account: Account) {
    this.accountService.selectedAccount = account;
  }
  limpiarForm() {
    this.accountService.selectedAccount = {
      user_name: '',
      password: '',
      priority: 0,
      Estado: 1,
      cliente: sessionStorage.getItem('cliente'),
    };
  }
  resetForm(form: NgForm) {
    form.reset();
  }

  onlyNumbers(company_number: string) {
    for (let i = 0; i < company_number.length; i++) {
      if ('1234567890'.indexOf(company_number[i]) == -1) {
        return false;
      }
    }
    return true;
  }

  replaceSpaces(user_name: string) {
    var str = user_name.replace(/ /gi, '-');
    return str;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();

    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
  }
}
