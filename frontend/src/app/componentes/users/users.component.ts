import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, JsonPipe } from '@angular/common';

//services services
import { UserService } from "../../services/user.service";
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ActivatedRoute } from '@angular/router';
// amCharts imports
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

//csv exports
import * as FileSaver from 'file-saver';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  datasource: MatTableDataSource<User>
  displayedColumns: string[] = ["id_user"	,"name"	,"country", "location",	"job", "number_followers", "url_user"];
  id = 0;
  constructor(public userService: UserService, private _liveAnnouncer: LiveAnnouncer,  private ruta:ActivatedRoute) { }

  ngOnInit(): void {
    this.getCompanyUsers()

    this.ruta.params.subscribe(datos=>{
      this.id=datos["id"];
      console.log(this.id);

      this.userService.getUserById(this.id).subscribe(
        res =>{
          console.log(res);
          this.datasource = new MatTableDataSource(res);
        }
      )
    })
  }

  getUser(){
    this.userService.url_userSubject$.subscribe(
      res => {
        this.userService.getUser(res).subscribe(
          response => {
            this.userService.users = response
          },
          error=> console.log(error)
        )
      },
      err => console.log(err)
    )
  }

  getCompanyUsers(){
    this.userService.id_companySubject$.subscribe(
      res=>{
        this.userService.getCompanyUsers(res).subscribe(
          response => {

            this.userService.companyUsers = response

          },
          error=> console.log(error)
        )
      },
      err => console.log(err)
    )
  }


  getUsers(){
    this.userService.getUsers().subscribe(
      res=> this.userService.users = res,
      err => console.log(err)
    )
  }

  //csv exports
  downloadUsers(){
    this.downloadFile(this.userService.companyUsers, 'users')
  }

  downloadFile(data: any, filename:string) {
    const replacer = (key: any, value: null) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    let csv = data.map((row: { [x: string]: any; }) => header.map(fieldName => JSON.stringify(row[fieldName],replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    FileSaver.saveAs(blob, filename + ".csv");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();

    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
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
}
