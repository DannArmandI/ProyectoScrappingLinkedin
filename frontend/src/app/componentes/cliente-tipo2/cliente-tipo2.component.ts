import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesTipo2Service } from 'src/app/services/clientes-tipo2.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanesService } from 'src/app/services/plan.service';
import { formatDate } from '@angular/common';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import { ClientesTipo2 } from 'src/app/interfaces/clientes-tipo2';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-cliente-tipo2',
  templateUrl: './cliente-tipo2.component.html',
  styleUrls: ['./cliente-tipo2.component.scss']
})
export class ClienteTipo2Component implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  constructor(public metodos:ClientesTipo2Service, public metodosPlanes:PlanesService, private _liveAnnouncer: LiveAnnouncer) { }

  nombreMetodo = 'mostrar';
  idCliente:any;
  auxCliente:any;
  auxPlan:any
  num:any;
  valueSelect:string = "default"
  valueSelectRol: string = "default"
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  datasource: MatTableDataSource<ClientesTipo2>
  displayedColumns: string[] = ["id_cliente",	"rut_cliente"	,"razon_social"	,"fecha_inicio_contrato", "fecha_fin_contrato",	"correo_electronico", "created_at", "updated_at","id_plan", "estado", "acciones"];
  ngOnInit(): void {
    this.mostrarClientesTipo2();
    this.mostrarClienteTipo2(this.idCliente);
    this.mostrarMetodos(this.nombreMetodo);
    this.id_plan();
  }

  id_plan() {
    this.metodosPlanes.mostrarPlanes().subscribe(
    res=>{
      this.metodosPlanes.planes = res;
    },
    err=>{console.log(err)}
  )
  }

  mostrarClientesTipo2() {
    this.metodos.mostrarClientesTipo2().subscribe(
      res=>{
        console.log(res);
        this.metodos.clientesTipo2 = res;
        this.datasource = new MatTableDataSource(this.metodos.clientesTipo2);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      },
      err=>{console.log(err)}
    )
  }

  mostrarClienteTipo2(auxIdCliente:any) {
    this.idCliente = auxIdCliente;
    this.metodos.mostrarClienteTipo2(auxIdCliente).subscribe((res:any) =>{
        this.auxCliente = res.data;
      },
      err=>{console.log(err)}
    )
  }

  editarClienteTipo2(nuevoCliente:any) {

    if(nuevoCliente.value.id_rol!="default" && nuevoCliente.value.id_plan!="default"){
      this.metodos.editarClienteTipo2(nuevoCliente.value, this.idCliente).subscribe(
        res=>{
          this.ngOnInit();
          this.nuevoCliente.reset();
  
          alert("cliente editado con exito!")
          this.mostrarMetodos('mostrar')
        },
        err=>{console.log(err)}
      )
    }else{
      alert("Por favor rellene los campos")
    }
    
  }

  //CREAR OBJETO
  nuevoCliente = new FormGroup ({
    'rut_cliente': new FormControl('',Validators.required),
    'razon_social': new FormControl('',Validators.required),
    'fecha_inicio_contrato': new FormControl('',Validators.required),
    'fecha_fin_contrato': new FormControl('',Validators.required),
    'correo_electronico': new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
    'id_rol': new FormControl('',Validators.required),
    'id_plan': new FormControl('',Validators.required),
  });

  agregarClienteTipo2(nuevoCliente:any) {


    console.log(nuevoCliente.value);

    if (nuevoCliente.valid && this.valueSelect!='default' && this.valueSelectRol!='default') {

      this.metodos.agregarClienteTipo2(nuevoCliente.value).subscribe(
        res=>{
          this.nuevoCliente.reset();
          this.ngOnInit();

          alert("cliente agregado con exito!")
          this.mostrarMetodos('mostrar')
        },
        error => {
          if(error.status ==400){
            alert('email ya ha sido registrado');
          }
        }
      )
    }else{
      alert("Por favor rellene los campos")
    }
  }

  mostrarMetodos(auxmetodo:string) {
    this.nombreMetodo = auxmetodo;
  }

  newClient(){
    this.nuevoCliente = new FormGroup ({
      'rut_cliente': new FormControl('',Validators.required),
      'razon_social': new FormControl('',Validators.required),
      'fecha_inicio_contrato': new FormControl('',Validators.required),
      'fecha_fin_contrato': new FormControl('',Validators.required),
      'correo_electronico': new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
      'id_rol': new FormControl('',Validators.required),
      'id_plan': new FormControl('',Validators.required),
    });
  }

  cambiarEstado(idCliente:string, estado:string){
    if(estado=="1"){
      this.metodos.desactivarClienteTipo2(idCliente).subscribe(
        res =>{
          this.mostrarClientesTipo2();
        }, err=>{
          console.log("error")
        }
      )
    }
    else {
      this.metodos.activarClienteTipo2(idCliente).subscribe(
        res =>{
          this.mostrarClientesTipo2();
        },
        err=>{
          console.log("error")
        }
      )
    }
  }

  resetNuevoCliente(){
    this.nuevoCliente.reset();
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
