import { toNumber } from '@amcharts/amcharts5/.internal/core/util/Type';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { descarga } from 'src/app/interfaces/descarga';
import { DownloadService } from 'src/app/services/download.service';
import { ExtractionService } from 'src/app/services/extraction.service';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-descargas',
  templateUrl: './descargas.component.html',
  styleUrls: ['./descargas.component.scss']
})
export class DescargasComponent implements OnInit {
  num: number;
  listaDownloads:Array<descarga>;
  label1="Fecha Desde";
  label2="Fecha Hasta";
  title = ""
  id:any
  company:any;
  Aux2:descarga={
    id_descarga: null,
    Fecha_Des: null,
    Fecha_Has: null,
    Estado:null,
    Fecha_Cre:null,
    Fecha_Act:null,
    id_Company:null,
    Running:0
  }
  datasource: MatTableDataSource<descarga>
  displayedColumns: string[] = ["id_descarga",	"fecha_desde"	,"fecha_hasta"	,"fecha_creacion", "fecha_actualizacion",	"estado", "acciones"];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

  constructor(public downloadsService:DownloadService ,public extractionService: ExtractionService , private ruta: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer) {
  }

  ngOnInit(): void {
    this.ruta.params.subscribe(datos=>{
      this.id=datos["id"];
      console.log(this.id);
    })
    this.getDescargas();
  }
  getDescargas(){
    this.downloadsService.getDownloads(this.id).subscribe(
      res=> {
        console.log(res)
        this.listaDownloads=res;
        this.datasource = new MatTableDataSource(this.listaDownloads);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      },
      err => console.log(err)
    )
  }
  // ListaDescarga(){
  //   //this.num=1;
  //   //this.company=id_Company;
  //   //sessionStorage.setItem("company",id_Company);
  //   this.getDescargas();
  // }
  AddDescarga(form:NgForm){
    this.Aux2.Fecha_Des=form.value.FechaDes;
    this.Aux2.Fecha_Has=form.value.FechaHas;
    this.Aux2.id_Company=this.id;
    if (this.Aux2.id_descarga){
      console.log("Actualizando")
      this.downloadsService.UpdateDownloads(this.Aux2).subscribe(
        res=> {
          console.log(res)
          alert("Descarga actualizada con exito!")
          this.num = 0
          this.getDescargas();
          this.label1="Fecha Desde";
          this.label2="Fecha Hasta";
          this.Aux2.id_descarga=null;
          this.resertForm(form)
        },
        err => console.log(err)
      )
    }else{
      this.Aux2.Estado=1
      console.log("agregando",this.Aux2)
      this.downloadsService.AddDownloads(this.Aux2).subscribe(
        res=> {
          console.log(res)
          alert("Descarga agregada con exito!")
          this.num = 0

          this.getDescargas();
          this.label1="Fecha Desde";
          this.label2="Fecha Hasta";
          this.resertForm(form)
        },
        err => console.log(err)
      )
    }
  }
  editDownload(download:descarga){
    this.label1="Ingrese nueva Fecha Desde"
    this.label2="Ingrese nueva Fecha Hasta"
    this.title = "Editar Descarga"
    this.Aux2.id_descarga=download.id_descarga;
    this.Aux2.Estado=download.Estado;
    this.Aux2.Fecha_Des = download.Fecha_Des;
    this.Aux2.Fecha_Has = download.Fecha_Has;
  }
  resertForm(form: NgForm){
    form.reset()
  }
  limpiar(){
    this.Aux2={
      id_descarga: null,
      Fecha_Des: null,
      Fecha_Has: null,
      Estado:null,
      Fecha_Cre:null,
      Fecha_Act:null,
      id_Company:null,
      Running:0
    };
  }
  activateDescarga(id_descarga: any){
    this.downloadsService.ActivateDownloads(id_descarga).subscribe(
      res=> {
        console.log(res)
        this.getDescargas();
      },
      err => console.log(err)
    )

  }
  deleteDescarga(id_descarga: any,Running:any){
    if(Running==1){
      alert('Descarga Ejecutandoce en estos momentos o ya terminada')
      return 0
    }
    // if(confirm('Are u sure you want delete it?')){
      this.downloadsService.deleteDownloads(id_descarga).subscribe(
        res=> {
          console.log(res)
          this.getDescargas();
        },
        err => console.log(err)
      )
    // }
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
