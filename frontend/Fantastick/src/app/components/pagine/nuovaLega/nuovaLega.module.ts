import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InserimentoDatiComponent } from './inserimentoDati/inserimentoDati';
import { RegolamentoComponent } from './regolamento/regolamento';
import { ScelteComponent } from './scelte/scelte';

@NgModule({
  declarations: [
    InserimentoDatiComponent,
    RegolamentoComponent,
    ScelteComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InserimentoDatiComponent,
    RegolamentoComponent,
    ScelteComponent
  ]
})
export class NuovaLegaModule { }
