import { Component, OnInit, AfterViewInit, Output, ViewChild, Input, ElementRef, NgZone , EventEmitter} from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { SentimientosService } from 'src/app/services/sentimientos.service';
import { descarga } from 'src/app/interfaces/descarga';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/interfaces/company';
import { Post } from 'src/app/interfaces/post';
import { Comment } from 'src/app/interfaces/comment';

@Component({
  selector: 'app-sentimientos',
  templateUrl: './sentimientos.component.html',
  styleUrls: ['./sentimientos.component.css']
})
export class SentimientosComponent implements OnInit {

  id:any;
  aux1:any
  aux2:any
  aux3:any;
  contNegativo = 0;
  contPositivo = 0;
  contNeutro = 0;

  fechaDesde: Date
  fechaHasta: Date
  idCompanySelect: string = "default"
  idDescargaSelect: string = "default"
  flag: boolean = false
  chart: any;
  series: any;
  tittleGrafico: string = ""
  ngOnInit() {
    this.obtenerCompany();
  }

  listaCompany:Array<Company>;
  listaDescarga:Array<descarga>;
  listaPost:Array<Post>;
  listaSentimentos:Array<Comment>;
  descargaSeleccionada: any;

  constructor(public metodosSentimientos: SentimientosService, public metodosCompany: CompanyService){  }

  //SE OBTIENE LAS COMPAÑIAS A TRAVÉS DE LA ID CLIENTE
  obtenerCompany(){
    console.log("clienteeee: " + sessionStorage.getItem("cliente"));
    this.metodosCompany.get2Companies(sessionStorage.getItem("cliente")).subscribe(
      res=>{
        this.listaCompany = res;
      },
      err=>{console.log(err)}
    )
  }

  //SE OBTIENE LAS DESCARGAS A TRAVÉS DE LA ID COMPANY
  obtenerDescarga() {
    this.idDescargaSelect = 'default'
    console.log("idCompany: " + this.idCompanySelect)
    this.metodosSentimientos.obtenerDatosDescargas(this.idCompanySelect).subscribe(
      res=>{
        this.listaDescarga = res;
      },
      err=>{console.log(err)}
    )
    this.resetChart()
  }

  //SE OBTIENE LOS POST A TRAVÉS DE LA ID DESCARGA
  obtenerIdPost() {
    console.log("idDescarga: " + this.idDescargaSelect)
    this.metodosSentimientos.obtenerIdPost(this.idDescargaSelect, this.fechaDesde, this.fechaHasta).subscribe(
      res=>{
        this.listaPost = res;
        console.log("largo: " + this.listaPost.length)
        for (let i = 0; i < this.listaPost.length; i++) {
          console.log("idPost: " + this.listaPost[i])
          this.obtenerSentimientos(this.listaPost[i].id_post)
        }
      },
      err=>{console.log(err)}
    )
  }

  //SE OBTIENE TODOS LOS SENTIMIENTOS 
  obtenerSentimientos(idPost:any) {
    let listaSentimientos = []
    let aux = [];
    let i: number;
    let j: number;

    this.metodosSentimientos.obtenerSentimientos(idPost).subscribe(
      res => {
        aux = JSON.stringify(res).split(",")
        console.log("aux: " + aux)
        
        for (i = 0; i < aux.length; i++) {
            console.log("sentimiento" + aux[i].split(":")[1].split("}")[0])
            listaSentimientos.push(aux[i].split(":")[1].split("}")[0])
            console.log("listaSentimientos: " + listaSentimientos.length)
              if (listaSentimientos[i] == '"negativo"') {
                  this.contNegativo = this.contNegativo+1;
                  console.log(this.contNegativo);
              }
              else if (listaSentimientos[i] == '"positivo"') {
                this.contPositivo = this.contPositivo+1;
                  console.log(this.contPositivo);
              }
              else if (listaSentimientos[i] == '"neutro"') {
                this.contNeutro = this.contNeutro+1;
                  console.log(this.contNeutro);
              }
        }

        console.log("negativooo: " + this.contNegativo)
        console.log("positivoooo: " + this.contPositivo)
        console.log("neutroooo: " + this.contNeutro)

        this.graficar(this.contNegativo, this.contPositivo,  this.contNeutro)
      }
    );
  }

  //METODO CON TODAS LAS VARIABLES PARA GRAFICAR
  graficar(contNegativo:any , contPositivo:any, contNeutro:any) {
    this.chart = am4core.create("chartdiv2", am4charts.XYChart);

    this.chart.data = [{
      "sentimientos": "negativo",
      "cantidad": contNegativo,
      }, {
      "sentimientos": "positivo",
      "cantidad": contPositivo,
      },{
      "sentimientos": "neutro",
      "cantidad": contNeutro,
    }];

    console.log("chartData STRNGFY: " + JSON.stringify(this.chart.data));

    // Create axes
    var categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "sentimientos";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    this.series = this.chart.series.push(new am4charts.ColumnSeries());
    this.series.dataFields.valueY = "cantidad";
    this.series.dataFields.categoryX = "sentimientos";
    this.series.tooltipText = "[bold]{valueY}[/]";
    this.series.stacked = true;
    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.__disabled = true;
  }

  resetChart(){
    this.chart = am4core.create("chartdiv2", am4charts.XYChart);
    this.tittleGrafico = ""
    // this.chart.data = []
   
    // this.series = this.chart.series.push(new am4charts.ColumnSeries());
    // this.chart.cursor = new am4charts.XYCursor();
  }


  colapsar(){
    let chart = <HTMLDivElement>document.getElementById("chartdiv")
    // chartdiv
    let divChart = <HTMLCanvasElement><unknown>document.getElementById("divChart")
    let canvas = <HTMLCanvasElement><unknown>document.querySelectorAll("canvas")
    let collapsedLink = <HTMLDivElement>document.getElementById("collapsedLink")



    setTimeout(() => {
      if(collapsedLink.classList.contains("collapsed")){
      
        
        // chart.style.height = "100%"
        setTimeout(() => {
          divChart.style.height = "90%"
          canvas[0].style.height = "100%"
          canvas[1].style.height = "100%"
          
          // this.root.resize()
        }, 100);
      }
      else{
        
        // chart.style.height = "100%"
        
        setTimeout(() => {
          divChart.style.height = "70%"
          chart.style.height = "100%"
          canvas[0].style.height = "60%"
          canvas[1].style.height = "60%"
          // this.root.resize()
        }, 250);
        
        
      }
    }, 1);
    
}

  validacion(){
    //this.resetChart()
    // console.log(this.fecha_desde)
    // console.log(this.fecha_hasta)
    // console.log(this.idCompanySelect)
    // console.log(this.idDescargaSelect)
  
    if(this.fechaDesde != null && this.fechaHasta != null && this.idCompanySelect!=null && this.idDescargaSelect!=null){
      console.log("entra aca 1");
      if(this.fechaDesde<=this.fechaHasta){
        if(this.idCompanySelect!="default" && this.idDescargaSelect!="default"){
          this.flag = true
        
          this.obtenerIdPost()
          this.tittleGrafico = "Sentimientos - comentarios"
        }else{
          alert("debe seleccionar una compañia y descarga")
        }
      }else{
        this.flag = false
        alert("fecha desde debe ser menor o igual a fecha hasta")
      }

    }else{
      console.log("entra aca 2");
      this.flag = false
      alert("Por favor seleccione las fechas y descarga correspondientes")
    }
  }
}