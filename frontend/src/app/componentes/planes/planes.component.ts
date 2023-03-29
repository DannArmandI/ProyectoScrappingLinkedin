import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
//import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Plan } from 'src/app/interfaces/plan';
import { PlanesService } from 'src/app/services/plan.service';
import { DdMmYYYYDatePipe } from 'src/app/dd-mm-yyyy-date.pipe';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {

  public selectedPlan : Plan = {
    nombre_plan: '',
    numero_usuarios: 0,
    numero_menciones: 0,
    precio_CLP: 0,
    precio_USD: 0,
    cantidad_reportes: 0,
    porcentaje_descuento: 0,
    duracion_almacenamiento: 0,
    //estado: 0
  }

  // formularioEditarPlan = new FormGroup ({
  //   "": new FormControl('', Validators.required),
  // })
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  constructor(public metodos:PlanesService, private _liveAnnouncer: LiveAnnouncer) { }

  flagMetodo: String = 'mostrar';
  datosPlanes:any;
  auxId:any;
  auxPlan:any;
  num:any;
  title = "";
  datasource: MatTableDataSource<Plan>
  displayedColumns: string[] = ["id_plan",	"nombre_plan", "numero_usuarios",	"numero_menciones"	,"precio_CLP","precio_USD","cantidad_reportes","porcentaje_descuento",	"duracion_almacenamiento",	"created_at",	"updated_at",	"estado",	"acciones"];

  ngOnInit(): void {
    this.mostrarPlanes();
    this.mostrarMetodos(this.flagMetodo);
    this.mostrarPlan(this.auxId);
    //setTimeout(() => { this.ngOnInit() }, 1000 * 1)
  }

  mostrarPlanes(){

    this.metodos.mostrarPlanes().subscribe(res=>{
      this.metodos.planes = res;
      this.datasource = new MatTableDataSource(this.metodos.planes);
      this.datasource.sort = this.sort;
      this.datasource.paginator = this.paginator;
    }, err=>{console.log(err)})
  }

  mostrarPlan(id:any){
    this.auxId = id;
    this.metodos.mostrarPlan(id).subscribe((res:any) => {this.auxPlan = res.data;})
  }

  mostrarMetodos(flagMetodo: any) {
    this.flagMetodo = flagMetodo;
  }

  editarPlan(objetoPlan:any){
    this.metodos.editarPlan(objetoPlan.value, this.auxId).subscribe((res:any) => {
      // this.objetoPlan.reset();
      this.resetPlanes();
      this.ngOnInit();
    });
  }

  agregarPlan(objetoPlan:any){
    this.metodos.agregarPlan(objetoPlan.value).subscribe((res:any) => {
      // this.objetoPlan.reset();
      this.resetPlanes()
      this.ngOnInit();
    });
  }

  objetoPlan = new FormGroup({
    'nombre_plan': new FormControl('',Validators.required),
    'numero_usuarios': new FormControl('',Validators.required),
    'numero_menciones': new FormControl('',Validators.required),
    'precio_CLP': new FormControl('',Validators.required),
    'precio_USD': new FormControl('',Validators.required),
    'cantidad_reportes': new FormControl('',Validators.required),
    'porcentaje_descuento': new FormControl('',Validators.required),
    'duracion_almacenamiento': new FormControl('',Validators.required),
  })

  cambiarEstado(idPlan:string, estado:string){
    if(estado=="1"){
      this.metodos.desactivarPlan(idPlan).subscribe(res =>{this.mostrarPlanes()}, err=>{console.log("No se pudo desactivar el plan.")})
    }
    else{
      this.metodos.activarPlan(idPlan).subscribe(res =>{this.mostrarPlanes()}, err=>{console.log("No se pudo activar el plan.")})
    }
  }
  resetPlanes(){
    this.objetoPlan =  new FormGroup({
      'nombre_plan': new FormControl('',Validators.required),
      'numero_usuarios': new FormControl('',Validators.required),
      'numero_menciones': new FormControl('',Validators.required),
      'precio_CLP': new FormControl('',Validators.required),
      'precio_USD': new FormControl('',Validators.required),
      'cantidad_reportes': new FormControl('',Validators.required),
      'porcentaje_descuento': new FormControl('',Validators.required),
      'duracion_almacenamiento': new FormControl('',Validators.required),
    })
  }
  resetObjetoPlan(){
    this.objetoPlan.reset();
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
