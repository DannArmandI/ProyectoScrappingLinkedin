import { number } from '@amcharts/amcharts4/core';
import { Component, ElementRef, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { defer } from 'rxjs';
import { arrayItems, BarraNav } from 'src/app/interfaces/BarraNav';
//import { resolve } from 'url';
//import { Script } from 'vm';
//var requireFromUrl = require('require-from-url/sync');

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  //myStorage = window.sessionStorage;
  num1=0;
  nombre:any;
  rol:any;
  NombreRol:any;
  array_Items: Array<any> = [];
  constructor(private router:Router){}
  public ngOnInit() {
    // this.nombre=sessionStorage.getItem("nom");
    // this.rol=sessionStorage.getItem("rol");
    // if (this.rol==1){
    //   this.array_Items=arrayItems;
    //   this.NombreRol="Super Admin";
    // }else if(this.rol==2){
    //   this.array_Items.push(arrayItems[3]);
    //   this.array_Items.push(arrayItems[4]);
    //   this.array_Items.push(arrayItems[5]);
    //   this.array_Items.push(arrayItems[6]);
    //   this.NombreRol="Admin";
    // }else{
    //   this.array_Items.push(arrayItems[3]);
    //   this.array_Items.push(arrayItems[4]);
    //   this.array_Items.push(arrayItems[5]);
    //   this.array_Items.push(arrayItems[6]);
    //   this.NombreRol="Usuario";
    // }
    //console.log(this.array_Items);
    //console.log(this.c);
  }
  // Retornar(){
  //   console.log(this.c);
  //   return this.c;
  // }
  Seccion(num:any,id:any,lengh:any){
    console.log(num,id,lengh);
    this.num1=num+(id*1/lengh);
  }
  // ngAfterViewInit(): void {
  //   const PrinScript = defer(require("./PrinScript.js"));
  //   const PrinScript3 = defer(require("./PrinAux2.js"));
  //   const PrinScript2 = defer(require("./PrinAux.js"));
  // }
  logout(){
    console.log("click")
    sessionStorage.clear();
   this.router.navigate((['']))
 }
}
