import { Component } from '@angular/core';

@Component({
  selector: 'profilo',
  standalone: true,
  templateUrl: './profilo.html',
  styleUrls: ['./profilo.css']
})
export class Profilo {
  title = 'Profilo!';

  constructor() { }
}