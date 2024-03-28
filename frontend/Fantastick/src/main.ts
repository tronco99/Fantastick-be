import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomeComponent } from './app/components/pagine/home/home';
import { ElencoLegheComponent } from './app/components/pagine/elencoLeghe/elencoLeghe';

bootstrapApplication(HomeComponent, appConfig)
  .catch((err) => console.error(err));
