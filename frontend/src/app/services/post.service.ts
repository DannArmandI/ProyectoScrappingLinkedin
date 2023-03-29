import { Injectable } from '@angular/core';
import { Subject, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Post } from "../interfaces/post";
import { Reaction } from "../interfaces/reaction";
import { Comment } from "../interfaces/comment";
import { Date_ } from "../interfaces/date";
import { Tag } from "../interfaces/tag";
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class PostService {

  // Observable string sources
  public id_companySubject = new Subject<Number>();
  public dateSubject = new Subject<Date_>();

  // Observable string streams
  id_companySubject$ = this.id_companySubject.asObservable();
  dateSubject$ = this.dateSubject.asObservable();

  URL_API = environment.hostname + '/api/posts'

  selectedDate : Date_ = {
    from : new Date,
    to : new Date
  }

  posts : Post[] = []
  posts_aux : Post[] = []
  comparePosts : Object[] = []
  comparePosts2 : Object[]= []
  compareComments : Object[]= []
  compareReactions : Object[]= []
  compareReactionsByTags : Object[] = []
  comparePostsCommentsReactions : Object[]= []
  tags: Tag[] = [];

  selectedPost : Post = {
    id_post: 0,
    idCompany : 0,
    name_company: '',
    description: '',
    url_post: '',
    published_date: new Date(),
    tag: '',
    latest: new Boolean(),
    id_descarga: 0
  }

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get<Post[]>(this.URL_API)
  }

  getIdCompany(id_company: Number) {
    this.id_companySubject.next(id_company);
   // return this.http.get<Post[]>(`${this.URL_API}/${id_company}`)
  }

  getDates(dates: Date_) {
    this.dateSubject.next(dates);
  }
  getPostsDescarga(id_descarga: number){
    return this.http.get<Post[]>(`${this.URL_API}/descarga/${id_descarga}`)
  }


  getCompanyPosts(id_company: Number) {
    return this.http.get<Post[]>(`${this.URL_API}/${id_company}`)
  }

  getCompanyPostsBetweenDates(id_company: Number, dates: Date_) {
    return this.http.post<Post[]>(`${this.URL_API}/${id_company}/query_between_dates`, dates)
  }
  getCompanyPostsBetweenDatesBytag(id_company: Number, dates: Date_){
    return this.http.post<Post[]>(`${this.URL_API}/${id_company}/query_between_dates`, dates)
  }

  getCompanyPostsReactionsBetweenDates(id_company: Number, dates: Date_) {
    return this.http.post<Reaction[]>(`${this.URL_API}/${id_company}/reactions_between_dates`, dates)
  }
  getCompanyPostsReactionsBetweenDatesbyTags(id_company: Number, dates: Date_) {
    return this.http.post<Reaction[]>(`${this.URL_API}/${id_company}/reactions_between_dates/tag`, dates)
  }
  getCompanyPostsCommentsBetweenDates(id_company: Number, dates: Date_) {
    return this.http.post<Comment[]>(`${this.URL_API}/${id_company}/comments_between_dates`, dates)
  }

  getTags() {
    return this.http.get<Tag[]>(`${this.URL_API}/post/category/tags`)
  }

  updatePost(id_post: number, tag: Tag){
    return this.http.put(`${this.URL_API}/post/category/update/${id_post}`, tag)
  }


  clearPosts(){
    this.posts = []
  }
  clearComparePosts(){
    this.comparePosts = []
  }
  clearComparePosts2(){
    this.comparePosts2 = []
  }

  clearCompareComments(){
    this.compareComments = []
  }
  clearCompareReactions(){
    this.compareReactions = []
  }
}
