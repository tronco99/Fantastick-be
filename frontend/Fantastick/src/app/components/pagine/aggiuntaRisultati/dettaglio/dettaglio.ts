import { Component } from '@angular/core';

@Component({
  selector: 'dettaglio',
  standalone: true,
  templateUrl: './dettaglio.html',
  styleUrls: ['./dettaglio.css']
})
export class DettaglioComponent {
  title = 'Dettaglio!';

  constructor() { }
}