import { Component, OnInit } from '@angular/core';
import { DownloadService } from 'src/app/services/download.service';
import { CompanyService}  from 'src/app/services/company.service'
import { Company } from 'src/app/interfaces/company';
import { descarga } from 'src/app/interfaces/descarga';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import * as am5percent from "@amcharts/amcharts5/percent";
import { DemographicService } from 'src/app/services/demographic.service';
import { runInThisContext } from 'vm';
import ResponsiveTheme from '@amcharts/amcharts5/themes/Responsive';

@Component({
  selector: 'app-demografico',
  templateUrl: './demografico.component.html',
  styleUrls: ['./demografico.component.css']
})
export class DemograficoComponent implements OnInit {
  flag:boolean = false
  fecha_desde: Date
  fecha_hasta: Date
  arrayCompany: Company[]
  arrayDescarga: descarga[]
  idCompanySelect: string = "default"
  idDescargaSelect: string = "default"
  root: am5.Root;
  series: am5percent.PieSeries;
  responsive: am5themes_Responsive;
  legend: any;
  num:number = 1;
  data = [];
  tittleGrafico:string
  num2:number = 1
  flagChart: boolean = false
  constructor(private descargasServices:DownloadService, private companysServices: CompanyService, private demographicService:DemographicService) { }

  ngOnInit(): void {
    this.flagChart = true
    if(sessionStorage.getItem("rol")=="1"){
      this.getCompanysSA();
    }
    else{
      this.getCompanys();
    }
  }
 
  
  ngAfterViewInit(){
    this.getChart()
  }
  


  getChart() {
     // Chart code goes in here


    console.log("entra en getchart");
       
    this.root =  am5.Root.new("chartdiv");
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);
    this.root.setThemes([
      am5themes_Responsive.new(this.root)
    ]);
    this.root.autoResize = true

    

    let chart = this.root.container.children.push( 
      am5percent.PieChart.new(this.root, {
        layout: this.root.verticalLayout
      }) 
    );
    
    

     
     // Define data
     // let data = this.data
     
     // Create series
     this.series = chart.series.push(
       am5percent.PieSeries.new(this.root, {
         name: "Series",
         valueField: "values",
         categoryField: "category"
       })
     );
     // this.series.data.setAll(this.data);
     
     // Add legend
     this.legend = chart.children.push(am5.Legend.new(this.root, {
       centerX: am5.percent(50),
       x: am5.percent(50),
       layout: this.root.verticalLayout,
       height: am5.percent(40),
       verticalScrollbar: am5.Scrollbar.new(this.root, {
         orientation: "vertical"
       })
     }));
     
     // this.legend.data.setAll(this.series.dataItems);
  }

  getCompanys(){
    let idCliente = sessionStorage.getItem("cliente")
    this.companysServices.get2CompaniesDownload(idCliente).subscribe(
      res=>{
        this.arrayCompany = res
        this.getDownloads();
        
      },err=>{
        console.log(err)
      }
    )
  }

  getCompanysSA(){
    
    this.companysServices.get2CompaniesDownloadSA().subscribe(
      res=>{
        this.arrayCompany = res
        this.getDownloads();
        
      },err=>{
        console.log(err)
      }
    )
  }


  getDownloads(){
    this.descargasServices.getDownloadsDone(this.idCompanySelect).subscribe(
      res=>{
        this.arrayDescarga = res
        console.log(res)
      },err=>{
        console.log(err)
      }
    )
  }
  

  cambiarSelectCompany(){
    this.idDescargaSelect = 'default'
    this.arrayDescarga = []
    this.getDownloads()
    this.tittleGrafico = ""
    this.flag = false
    let chart = <HTMLDivElement>document.getElementById("chartdiv")
    chart.style.visibility="hidden"

    let btnCharts = <HTMLInputElement>document.getElementById("navBtnCharts")
    btnCharts.style.visibility = "hidden"

    this.resetChart()
  }


  cambiarSelect(){
    // alert(this.idCompanySelect)
    this.flag = false
    this.tittleGrafico = ""
    let btnCharts = <HTMLInputElement>document.getElementById("navBtnCharts")
    btnCharts.style.visibility = "hidden"

    let chart = <HTMLDivElement>document.getElementById("chartdiv")
    chart.style.visibility="hidden"
    this.resetChart()
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
    this.resetChart()
    // console.log(this.fecha_desde)
    // console.log(this.fecha_hasta)
    // console.log(this.idCompanySelect)
    // console.log(this.idDescargaSelect)
   
    if(this.fecha_desde != null && this.fecha_hasta != null && this.idCompanySelect!=null && this.idDescargaSelect!=null){
      console.log("entra aca 1");
      if(this.fecha_desde<=this.fecha_hasta){
        if(this.idDescargaSelect!="default" && this.idDescargaSelect!="default"){
          this.flag = true


          let btnCharts = <HTMLInputElement>document.getElementById("navBtnCharts")
          btnCharts.style.visibility = "visible"

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

  resetChart(){
    this.data = []
    this.series.data.setAll(this.data);
    this.legend.data.setAll(this.series.dataItems);

    
  }

  // app.post('/graphics/demography/reactions/institutions', usersDemography.getInstitutionReactionsUsers);
  //   app.post('/graphics/demography/reactions/degrees', usersDemography.getProfessionReactionsUsers);
  //   app.post('/graphics/demography/reactions/countries', usersDemography.getCountryReactionsUsers);
  //   app.post('/graphics/demography/reactions/locations', usersDemography.getLocationReactionsUsers);
  //   // demography comments
  //   app.post('/graphics/demography/comments/institutions', usersDemography.getInstitutionCommentsUsers);
  //   app.post('/graphics/demography/comments/degrees', usersDemography.getProfessionCommentsUsers);
  //   app.post('/graphics/demography/comments/countries', usersDemography.getCountryCommentsUsers);
  //   app.post('/graphics/demography/comments/locations', usersDemography.getLocationCommentsUsers);


  getInstitutionReactionsUsers(){

    this.demographicService.getInstitutionReactionsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }
   
  getProfessionReactionsUsers(){
    this.demographicService.getProfessionReactionsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }
  getCountryReactionsUsers(){
    this.demographicService.getCountryReactionsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }

  getLocationReactionsUsers(){
    this.demographicService.getLocationReactionsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }
  
  getCompanyReactionsUsers(){
    this.demographicService.getCompanyReactionsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }

  getJobReactionsUsers(){
    this.demographicService.getJobReactionsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }
  
  getInstitutionCommentsUsers(){
    this.demographicService.getInstitutionCommentsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }
  getProfessionCommentsUsers(){
    this.demographicService.getProfessionCommentsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }
  getCountryCommentsUsers(){
    this.demographicService.getCountryCommentsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }
  getLocationCommentsUsers(){
    this.demographicService.getLocationCommentsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }

  getCompanyCommentsUsers(){
    this.demographicService.getCompanyCommentsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }

  getJobCommentsUsers(){
    this.demographicService.getJobCommentsUsers(this.idDescargaSelect, this.fecha_desde, this.fecha_hasta).subscribe(
      res=>{
        console.log(JSON.stringify(res))
        this.data = res
        this.data = this.data.sort((a,b)=> b.values - a.values)
        this.data = this.data.slice(0,30)
        this.series.data.setAll(this.data);
        this.legend.data.setAll(this.series.dataItems);
      }
    )
  }
  
 
  changeOption(num:number){
      
    
    // let div = <HTMLInputElement>document.getElementById("collapseCard")
    // let a = <HTMLLinkElement>document.getElementById("collapsedLink")
    // console.log(div);
    // a.classList.add("collapsed")
    // div.classList.remove('show')
    // this.colapsar()
    let chart = <HTMLDivElement>document.getElementById("chartdiv")
    chart.style.visibility="visible"

    
    
    switch(num){
      
     

      case 1:
        this.tittleGrafico = "REACCIONES - INSTITUCIONES"
        this.getInstitutionReactionsUsers();
        break;
      case 2:
        this.tittleGrafico = "REACCIONES - PROFESIONES"
        this.getProfessionReactionsUsers();
        break;
      case 3:
        this.tittleGrafico = "REACCIONES - PAISES"
        this.getCountryReactionsUsers();
        break;
      case 4:
        this.tittleGrafico = "REACCIONES - UBICACIONES"
        this.getLocationReactionsUsers();
        break;
      case 5:
        this.tittleGrafico = "REACCIONES - COMPAÑIAS"
        this.getCompanyReactionsUsers();
        break;
      case 6:
        this.tittleGrafico = "REACCIONES - CARGOS LABORALES"
        this.getJobReactionsUsers();
        break;
      case 7:
        this.tittleGrafico = "COMENTARIOS - INSTITUCIONES"
        this.getInstitutionCommentsUsers();
        break;
      case 8:
        this.tittleGrafico = "COMENTARIOS - PROFESIONES"
        this.getProfessionCommentsUsers();
        break;
      case 9:
        this.tittleGrafico = "COMENTARIOS - PAISES"
        this.getCountryCommentsUsers();
        break;
      case 10:
        this.tittleGrafico = "COMENTARIOS - UBICACIONES"
        this.getLocationCommentsUsers();
        break;
      case 11:
        this.tittleGrafico = "COMENTARIOS - COMPAÑIAS"
        this.getCompanyCommentsUsers();
        break;
      case 12:
        this.tittleGrafico = "COMENTARIOS - CARGOS LABORALES"
        this.getJobCommentsUsers();
        break;
    }
  
  }



}
