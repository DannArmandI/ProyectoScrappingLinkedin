import { Component, OnInit, AfterViewInit, Output, ViewChild, Input, ElementRef, NgZone , EventEmitter} from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { JobsService } from 'src/app/services/jobs.service';
import { CompanyService } from 'src/app/services/company.service';



@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  ngOnInit(): void {
    this.obtenerCompany();
  }

  // name = 'Angular';
  // chartType: string = 'XYChart';
  // chartData: any[];
  // categoryAxis : am4charts.CategoryAxis;
  // columnSeriesOne: am4charts.ColumnSeries;
  // valueAxis: am4charts.ValueAxis;
  // graphs: am4charts.Series[] = [];
  // input: string;


  listaCompany:any=[];
  listaDescarga:any=[];
  listaIdPost:any=[];
  auxListaIdUser:any=[];
  listaIdUser:any=[];
  auxListaJobs:any=[];
  listaJobs:any=[];
  auxId:any;
  dataGrafico:any=[];


  fechaDesde: Date
  fechaHasta: Date
  idCompanySelect: string = "default"
  idDescargaSelect: string = "default"
  flag: boolean = false
  tittleGrafico:string = ""
  constructor(public metodosJobs:JobsService, public metodosCompany:CompanyService) { }


  cambiarSelect(){
    // alert(this.idCompanySelect)
    this.flag = false
    this.tittleGrafico = ""
    
    // let btnCharts = <HTMLInputElement>document.getElementById("navBtnCharts")
    // btnCharts.style.visibility = "hidden"

    // let chart = <HTMLDivElement>document.getElementById("chartdiv")
    // chart.style.visibility="hidden"
    this.resetChart()
  }

  resetChart(){
    var chart = am4core.create("chartdiv3", am4charts.XYChart);
    chart.data = []
  }

  


  obtenerCompany(){
    this.metodosCompany.get2Companies(sessionStorage.getItem("cliente")).subscribe(
      res=>{this.listaCompany = res;},
      err=>{console.log(err)}
    )
  }  

  obtenerDescarga() {
    //console.log("idCompany: " + idCompany)
    this.idDescargaSelect = 'default'
    this.cambiarSelect()
    this.metodosJobs.obtenerDatosDescargas(this.idCompanySelect).subscribe(
      res=>{this.listaDescarga = res;},
      err=>{console.log(err)}
    )
  }

  obtenerIdPost() {
    this.metodosJobs.obtenerIdPost(this.idDescargaSelect, this.fechaDesde, this.fechaHasta).subscribe(
      res=>{
        this.listaIdPost = res; 
        //console.log("lista de posts: "+this.listaIdPost)
        for(let i=0 ; i<this.listaIdPost.length ; i++){
          //console.log("idPost: " + this.listaIdPost[i])
          this.obtenerIdUser(this.listaIdPost[i])
        }
      },
      err=>{console.log(err)}
    )
  }

  obtenerIdUser(idPost:any){
    this.metodosJobs.obtenerIdUser(idPost).subscribe(
      res=>{
        this.listaIdUser = res;
        this.listaIdUser = [...new Set(this.listaIdUser)];
        //console.log("lista de users del post " + idPost + " : "+this.listaIdUser)
        for(let i=0 ; i<this.listaIdUser.length ; i++){
          //console.log("idUser: " + this.listaIdUser[i])
          this.obtenerJobs(this.listaIdUser[i])
        }
      },
      err=>{console.log(err)}
    )
  }

  obtenerJobs(idUser:any){
    let ejeX_areas:any=[];
    let ejeY_cantidad:any=[];
    let chartData:any=[]
    var chart = am4core.create("chartdiv3", am4charts.XYChart);
    this.metodosJobs.obtenerJobs(idUser).subscribe(
      res=>{
        this.listaJobs.push(res)
        ejeX_areas = [...new Set(this.listaJobs)];
        ejeY_cantidad = new Array(ejeX_areas.length).fill(0);
        for(let i=0 ; i<this.listaJobs.length ; i++){
          for(let j=0 ; j<ejeX_areas.length ; j++){
            if(this.listaJobs[i] == ejeX_areas[j]){
              ejeY_cantidad[j]++
            }
          }
        }
        //console.log("idUser: " + idUser)
        //console.log("area: " + res)
        //console.log("x.length: " + this.ejeX_areas.length + "\ny.length: "+ this.ejeY_cantidad.length)
        //console.log("x.contenido: " + ejeX_areas + "\ny.contenido: "+ ejeY_cantidad)


        for(let i=0 ; i<ejeX_areas.length ; i++){
          let dato = {
            "job": ejeX_areas[i],
            "cantidad": ejeY_cantidad[i]
          }
          chartData.push(dato)
          //chartData.push('"job": "' + ejeX_areas[i] + '","cantidad": ' + ejeY_cantidad[i] + ',')
        }
        //console.log("data del grafico: " + chartData)


        chart.data = chartData
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "job";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "cantidad";
        series.dataFields.categoryX = "job";
        series.tooltipText = "[bold]{valueY}[/]";
        series.stacked = true;
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.__disabled = true;
      },
      err=>{console.log(err)}
    )
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
          divChart.style.height = "60%"
          chart.style.height = "100%"
          canvas[0].style.height = "60%"
          canvas[1].style.height = "60%"
          // this.root.resize()
        }, 250);
        
        
      }
    }, 1);
    
}


  validacion(){

    console.log(this.idDescargaSelect + " valor");

    if(this.fechaDesde != null && this.fechaHasta != null && this.idCompanySelect!=null && this.idDescargaSelect!=null){
      if(this.fechaDesde<=this.fechaHasta){
        if(this.idCompanySelect!="default" && this.idDescargaSelect!="default"){
          this.flag = true
          this.tittleGrafico = "Áreas de trabajo"
          this.obtenerIdPost()
        }else{
          alert("Debe seleccionar una compañia y descarga")
        }
      }else{
        this.flag = false
        alert("La fecha desde debe ser menor o igual a fecha hasta")
      }

    }else{
      //console.log("entra aca 2");
      this.flag = false
      alert("Por favor seleccione las fechas y descarga correspondientes")
    }
  }

  
}