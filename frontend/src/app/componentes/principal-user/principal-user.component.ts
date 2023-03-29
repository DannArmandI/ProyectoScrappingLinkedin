import { Component, OnInit } from '@angular/core';
import { defer } from 'rxjs';

@Component({
  selector: 'app-principal-user',
  templateUrl: './principal-user.component.html',
  styleUrls: ['./principal-user.component.scss']
})
export class PrincipalUserComponent implements OnInit {

  num1:number;
  b: any;
  a: string;
  c: number;
  constructor() { }
  ngOnInit(): void {
    const PrinScript1 = require("../principal/PrinAux2.js");
    const PrinScript3 = require("../principal/PrinAux.js");
    const PrinScript = require("../principal/PrinScript.js");
    this.a=sessionStorage.getItem("nom");
    this.b=sessionStorage.getItem("rol");
    this.c=this.b;
  }
  Seccion(num:any){
    this.num1=num;
  }
}
