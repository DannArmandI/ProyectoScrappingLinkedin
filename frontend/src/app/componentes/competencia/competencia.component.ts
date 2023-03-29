import { Component, OnInit } from '@angular/core';
import { DownloadService } from 'src/app/services/download.service';
import { CompanyService}  from 'src/app/services/company.service'
import { Company } from 'src/app/interfaces/company';
import { descarga } from 'src/app/interfaces/descarga';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5percent from "@amcharts/amcharts5/percent";
import { DemographicService } from 'src/app/services/demographic.service';

@Component({
  selector: 'app-competencia',
  templateUrl: './competencia.component.html',
  styleUrls: ['./competencia.component.css']
})

export class CompetenciaComponent implements OnInit {
flag:boolean = false
fecha_desde: Date
fecha_hasta: Date
arrayCompany: Company[]
arrayDescarga1: descarga[]
arrayDescarga2: descarga[]
idCompanySelect1: string = "default"
idCompanySelect2: string = "default"
idDescargaSelect1: string = "default"
idDescargaSelect2: string = "default"
root1: am5.Root;
root2: am5.Root;
series1: am5percent.PieSeries;
series2: am5percent.PieSeries;
legend1: any;
legend2: any;
num:number = 1;
data1 = []
data2 = []
titleString1: string; 
titleString2: string;

constructor(private descargasServices:DownloadService, private companysServices: CompanyService, private demographicService:DemographicService) { }

ngOnInit(): void {

  this.getCompanys();
  
}

ngAfterViewInit() {
  this.grafico1();
  this.grafico2();
}

grafico1() {   
  this.root1 =  am5.Root.new("chartdiv4");

  this.root1.setThemes([
    am5themes_Animated.new(this.root1)
  ]);

  let chart = this.root1.container.children.push( 
    am5percent.PieChart.new(this.root1, {
      layout: this.root1.verticalLayout
    }) 
  );
  
  this.root1.autoResize = true
  // Create series
  this.series1 = chart.series.push(
    am5percent.PieSeries.new(this.root1, {
      name: "Series",
      valueField: "values",
      categoryField: "category"
    })
  );
  
  // Add legend
  this.legend1 = chart.children.push(am5.Legend.new(this.root1, {
    centerX: am5.percent(50),
    x: am5.percent(50),
    layout: this.root1.verticalLayout,
    height: am5.percent(40),
    verticalScrollbar: am5.Scrollbar.new(this.root1, {
      orientation: "vertical"
    })
  }));
}

grafico2() {    
  this.root2 =  am5.Root.new("chartdiv5");

  this.root2.setThemes([
    am5themes_Animated.new(this.root2)
  ]);
  this.root2.autoResize = true

  let chart = this.root2.container.children.push( 
    am5percent.PieChart.new(this.root2, {
      layout: this.root2.verticalLayout
    }) 
  );
  
  // Create series
  this.series2 = chart.series.push(
    am5percent.PieSeries.new(this.root2, {
      name: "Series",
      valueField: "values",
      categoryField: "category"
    })
  );
  
  // Add legend
  this.legend2 = chart.children.push(am5.Legend.new(this.root2, {
    centerX: am5.percent(50),
    x: am5.percent(50),
    layout: this.root2.verticalLayout,
    height: am5.percent(40),
    verticalScrollbar: am5.Scrollbar.new(this.root2, {
      orientation: "vertical"
    })
  }));
  
}

getCompanys(){
  let idCliente = sessionStorage.getItem("cliente")
  this.companysServices.get2CompaniesDownload(idCliente).subscribe(
    res=>{
      this.arrayCompany = res
      this.getDownloads1();
      this.getDownloads2();
      
    },err=>{
      console.log(err)
    }
  )
}

getDownloads1(){
  this.descargasServices.getDownloadsDone(this.idCompanySelect1).subscribe(
    res=>{
      this.arrayDescarga1 = res
      console.log(JSON.stringify(res))
      console.log("ID 1: " + this.idDescargaSelect1)
    },err=>{
      console.log(err)
    }
  )
}

getDownloads2(){
 
  this.descargasServices.getDownloadsDone(this.idCompanySelect2).subscribe(
    res=>{
      this.arrayDescarga2 = res
      console.log(JSON.stringify(res))
      console.log("ID 2: " + this.idDescargaSelect2)
    },err=>{
      console.log(err)
    }
  )
}

cambiarSelect1(e:Event){
  this.arrayDescarga1 = []
  this.getDownloads1()
  this.flag = false
  let btnCharts = <HTMLInputElement>document.getElementById("navBtnCharts")
  btnCharts.style.visibility = "hidden"

  let chart1 = <HTMLDivElement>document.getElementById("chartdiv4")
  chart1.style.visibility="hidden"

  let chart2 = <HTMLDivElement>document.getElementById("chartdiv5")
  chart2.style.visibility="hidden"

  this.titleString1 = ""
  this.titleString2 = ""

  this.resetChart()


}


cambiarSelect2(e:Event){
  this.arrayDescarga2 = []
  this.getDownloads2()
  this.flag = false
  let btnCharts = <HTMLInputElement>document.getElementById("navBtnCharts")
  btnCharts.style.visibility = "hidden"

  let chart1 = <HTMLDivElement>document.getElementById("chartdiv4")
  chart1.style.visibility="hidden"

  let chart2 = <HTMLDivElement>document.getElementById("chartdiv5")
  chart2.style.visibility="hidden"

  this.titleString1 = ""
  this.titleString2 = ""


  this.resetChart()

  
}


cambiarSelectCompany(){
  this.idDescargaSelect1 = 'default'
  this.arrayDescarga1 = []
  this.getDownloads1()
  this.titleString1 = ""
  this.titleString2 = ""
  this.flag = false
  let chart1 = <HTMLDivElement>document.getElementById("chartdiv4")
  chart1.style.visibility="hidden"

  let chart2 = <HTMLDivElement>document.getElementById("chartdiv5")
  chart2.style.visibility="hidden"

  let btnCharts = <HTMLInputElement>document.getElementById("navBtnCharts")
  btnCharts.style.visibility = "hidden"

  this.resetChart()
}

cambiarSelectCompany2(){
  this.idDescargaSelect2 = 'default'
  this.arrayDescarga2 = []
  this.getDownloads2()
  this.titleString1 = ""
  this.titleString2 = ""
  this.flag = false

  let chart1 = <HTMLDivElement>document.getElementById("chartdiv4")
  chart1.style.visibility="hidden"

  let chart2 = <HTMLDivElement>document.getElementById("chartdiv5")
  chart2.style.visibility="hidden"

  let btnCharts = <HTMLInputElement>document.getElementById("navBtnCharts")
  btnCharts.style.visibility = "hidden"

  this.resetChart()
}



colapsar(){
  let chart1 = <HTMLDivElement>document.getElementById("chartdiv4")
  let chart2 = <HTMLDivElement>document.getElementById("chartdiv5")
  // chartdiv
  let divChart = <HTMLCanvasElement><unknown>document.getElementById("divChart")
  let canvas = <HTMLCanvasElement><unknown>document.querySelectorAll("canvas")
  let collapsedLink = <HTMLDivElement>document.getElementById("collapsedLink")
 
  let rowChart = <HTMLDivElement>document.getElementById("rowChart")

  setTimeout(() => {
    if(collapsedLink.classList.contains("collapsed")){
    
      
      // chart.style.height = "100%"
      setTimeout(() => {
        divChart.style.height = "90%"
        canvas[0].style.height = "100%"
        canvas[1].style.height = "100%"
        canvas[2].style.height = "100%"
        canvas[3].style.height = "100%"
        // this.root.resize()
      }, 100);
    }
    else{
      
      // chart.style.height = "100%"
      
      setTimeout(() => {
        divChart.style.height = "50%"
        rowChart.style.height = "90%"
        chart1.style.height = "95%"
        chart2.style.height = "95%"
        canvas[0].style.height = "80%"
        canvas[1].style.height = "80%"
        canvas[2].style.height = "80%"
        canvas[3].style.height = "80%"
        // this.root.resize()
      }, 50);
      
      
    }
  }, 1);
  
}

validacion(){
  this.resetChart()
 
  if(this.fecha_desde != null && this.fecha_hasta != null && this.idCompanySelect1!=null && this.idCompanySelect2!=null && this.idDescargaSelect1!=null && this.idDescargaSelect2!=null){
    
    // alert("entra aqui")
    if(this.fecha_desde<=this.fecha_hasta){
      if(this.idDescargaSelect1!="default" && this.idDescargaSelect2!="default"){
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
  this.data1 = []
  this.data2 = []
  this.series1.data.setAll(this.data1);
  this.series2.data.setAll(this.data2);
  this.legend1.data.setAll(this.series1.dataItems);
  this.legend2.data.setAll(this.series2.dataItems);
}

getInstitutionReactionsUsers(){

  this.demographicService.getInstitutionReactionsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getInstitutionReactionsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res;
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}
 
getProfessionReactionsUsers(){
  this.demographicService.getProfessionReactionsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getProfessionReactionsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}
getCountryReactionsUsers(){
  this.demographicService.getCountryReactionsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getCountryReactionsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}

getLocationReactionsUsers(){
  this.demographicService.getLocationReactionsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getLocationReactionsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}

getCompanyReactionsUsers(){
  this.demographicService.getCompanyReactionsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getCompanyReactionsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}

getJobReactionsUsers(){
  this.demographicService.getJobReactionsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getJobReactionsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}

getInstitutionCommentsUsers(){
  this.demographicService.getInstitutionCommentsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getInstitutionCommentsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}
getProfessionCommentsUsers(){
  this.demographicService.getProfessionCommentsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getProfessionCommentsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}
getCountryCommentsUsers(){
  this.demographicService.getCountryCommentsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getCountryCommentsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}
getLocationCommentsUsers(){
  this.demographicService.getLocationCommentsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);

    }
  )
  this.demographicService.getLocationCommentsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}

getCompanyCommentsUsers(){
  this.demographicService.getCompanyCommentsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getCompanyCommentsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}

getJobCommentsUsers(){
  this.demographicService.getJobCommentsUsers(this.idDescargaSelect1, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data1 = res
      this.data1 = this.data1.sort((a,b)=>b.values-a.values)
      this.data1 = this.data1.slice(0,30)
      console.log("ID 1: " + this.idDescargaSelect1)
      this.series1.data.setAll(this.data1);
      this.legend1.data.setAll(this.series1.dataItems);
    }
  )
  this.demographicService.getJobCommentsUsers(this.idDescargaSelect2, this.fecha_desde, this.fecha_hasta).subscribe(
    res=>{
      console.log(JSON.stringify(res))
      this.data2 = res
      this.data2 = this.data2.sort((a,b)=>b.values-a.values)
      this.data2 = this.data2.slice(0,30)
      console.log("ID 2: " + this.idDescargaSelect2)
      this.series2.data.setAll(this.data2);
      this.legend2.data.setAll(this.series2.dataItems);
    }
  )
}


changeOption(num:number){
  


  let chart1 = <HTMLDivElement>document.getElementById("chartdiv4")
  chart1.style.visibility="visible"
  
  let chart2 = <HTMLDivElement>document.getElementById("chartdiv5")
  chart2.style.visibility="visible"

  
  let titleString1 = this.arrayCompany.find((e)=> e.id_company == this.idCompanySelect1).name_company
  let titleString2 = this.arrayCompany.find((e)=> e.id_company == this.idCompanySelect2).name_company
  

  switch(num){

    case 1:
      this.titleString1 = "REACCIONES - INSTITUCIONES - "+titleString1
      this.titleString2 = "REACCIONES - INSTITUCIONES - "+titleString2
      this.getInstitutionReactionsUsers();
      break;
    case 2:
      this.titleString1 = "REACCIONES - PROFESIONES - "+titleString1
      this.titleString2 = "REACCIONES - PROFESIONES - "+titleString2
      this.getProfessionReactionsUsers();
      break;
    case 3:
      this.titleString1 = "REACCIONES - PAÍSES - "+titleString1
      this.titleString2 = "REACCIONES - PAÍSES - "+titleString2
      this.getCountryReactionsUsers();
      break;
    case 4:
      this.titleString1 = "REACCIONES - UBICACIONES - "+titleString1
      this.titleString2 = "REACCIONES - UBICACIONES - "+titleString2
      this.getLocationReactionsUsers();
      break;
    case 5:
      this.titleString1 = "REACCIONES - COMPAÑIAS - "+titleString1
      this.titleString2 = "REACCIONES - COMPAÑIAS - "+titleString2
      this.getCompanyReactionsUsers();
      break;
    case 6:
      this.titleString1 = "REACCIONES - CARGOS - "+titleString1
      this.titleString2 = "REACCIONES - CARGOS - "+titleString2
      this.getJobReactionsUsers();
      break;
    case 7:
      this.titleString1 = "COMENTARIOS - INSTITUCIONES - "+titleString1
      this.titleString2 = "COMENTARIOS - INSTITUCIONES - "+titleString2
      this.getInstitutionCommentsUsers();
      break;
    case 8:
      this.titleString1 = "COMENTARIOS - PROFESIONES - "+titleString1
      this.titleString2 = "COMENTARIOS - PROFESIONES - "+titleString2
      this.getProfessionCommentsUsers();
      break;
    case 9:
      this.titleString1 = "COMENTARIOS - PAÍSES - "+titleString1
      this.titleString2 = "COMENTARIOS - PAÍSES - "+titleString2
      this.getCountryCommentsUsers();
      break;
    case 10:
      this.titleString1 = "COMENTARIOS - UBICACIONES - "+titleString1
      this.titleString2 = "COMENTARIOS - UBICACIONES - "+titleString2
      this.getLocationCommentsUsers();
      break;
    case 11:
      this.titleString1 = "COMENTARIOS - COMPAÑIAS - "+titleString1
      this.titleString2 = "COMENTARIOS - COMPAÑIAS - "+titleString2
      this.getCompanyCommentsUsers();
      break;
    case 12:
      this.titleString1 = "COMENTARIOS - CARGOS - "+titleString1
      this.titleString2 = "COMENTARIOS - CARGOS - "+titleString2
      this.getJobCommentsUsers();
      break;
    }
  }
}