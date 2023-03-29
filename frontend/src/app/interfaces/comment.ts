export interface Comment{
    id_comment: number,
    idPost: number,
    comment: string,
    sentiment:string;
    published_date: Date,
    id_user: string,
    name:string
}
