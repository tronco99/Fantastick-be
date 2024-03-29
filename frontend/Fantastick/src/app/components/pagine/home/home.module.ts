import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElencoLegheComponent } from './elencoLeghe/elencoLeghe';
import { IscrizioneComponent } from './iscrizione/iscrizione';

@NgModule({
  declarations: [
    ElencoLegheComponent,
    IscrizioneComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ElencoLegheComponent,
    IscrizioneComponent
  ]
})
export class HomeModule { }
