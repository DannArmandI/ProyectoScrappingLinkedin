import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import {Router} from '@angular/router'
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';







@Component({
  selector: 'app-editar-pass',
  templateUrl: './editar-pass.component.html',
  styleUrls: ['./editar-pass.component.css']
})
export class EditarPassComponent implements OnInit {
 
 
  constructor( private usuariosServices : UsuariosService, private router: Router) { }


  ngAfterViewInit() {
  
  }
  ngOnInit(): void {
    
  }
  
  user:usuario
  passwordActual = ''
  newPassword = '' 
  newPasswordConfirm = ''

  

  menuPrincipal(){
    this.router.navigateByUrl('/Panel')
  }



  updatePassword() {
    if (
      this.passwordActual != '' &&
      this.newPassword != '' &&
      this.newPasswordConfirm != ''
    ) {
      if(this.newPassword.length<7){
        alert("caracteres minimos: 7")
      }else{
        if (this.newPassword == this.newPasswordConfirm) {
          this.usuariosServices
            .updatePassword(
              sessionStorage.getItem('idUsuario'),
              this.passwordActual,
              this.newPassword
            )
            .subscribe(
              (res) => {
                alert('Contraseña actualizada con éxito');
                this.router.navigateByUrl('/Panel')
              },
              (err) => {
                if ((err.status = 404)) {
                  alert('Contraseña actual ingresada es incorrecta');
                }
              }
            );
        } else {
          alert('contraseñas no coinciden');
        }
      }
    } else {
      alert('campos necesarios');
    }
  }
}
