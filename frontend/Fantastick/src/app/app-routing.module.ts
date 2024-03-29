import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IscrizioneComponent } from './components/pagine/home/iscrizione/iscrizione';
import { DettaglioComponent } from './components/pagine/aggiuntaRisultati/dettaglio/dettaglio';
import { ListoneComponent } from './components/pagine/aggiuntaRisultati/listone/listone';
import { ElencoLegheComponent } from './components/pagine/home/elencoLeghe/elencoLeghe';
import { InserimentoDatiComponent } from './components/pagine/nuovaLega/inserimentoDati/inserimentoDati';
import { RegolamentoComponent } from './components/pagine/nuovaLega/regolamento/regolamento';
import { ScelteComponent } from './components/pagine/nuovaLega/scelte/scelte';
import { CalendarioComponent } from './components/pagine/riepilogoLega/calendario/calendario';
import { ClassificaComponent } from './components/pagine/riepilogoLega/classifica/classifica';
import { ProfiloComponent } from './components/pagine/riepilogoLega/profilo/profilo';
import { PunteggiComponent } from './components/pagine/riepilogoLega/punteggi/punteggi';

 export const routes: Routes = [
  { path: '', redirectTo: '/iscrizione', pathMatch: 'full' },
  { path: 'iscrizione', component: IscrizioneComponent },
  { path: 'dettaglio', component: DettaglioComponent },
  { path: 'listone', component: ListoneComponent },
  { path: 'elencoLeghe', component: ElencoLegheComponent },
  { path: 'inserimentoDati', component: InserimentoDatiComponent },
  { path: 'regolamento', component: RegolamentoComponent },
  { path: 'scelte', component: ScelteComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'classifica', component: ClassificaComponent },
  { path: 'profilo', component: ProfiloComponent },
  { path: 'punteggi', component: PunteggiComponent },
  // altre rotte...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
