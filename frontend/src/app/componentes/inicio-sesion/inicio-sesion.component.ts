import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import {UsuariosService} from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
//import { usuarioXd } from 'src/app/interfaces/usuario';
//import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
//export {usuarioXd}

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {

  mail:any;
  //myStorage=wind;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  password:any;
  num:any=2;
  Pais:any=1;
  Empresa:any;
  IniciarSesion = new FormGroup({});
  Registrarse = new FormGroup({});
  currentURL: string;
  constructor(private FormBuilder: FormBuilder ,private http:UsuariosService , public router: Router) {
  }

  ngOnInit(): void {

    if(sessionStorage.getItem("idUsuario")){
      sessionStorage.clear();
      window.location.reload();
    }
    this.IniciarSesion=this.FormBuilder.group({
      mail: new FormControl('',[Validators.required , Validators.pattern(this.emailPattern)]),
      password: new FormControl('',[Validators.required ,Validators.minLength(7)]),
    })
    this.Registrarse=this.FormBuilder.group({
      Empresa: new FormControl('',Validators.required),
      mail: new FormControl('',[Validators.required , Validators.pattern(this.emailPattern)]),
      Pais: new FormControl('',Validators.required),
    })
  }
  Iniciar(){
    this.http.IniciarUsuario(this.mail,this.password).subscribe(datos=>{
      console.log(datos);
      //usuarioXd.push(datos);
      if(datos?.id_rol){
        sessionStorage.setItem("nom",datos?.nombre_usuario);
        sessionStorage.setItem("rol",datos?.id_rol);
        sessionStorage.setItem("cliente",datos?.id_cliente);
        sessionStorage.setItem("idUsuario",datos?.id_usuario);
       //alert(sessionStorage.getItem("idUsuario"))
        //console.log(sessionStorage.getItem("correo"));
        //this.router.navigate(['Adm']);
        this.currentURL = window.location.href;
        window.location.href=this.currentURL+"/Panel";
      }else{
        console.log('Usuario no encontrado');
        alert('Correo o contraseña incorrecta');
      }
 },(error =>{
    if(error.status == 403){
      alert("Usuario deshabilitado")
    }else if(error.status == 404){
      alert("email o password incorrectos")
    }
 }));}

  registrarse(){
    this.cambiar()
  }
  cambiar(){
    this.num=this.num+1
  }
  Num(){
    return this.num % 2
  }
}

