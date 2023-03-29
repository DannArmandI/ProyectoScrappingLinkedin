import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactionService } from "../../services/reactions.service";
import { MatSort, Sort } from '@angular/material/sort';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Date_ } from '../../interfaces/date';
import { MatTableDataSource } from '@angular/material/table';
//csv exports
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from 'src/app/services/user.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// amCharts imports
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

//csv exports
import * as FileSaver from 'file-saver';
import { Reaction } from 'src/app/interfaces/reaction';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.scss']
})
export class ReactionsComponent implements OnInit {
  datasource: MatTableDataSource<Reaction>;
  displayedColumns: string[] = [
    'id_reaction',
    'name',
    'reaction',
    'acciones'
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  //@Input() id_post: any
  id: any;
  constructor(public reactionService: ReactionService , private _liveAnnouncer: LiveAnnouncer, private ruta:ActivatedRoute) { }

  ngOnInit(): void {
    this.ruta.params.subscribe(params =>{
      this.getReactions((params['id']))
    })
  }

  getReactions(id:any){
    this.reactionService.getPostsReactions(id).subscribe(
      res => {
        console.log(res);
        this.datasource = new MatTableDataSource(res);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      },
      err => console.log(err)
    )
  }

  downloadReactionsCsv(){
    this.getCompanyReactions_csv(this.reactionService.companyReactions);
  }

  getCompanyReactions_csv(data: any){
      const replacer = (key:any, value:any) => value === null ? '' : value; // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      let csv = data.map((row: { [x: string]: any; })=> header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');

      var blob = new Blob([csvArray], {type: 'text/csv' })
      FileSaver.saveAs(blob, "reactions.csv");
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();

    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}

