import { array } from "@amcharts/amcharts4/core";
import { SubItems } from "./SubItems";

export interface BarraNav{
  id: number,
  name: string,
  icono: string,
  SubItems:Array<SubItems>,
  //priority: number
}
export let arrayItems:Array<BarraNav>=[
  {
    id: 0,
    name: "Clientes",
    icono: "fas fa-fw fa-user-tie",
    SubItems:[{id:1,name:"Listado",Ruta: "Listado"}],

  },
  {
    id: 1,
    name: "Usuarios",
    icono: "fas fa-fw fa-user",
    SubItems:[{id:1,name:"Listado Cuentas",Ruta: "Listado"}],
  },
  {
    id: 2,
    name: "Cuentas",
    icono: "fas fa-fw fa-desktop",
    SubItems:[{id:1,name:"Listado Cuentas",Ruta: "Linkedin"},{id:2,name:"Listado Companies",Ruta: "Companies"}],
  },
  {
    id: 3,
    name: "Planes",
    icono: "fas fa-fw fa-clipboard-list",
    SubItems:[{id:1,name:"Listado",Ruta: "Listado"}]
  },
  {
    id: 4,
    name: "Analisis",
    icono: "fas fa-fw fa-chart-area",
    SubItems:[{id:1,name:"Gráfico Demografico" , Ruta:"Democrafico"},{id:2,name:"Gráfico Sentimientos" , Ruta:"Sentimiento"}
  ,{id:3,name:"Gráfico Áreas de Trabajo" , Ruta:"Jobs"},{id:3,name:"Gráfico Competencias" , Ruta:"Competencias"}]
  },
  // {
  //   id: 5,
  //   name: "Jobs",
  //   icono: "ri-account-pin-circle-fill",
  //   SubItems:[{id:1,name:"Gráfico"}]
  // },
  // {
  //   id: 6,
  //   name: "competencia",
  //   icono: "ri-shopping-cart-fill",
  //   SubItems:[{id:1,name:"Gráfico"}]
  // },
];
