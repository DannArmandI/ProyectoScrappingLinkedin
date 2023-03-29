import { Component, OnInit, ViewChild } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { MatSort, Sort } from '@angular/material/sort';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Date_ } from '../../interfaces/date';
import { MatTableDataSource } from '@angular/material/table';
//csv exports
import * as FileSaver from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from 'src/app/services/user.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Comment } from 'src/app/interfaces/comment';
//import { LiveAnnouncer } from '@angular/cdk/a11y';

//declare module 'file-saver';
//csv exports
//import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  public selectedDate: Date_ = {
    from: new Date(),
    to: new Date(),
  };
  displayedColumns: string[] = [
    'id_comment',
    'name',
    'comment',
    'sentiment',
    'published_date',
    'id_user',
    'acciones'
  ];
  datasource: MatTableDataSource<Comment>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  //@Input() id_post: any
  id: any;
  //public modalService: NgbModal
  constructor(
    public commentService: CommentService,
    public userService: UserService,private _liveAnnouncer: LiveAnnouncer, private ruta:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ruta.params.subscribe(params =>{
      this.getComments((params['id']))
    })
  }

  // getComments(){
  //   this.commentService.getComments().subscribe(
  //     res => {
  //       this.commentService.comments = res
  //     },
  //     err => console.log(err)
  //   )
  // }

  getPostsComments() {
    this.commentService.id_postSubject$.subscribe(
      (res) => {
        this.commentService.getPostsComments(res).subscribe(
          (response) => {
            this.commentService.comments = response;
          },
          (error) => console.log(error)
        );
      },
      (err) => console.log(err)
    );
  }

  getPostCommentsBetweenDates() {
    this.commentService.id_postSubject$.subscribe(
      (res) => {
        this.commentService.getPostCommentsBetweenDates(res).subscribe(
          (response) => {
            console.log(response);
            this.commentService.comments = response;
          },
          (error) => console.log(error)
        );
      },
      (err) => console.log(err)
    );
  }

  sendUrl_user(url_user: any) {
    this.userService.getUrl_user(url_user);
  }

  getCompanyComments() {
    this.commentService.id_companySubject$.subscribe(
      (res) => {
        this.commentService.getCompanyComments(res).subscribe(
          (response) => {
            this.commentService.companyComments = response;
          },
          (error) => console.log(error)
        );
      },
      (err) => console.log(err)
    );
  }

  getComments(id: any): void {
    this.commentService.getPostsComments(id).subscribe(
      (res) => {

        this.datasource=new MatTableDataSource(res);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      },
      (err) => console.log(err)
    );
  }

  // sendIdPostReaction(_id: Number){
  //   this.reactionService.clearCompanyReactions()
  //   this.reactionService.getIdPost(_id)
  //   this.reactionService.getPostsReactions(_id).subscribe(
  //     res=>{
  //       this.reactionService.reactions = res
  //     },
  //     err => console.log(err)
  //   )
  // }

  // sendIdPostComment(_id: Number) {
  //   this.commentService.clearComments();
  //   this.commentService.getIdPost(_id);
  // }

  // getCompanyPosts(){
  //   this.postService.id_companySubject$.subscribe(
  //     res=>{
  //       this.postService.getCompanyPosts(res).subscribe(
  //         response => {
  //           this.postService.posts = response
  //         },
  //         error=> console.log(error)
  //       )
  //     },
  //     err => console.log(err)
  //   )
  // }

  // getTags(){
  //   this.postService.getTags().subscribe(
  //     res=>{
  //       this.postService.tags = res
  //     },
  //     err=>{
  //       console.log(err)
  //     }
  //   )
  // }
  //this.modalService.open(content, { centered: true, scrollable: true })
  // openVerticallyCentered(content: any, post: any) {
  //   this.getTags()
  //   this.postService.selectedPost = post
  //  ;
  // }

  // save(id_tag: any, tag: any){
  //   let Tag_ : Tag = {
  //     id_tag: id_tag,
  //     tag: tag
  //   }
  //   this.updatePost(this.postService.selectedPost.id_post,Tag_)
  // }
  // updatePost(id_post: number, tag: Tag){
  //   this.postService.updatePost(this.postService.selectedPost.id_post,tag).subscribe(
  //     res=>{
  //       console.log(res)
  //       this.getCompanyPostsBetweenDates(this.postService.selectedPost.idCompany, this.postService.selectedDate)
  //     },
  //     err=>{
  //       console.log(err)
  //     }
  //   )
  // }

  // getCompanyPostsBetweenDates(id_company: number, dates: Date_){
  //   this.postService.getCompanyPostsBetweenDates(id_company, dates).subscribe(
  //     res=>{
  //       this.postService.posts = res
  //     },
  //     err =>{
  //       console.log(err)
  //     }
  //   )
  // }

  // downloadReaction(){
  //   this.downloadFile(this.reactionService.reactionsBetweenDates, 'reactions')
  // }

  // downloadComments() {
  //   this.downloadFile(this.commentService.commentsBetweenDates, 'comments');
  // }

  // downloadFile(data: any, filename: string) {
  //   const replacer = (key: any, value: null) => (value === null ? '' : value);
  //   const header = Object.keys(data[0]);
  //   let csv = data.map((row: { [x: string]: any }) =>
  //     header
  //       .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //       .join(',')
  //   );
  //   csv.unshift(header.join(','));
  //   let csvArray = csv.join('\r\n');
  //   var blob = new Blob([csvArray], { type: 'text/csv' });
  //   FileSaver.saveAs(blob, filename + '.csv');
  // }
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
