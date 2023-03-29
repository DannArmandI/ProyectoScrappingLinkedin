import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { descarga } from 'src/app/interfaces/descarga';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/interfaces/post';


@Component({
  selector: 'app-elementos-descargas',
  templateUrl: './elementos-descargas.component.html',
  styleUrls: ['./elementos-descargas.component.scss']
})
export class ElementosDescargasComponent implements OnInit {

  //Jesus:any;
  datasource: MatTableDataSource<Post>
  displayedColumns: string[] = ["id_post"	,"name_company"	,"description", "url_post",	"published_date", "acciones"];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  constructor(private _liveAnnouncer: LiveAnnouncer, private ruta:ActivatedRoute, private postService: PostService) {

   }

  ngOnInit(): void {
    this.ruta.params.subscribe(params =>{

      this.postService.getPostsDescarga(params['id']).subscribe(res=>{

        //console.log(res);
        this.datasource = new MatTableDataSource(res);
        //console.log(new MatTableDataSource(res));
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      })

    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();

    if (this.datasource.paginator) {
      this.datasource.paginator.firstPage();
    }
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

}
