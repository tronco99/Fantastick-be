import { Routes } from '@angular/router';
import { HomeComponent } from './components/pagine/home/home';
import { DettaglioComponent } from './components/pagine/aggiuntaRisultati/dettaglio/dettaglio';
import { ListoneComponent } from './components/pagine/aggiuntaRisultati/listone/listone';
import { ElencoLegheComponent } from './components/pagine/elencoLeghe/elencoLeghe';
import { InserimentoDati } from './components/pagine/nuovaLega/inserimentoDati/inserimentoDati';
import { Regolamento } from './components/pagine/nuovaLega/regolamento/regolamento';
import { Scelte } from './components/pagine/nuovaLega/scelte/scelte';
import { Calendario } from './components/pagine/riepilogoLega/calendario/calendario';
import { Classifica } from './components/pagine/riepilogoLega/classifica/classifica';
import { Profilo } from './components/pagine/riepilogoLega/profilo/profilo';
import { Punteggi } from './components/pagine/riepilogoLega/punteggi/punteggi';

 export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dettaglio', component: DettaglioComponent },
  { path: 'listone', component: ListoneComponent },
  { path: 'elencoLeghe', component: ElencoLegheComponent },
  { path: 'inserimentoDati', component: InserimentoDati },
  { path: 'regolamento', component: Regolamento },
  { path: 'scelte', component: Scelte },
  { path: 'calendario', component: Calendario },
  { path: 'classifica', component: Classifica },
  { path: 'profilo', component: Profilo },
  { path: 'punteggi', component: Punteggi },
  // altre rotte...
];

