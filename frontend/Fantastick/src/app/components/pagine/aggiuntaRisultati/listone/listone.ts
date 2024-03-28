import { Component } from '@angular/core';

@Component({
  selector: 'listone',
  standalone: true,
  templateUrl: './listone.html',
  styleUrls: ['./listone.css']
})
export class ListoneComponent {
  title = 'Listone!';

  constructor() { }
}