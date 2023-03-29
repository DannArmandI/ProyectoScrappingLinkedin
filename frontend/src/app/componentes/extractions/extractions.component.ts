import { Component, OnInit, ViewChild } from '@angular/core';
import { Extraction } from "../../interfaces/extraction";
import { ExtractionService } from "../../services/extraction.service"
import { NgForm } from "@angular/forms";
import { DatePipe, formatCurrency, NumberFormatStyle } from '@angular/common';
import { exit } from 'process';
import { CompanyService } from 'src/app/services/company.service';
import { array, Label, number, NumberFormatter } from '@amcharts/amcharts4/core';
import { Company } from 'src/app/interfaces/company';
import { DownloadService } from 'src/app/services/download.service';
import { descarga } from 'src/app/interfaces/descarga';
import { toNumber } from '@amcharts/amcharts4/.internal/core/utils/Type';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
@Component({
  selector: 'app-extractions',
  templateUrl: './extractions.component.html',
  styleUrls: ['./extractions.component.scss']
})
export class ExtractionsComponent implements OnInit {

  //showMe: boolean;
  public selectedExtraction : Extraction = {
    user_name: '',
    creation_date: new Date,
    url:''
  }
  num=0;
  listaCompanies:Array<Company>;
  listaDownloads:Array<descarga>;
  id_company:any;
  Aux:Company={
    url_Company:'',
    name_company:'',
    date:null,
    Estado:1,
    followers: null,
    id_company: null,
    cliente:sessionStorage.getItem("cliente")
  };
  Aux2:descarga={
    id_descarga: null,
    Fecha_Des: null,
    Fecha_Has: null,
    Estado:1,
    Fecha_Cre:null,
    Fecha_Act:null,
    id_Company:null,
    Running:0
  }
  label1="Fecha Desde";
  label2="Fecha Hasta";
  title = '';
  company:any;
  datasource: MatTableDataSource<Company>
  displayedColumns: string[] = ["name_company","followers","url_Company","date","Estado","acciones"];


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  constructor(public extractionService: ExtractionService , public companyService :CompanyService , public downloadsService:DownloadService,
    private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.getCompanies()
  }
  getCompanies(){
    console.log("asdasd"+sessionStorage.getItem("cliente"));
    this.companyService.get2Companies(sessionStorage.getItem("cliente")).subscribe(
      res=>{
        this.listaCompanies = res;
        console.log(this.listaCompanies);

        this.datasource = new MatTableDataSource(this.listaCompanies);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      },
      err=>{console.log(err)}
    )
  }
  addExtraction(form: NgForm ){
    var now = new Date();
    var jsonDate = now.toJSON();
    var then = new Date(jsonDate);
    var agregar:Company;
    if(form.value.user_name == null || form.value.user_name == '' || (form.value.isAdmin  && (form.value.company_number.value == '' || form.value.company_number.value == null ))){
      //console.log(form.value.isAdmin.value+" asdasd "+form.value.company_number.value)
      //form.reset()
      //console.log("Asdasdasdasd")
      alert("Company number Vacio , porfavor completar")
      return 0
    }
    if(form.value.user_name == null || form.value.url == null){
      alert('xD');
    }else{
      console.log(form.value.user_name+" "+form.value.url);
      agregar = {
      id_company:null,
      name_company: this.replaceSpaces(form.value.user_name),
      date: then,
      url_Company: form.value.url,
      Estado:1,
      followers:null,
      cliente:sessionStorage.getItem("cliente")
      }
    }
    // if(form.value.company_number){
    //   if(!this.onlyNumbers(form.value.company_number)){
    //     form.reset()
    //     alert("Error")
    //     return 0
    //   }
    // }
    // if(form.value.isAdmin){
    //   this.extractionService.selectedExtraction = {
    //     user_name: this.replaceSpaces(form.value.user_name),
    //     creation_date: then,
    //     isAdmin: true,
    //     company_number: form.value.company_number,
    //     priority: (this.extractionService.extractions.length+1)
    //   }
    // }else{
    //   this.extractionService.selectedExtraction = {
    //     user_name: this.replaceSpaces(form.value.user_name),
    //     creation_date: then,
    //     isAdmin: false,
    //     company_number: '',
    //     priority: (this.extractionService.extractions.length+1)
    //   }
    // }
    if(this.id_company){
    //   this.extractionService.selectedExtraction = {
    //     id_extraction: form.value.id_extraction,
    //     user_name: this.replaceSpaces(form.value.user_name),
    //     creation_date: then,
    //     isAdmin: false,
    //     company_number: '',
    //     priority: (this.extractionService.extractions.length+1)
    //   }
      this.companyService.EditarCompany(agregar,this.id_company).subscribe(
        res=>{
          form.reset()
          this.getCompanies();
          console.log(res)
          this.num=0
          this.id_company=null;
        },
        err =>console.log(err+"XDDDDDDDDDDDDDDDDDDDDD")
      )
    }else{
      this.companyService.AgregarCompany(agregar).subscribe(
        res=> {
          alert("compañia linkedin agregada con exito!")
          form.reset();
          this.getCompanies();
          console.log(res);
          this.num=0
          this.id_company=null;
        },
        err =>console.log(err+"DDDDDDDDDDXXXXXXXX")
      );
    }
    return 0;
  }
  deleteExtraction(id_extraction: any){
    // if(confirm('Are u sure you want delete it?')){
      this.companyService.EliminarCompany(id_extraction).subscribe(
        res=> {
          console.log(res)
          this.getCompanies();
        },
        err => console.log(err)
      )
    // }
  }
  activateExtraction(id_extraction: any){
    this.companyService.ActivarCompany(id_extraction).subscribe(
      res=> {
        console.log(res)
        this.getCompanies();
      },
      err => console.log(err)
    )
  }


  deleteDescarga(id_descarga: any){

    // if(confirm('Are u sure you want delete it?')){
      this.downloadsService.deleteDownloads(id_descarga).subscribe(
        res=> {
          console.log(res)
          this.getDescargas(sessionStorage.getItem("company"));
        },
        err => console.log(err)
      )
    // }
  }

  activateDescarga(id_descarga: any){


    this.downloadsService.ActivateDownloads(id_descarga).subscribe(
      res=> {
        console.log(res)
        this.getDescargas(sessionStorage.getItem("company"));
      },
      err => console.log(err)
    )

  }

  editExtraction(extraction: any){
    this.id_company = extraction.id_company;
    this.Aux.name_company=extraction.name_company;
    this.Aux.url_Company=extraction.url_Company;
  }
  resertForm(form: NgForm){
    form.reset()
  }
  onlyNumbers(company_number: string){
    for(let i = 0; i < company_number.length; i++){
      if('1234567890'.indexOf((company_number[i]))== -1 ){
        return false
      }
    }
    return true
  }
  replaceSpaces(user_name: string){
    var str = user_name.replace(/ /gi, "-");
    return str;
  }
  getDescargas(id:any){
    this.downloadsService.getDownloads(id).subscribe(
      res=> {
        console.log(res)
        this.listaDownloads=res;
      },
      err => console.log(err)
    )
  }
  ListaDescarga(id_Company:any){
    this.num=1;
    //this.company=id_Company;
    sessionStorage.setItem("company",id_Company);
    this.getDescargas(sessionStorage.getItem("company"));
  }
  // editDownload(download:descarga){
  //   this.label1="Ingrese nueva Fecha Desde"
  //   this.label2="Ingrese nueva Fecha Hasta"
  //   this.Aux2.id_descarga=download.id_descarga;
  // }
  AddDescarga(form:NgForm){
    this.Aux2.Fecha_Des=form.value.FechaDes;
    this.Aux2.Fecha_Has=form.value.FechaHas;
    this.Aux2.id_Company=toNumber(sessionStorage.getItem("company"));
    if (this.Aux2.id_descarga){
      this.num=0;
      console.log("Actualizando")
      this.downloadsService.UpdateDownloads(this.Aux2).subscribe(
        res=> {
          console.log(res)
          this.getDescargas(sessionStorage.getItem("company"));
          this.label1="Fecha Desde";
          this.label2="Fecha Hasta";
          this.Aux2.id_descarga=null;
          this.resertForm(form)

        },
        err => console.log(err)
      )
    }else{
      console.log("agregando",this.Aux2)
      this.num=0;
      this.downloadsService.AddDownloads(this.Aux2).subscribe(
        res=> {
          console.log(res)
          this.getDescargas(sessionStorage.getItem("company"));
          this.label1="Fecha Desde";
          this.label2="Fecha Hasta";
          this.resertForm(form)
        },
        err => console.log(err)
      )
    }
  }
  updatePriority(){
    let i = 1
    for (let e of this.extractionService.extractions){
      // e.priority = i
      this.extractionService.updateExtraction(e).subscribe(
        res=>{
          console.log(res)
        },
        err =>console.log(err)
      )
      i++
    }
    // this.getExtractions()
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
  // increasePriority(extraction: Extraction){

  //   this.extractionService.selectedExtractionPriority1 = extraction
  //   this.extractionService.selectedExtractionPriority1.priority = this.extractionService.selectedExtractionPriority1.priority-1

  //   let current_i = this.extractionService.extractions.indexOf(extraction)

  //   this.extractionService.selectedExtractionPriority2 = this.extractionService.extractions[current_i-1]
  //   this.extractionService.selectedExtractionPriority2.priority = this.extractionService.selectedExtractionPriority2.priority+1

  //   this.extractionService.updateExtraction(this.extractionService.selectedExtractionPriority1).subscribe(
  //     res=>{
  //       console.log(res)
  //     },
  //     err =>console.log(err)
  //   )
  //   this.extractionService.updateExtraction(this.extractionService.selectedExtractionPriority2).subscribe(
  //     res=>{
  //       this.getExtractions()
  //       console.log(res)
  //     },
  //     err =>console.log(err)
  //   )
  // }

  // decreasePriority(extraction: Extraction){
  //   this.extractionService.selectedExtractionPriority1 = extraction
  //   this.extractionService.selectedExtractionPriority1.priority = this.extractionService.selectedExtractionPriority1.priority+1

  //   let current_i = this.extractionService.extractions.indexOf(extraction)

  //   this.extractionService.selectedExtractionPriority2 = this.extractionService.extractions[current_i+1]
  //   this.extractionService.selectedExtractionPriority2.priority = this.extractionService.selectedExtractionPriority2.priority-1

  //   this.extractionService.updateExtraction(this.extractionService.selectedExtractionPriority1).subscribe(
  //     res=>{
  //       console.log(res)
  //     },
  //     err =>console.log(err)
  //   )
  //   this.extractionService.updateExtraction(this.extractionService.selectedExtractionPriority2).subscribe(
  //     res=>{
  //       console.log(res)
  //     },
  //     err =>console.log(err)
  //   )

  //   this.getExtractions()
  // }
}
