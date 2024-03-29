import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module'; 
import { AppComponent } from './app.component';
import { ButtonNavigazioni } from './app/components/elementi/buttonNavigazioni/buttonNavigazioni';
import { AggiuntaRisultatiModule } from './app/components/pagine/aggiuntaRisultati/aggiuntaRisultati.module';
import { HomeModule } from './app/components/pagine/home/home.module';
import { NuovaLegaModule } from './app/components/pagine/nuovaLega/nuovaLega.module';
import { RiepilogoLegaModule } from './app/components/pagine/riepilogoLega/riepilogoLega.module';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './app/service/DataService';


@NgModule({
  declarations: [
    AppComponent,
    ButtonNavigazioni //todo da rimuovere
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AggiuntaRisultatiModule,
    HomeModule,
    NuovaLegaModule,
    RiepilogoLegaModule,
  ], 
  providers: [DataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
