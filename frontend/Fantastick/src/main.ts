import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module'; 

enableProdMode();

// Avvia l'applicazione Angular sulla piattaforma del browser
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
