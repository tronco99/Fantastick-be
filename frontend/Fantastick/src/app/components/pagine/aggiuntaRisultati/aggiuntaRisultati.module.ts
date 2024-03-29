import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DettaglioComponent } from './dettaglio/dettaglio';
import { ListoneComponent } from './listone/listone';

@NgModule({
  declarations: [
    DettaglioComponent,
    ListoneComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DettaglioComponent,
    ListoneComponent
  ]
})
export class AggiuntaRisultatiModule { }
