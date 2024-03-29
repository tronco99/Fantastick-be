import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioComponent } from './calendario/calendario';
import { ClassificaComponent } from './classifica/classifica';
import { ProfiloComponent } from './profilo/profilo';
import { PunteggiComponent } from './punteggi/punteggi';

@NgModule({
  declarations: [
    CalendarioComponent,
    ClassificaComponent,
    ProfiloComponent,
    PunteggiComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CalendarioComponent,
    ClassificaComponent,
    ProfiloComponent,
    PunteggiComponent
  ]
})
export class RiepilogoLegaModule { }
