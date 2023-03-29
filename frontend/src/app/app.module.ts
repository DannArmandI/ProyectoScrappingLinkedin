import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './componentes/./inicio-sesion/inicio-sesion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { AccountsComponent } from './componentes/accounts/accounts.component';
import { ExtractionsComponent } from './componentes/extractions/extractions.component';
import { UsersComponent } from './componentes/users/users.component';
import { CommentsComponent } from './componentes/comments/comments.component';
//import { app_routing } from "./app.routes";
import { ScrollingModule } from "@angular/cdk/scrolling";
//import { CompaniesComponent } from './componentes/companies/companies.component';
import { FollowersComponent } from './componentes/followers/followers.component';
import { ReactionsComponent } from './componentes/reactions/reactions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { PlanesComponent } from './componentes/planes/planes.component';
//import {NgxWebstorageModule} from 'ngx-webstorage';
import { PrincipalUserComponent } from './componentes/principal-user/principal-user.component';
import { ClienteTipo2Component } from './componentes/cliente-tipo2/cliente-tipo2.component';
import { UsuariosComponent } from './componentes/usuarios/listar/usuarios.component';
//import { CompaniesComponent } from './componentes/companies/companies.component';
//import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { VigilanteGuard } from './guard/canActivate/vigilante.guard';
import { VigilanteChildGuard } from './guard/canActivateChild/vigilante-child.guard';
import { DdMmYYYYDatePipe } from './dd-mm-yyyy-date.pipe';
import { DemograficoComponent } from './componentes/analisis/demografico/demografico.component';
import { SentimientosComponent } from './componentes/sentimientos/sentimientos.component';
import { GraficosComponent } from './componentes/graficos/graficos.component';
import { JobsComponent } from './componentes/jobs/jobs.component';
import { CompetenciaComponent } from './componentes/competencia/competencia.component';
import { DescargasComponent } from './componentes/descargas/descargas.component';
import { EditarPassComponent } from './componentes/usuarios/editar-pass/editar-pass.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ElementosDescargasComponent } from './componentes/elementos-descargas/elementos-descargas.component';
//import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    PrincipalComponent,
    AccountsComponent,
    ExtractionsComponent,
    UsersComponent,
    CommentsComponent,
    FollowersComponent,
    ReactionsComponent,
    PlanesComponent,
    ClienteTipo2Component,
    PrincipalUserComponent,
    ClienteTipo2Component,
    UsuariosComponent,
    DdMmYYYYDatePipe,
    DemograficoComponent,
    SentimientosComponent,
    GraficosComponent,
    JobsComponent,
    CompetenciaComponent,
    DescargasComponent,
    EditarPassComponent,
    ElementosDescargasComponent,

  ],
  imports: [
    //NgxWebstorageModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    //NgModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ScrollingModule,
    //app_routing,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    //FlexLayoutModule
    MatInputModule
  ],
  providers: [VigilanteGuard, VigilanteChildGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
