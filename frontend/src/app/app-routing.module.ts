import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './componentes/accounts/accounts.component';
import { DemograficoComponent } from './componentes/analisis/demografico/demografico.component';
import { ClienteTipo2Component } from './componentes/cliente-tipo2/cliente-tipo2.component';
import { CommentsComponent } from './componentes/comments/comments.component';
import { CompetenciaComponent } from './componentes/competencia/competencia.component';
import { DescargasComponent } from './componentes/descargas/descargas.component';
import { ElementosDescargasComponent } from './componentes/elementos-descargas/elementos-descargas.component';
import { ExtractionsComponent } from './componentes/extractions/extractions.component';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { JobsComponent } from './componentes/jobs/jobs.component';
import { PlanesComponent } from './componentes/planes/planes.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { ReactionsComponent } from './componentes/reactions/reactions.component';
import { SentimientosComponent } from './componentes/sentimientos/sentimientos.component';
import { UsersComponent } from './componentes/users/users.component';
import { EditarPassComponent } from './componentes/usuarios/editar-pass/editar-pass.component';
import { UsuariosComponent } from './componentes/usuarios/listar/usuarios.component';
import { VigilanteGuard } from './guard/canActivate/vigilante.guard';
import { VigilanteChildGuard } from './guard/canActivateChild/vigilante-child.guard';

const routes: Routes = [
  {path:"",component:InicioSesionComponent},
  {path:"Panel",component:PrincipalComponent,
    canActivate: [VigilanteGuard],
    canActivateChild: [VigilanteChildGuard],
    children :
    [
      // {path:"users",component:UsuariosComponent},
    ]
  },
  {path:"Panel/Clientes/Listado",component:ClienteTipo2Component, canActivate: [VigilanteGuard]},
  {path:"Panel/Planes/Listado",component:PlanesComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Usuarios/Listado",component:UsuariosComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Cuentas/Linkedin",component:AccountsComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Cuentas/Companies",component:ExtractionsComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Analisis/Democrafico",component:DemograficoComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Analisis/Sentimiento",component:SentimientosComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Analisis/Jobs",component:JobsComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Analisis/Competencias",component:CompetenciaComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Descargas/:id",component:DescargasComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Descargas/Elementos/:id",component:ElementosDescargasComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Descargas/Elementos/user/:id",component:UsersComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Descargas/Elementos/Comments/:id",component:CommentsComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/Descargas/Elementos/Reactions/:id",component:ReactionsComponent, canActivate: [VigilanteGuard]},
  {path:"Panel/change_password",component:EditarPassComponent, canActivate: [VigilanteGuard]},
  // {path:"User",component:PrincipalUserComponent},
  // {path:"user", redirectTo: "/User", pathMatch: "full"},
  {path: '**', pathMatch: 'full', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
