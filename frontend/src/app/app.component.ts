import { Component, ElementRef, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { defer } from 'rxjs';
import { arrayItems, BarraNav } from 'src/app/interfaces/BarraNav';
//import { defer } from 'rxjs/internal/observable/defer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-end';
  num1=0;
  nombre:any;
  rol:any;
  NombreRol:any;
  array_Items: Array<any> = [];
  idUsuario=sessionStorage.getItem("idUsuario");
  constructor(private router:Router){}
  public ngOnInit() {

  }
  // Retornar(){
  //   console.log(this.c);
  //   return this.c;
  // }
  ngAfterViewInit(): void {
    this.nombre=sessionStorage.getItem("nom");
    this.rol=sessionStorage.getItem("rol");
    if (this.rol==1){
      this.array_Items=arrayItems;
      this.NombreRol="Super Admin";
    }else if(this.rol==2){
      this.array_Items.push(arrayItems[1]);
      this.array_Items.push(arrayItems[2]);
      this.array_Items.push(arrayItems[4]);
      // this.array_Items.push(arrayItems[5]);
      // this.array_Items.push(arrayItems[6]);
      this.NombreRol="Admin";
    }else{
      this.array_Items.push(arrayItems[2]);
      this.array_Items.push(arrayItems[4]);
      this.NombreRol="Usuario";
    }
  }
  logout(){
    console.log("click")
    sessionStorage.clear();
    this.idUsuario=null;
   this.router.navigate((['']))
 }
}

