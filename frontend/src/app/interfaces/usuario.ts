import { array } from "@amcharts/amcharts4/core";

export interface  usuario{
  id_usuario : number,
  nombre_usuario : string,
  correo_electronico : string,
  rut_usuario : string,
  dni : string,
  id_cliente : string,
  password_MD5 : string,
  id_rol : number
  estado: string
}
export let usuarioXd:Array<usuario>=[];
