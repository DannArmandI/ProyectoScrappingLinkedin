import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ClientesTipo2Service } from 'src/app/services/clientes-tipo2.service';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { NumberFormatter } from '@amcharts/amcharts5';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  rol: any;
  id: any = 2;
  num: any = 0;
  idUsuario: string;
  Aux: any;
  Nombre: any;
  Editar = new FormGroup({});
  Mail: any;
  Estado: any;
  Label1 = 'Agregar Usuario';
  selectValue: string = 'default';
  userRegister: usuario = {
    id_usuario: 0,
    nombre_usuario: '',
    rut_usuario: '',
    correo_electronico: '',
    dni: '',
    id_cliente: '',
    estado: '',
    password_MD5: '',
    id_rol: 0,
  };
  clientes: [] = [];
  passwordActual: string = '';
  newPassword: string = '';
  newPasswordConfirm: string = '';
  private emailPattern: any =/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  AgregarUsuario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    rut: new FormControl('', Validators.required),
    mail: new FormControl('', [Validators.required,Validators.pattern(this.emailPattern)]),
    idCliente: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
  });
  datasource: MatTableDataSource<usuario>
  displayedColumns: string[] = ["id_usuario",	"nombre_usuario"	,"correo_electronico"	,"rut_usuario", "razon_social",	"estado", "acciones"];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  constructor(
    public usuariosServices: UsuariosService,
    private FormBuilder: FormBuilder,
    private clientesTipo2Services: ClientesTipo2Service,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');
    this.id = sessionStorage.getItem('cliente');
    this.idUsuario = sessionStorage.getItem('idUsuario');
    this.getUsuarios();
    this.getClientes();
    // editar usuario tipo 3
    if (this.rol == 3) {
      this.num = -1;
    }
  }

  getUsuarios() {
    if (this.rol == 1) {
      this.usuariosServices.getUsuarios().subscribe((res) => {
        console.log(res);
        this.usuariosServices.usuarios = res;
        this.datasource = new MatTableDataSource(this.usuariosServices.usuarios);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      });
    } else if (this.rol == 2) {
      this.usuariosServices.Usuarios(this.id).subscribe((res) => {
        this.usuariosServices.usuarios = res;
        this.datasource = new MatTableDataSource(this.usuariosServices.usuarios);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      });
    }
  }

  getClientes() {
    this.clientesTipo2Services.mostrarClientesTipo2().subscribe(
      (res) => {
        this.clientes = <any>res;
      },
      (err) => {
        console.log('error al obtener clientes');
      }
    );
  }

  alternar(idUsuario: string, estado: string) {
    // alert(idUsuario)
    // alert("presionado")

    // console.log(sessionStorage.getItem("idUsuario"));
    // console.log(idUsuario);

    if (estado == '1') {
      this.usuariosServices.desactivarUsuario(idUsuario).subscribe(
        (res) => {
          this.getUsuarios();
        },
        (err) => {
          console.log('error');
        }
      );
    } else {
      this.usuariosServices.activarUsuario(idUsuario).subscribe(
        (res) => {
          this.getUsuarios();
        },
        (err) => {
          console.log('error');
        }
      );
    }
  }

  mensaje() {
    alert('No puedes deshabilitar este usuario');
  }
  editar(usuario: usuario) {
    this.Label1 = 'Editar Usuario';
    this.num = 2;
    console.log(usuario);
    this.userRegister = usuario;
    //console.log(this.userRegister.id_usuario);
  }
  // Editar2(){
  //   this.Aux.nombre_usuario=this.Nombre;
  //   this.Aux.correo_electronico=this.Mail;
  //   this.Aux.estado=this.Estado;
  //   this.usuariosServices.Editar(this.Aux,this.Aux.id_usuario).subscribe(datos => {
  //     console.log("ahhhhhhhhhhhhhhhhhhhhh");
  //   });
  //   this.num=0;
  // }

  register() {
    this.userRegister.dni = '';
    this.userRegister.id_cliente = sessionStorage.getItem('cliente');
    this.userRegister.id_rol = +sessionStorage.getItem('rol')+1;
    if (this.userRegister.id_usuario) {
      this.usuariosServices
        .Editar(this.userRegister, this.userRegister.id_usuario)
        .subscribe((datos) => {
          console.log('ahhhhhhhhhhhhhhhhhhhhh');
          alert('Cambios realizados con exito!');
          this.num = 0;
          this.userRegister = {
            id_usuario: 0,
            nombre_usuario: '',
            rut_usuario: '',
            correo_electronico: '',
            dni: '',
            id_cliente: '',
            estado: '',
            password_MD5: '',
            id_rol: 0,
          };
        });
    } else {
      if (
        this.userRegister.nombre_usuario != null &&
        this.userRegister.correo_electronico != null &&
        this.userRegister.rut_usuario != null &&
        this.userRegister.id_cliente != 'default' &&
        this.userRegister.estado != 'default'
      ) {

        if(this.userRegister.correo_electronico.match(/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)!=null){
          this.usuariosServices.registrarUsuario(this.userRegister).subscribe(
            (res) => {
              alert('usuario registrado con exito');
              this.num = 0;
              this.getUsuarios();
              this.num = 0;
              this.userRegister = {
                id_usuario: 0,
                nombre_usuario: '',
                rut_usuario: '',
                correo_electronico: '',
                dni: '',
                id_cliente: '',
                estado: '',
                password_MD5: '',
                id_rol: 0,
              };
            },
            (err) => {
              if (err.status == 409) {
                alert('usuario ya está registrado');
              }
              this.userRegister = {
                id_usuario: 0,
                nombre_usuario: '',
                rut_usuario: '',
                correo_electronico: '',
                dni: '',
                id_cliente: '',
                estado: '',
                password_MD5: '',
                id_rol: 0,
              };
            }
          );
        }else{
          alert("Ingrese un correo electrónico válido")
        }


      }else{
        alert("por favor rellene los campos correspondientes")
      }
    }
  }

  limpiar() {
    this.userRegister = {
      id_usuario: null,
      nombre_usuario: null,
      rut_usuario: null,
      correo_electronico: null,
      dni: ' ',
      id_cliente: 'default',
      estado: 'default',
      password_MD5: ' ',
      id_rol: 0,
    };
    this.Label1 = 'Agregar Usuario';
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
