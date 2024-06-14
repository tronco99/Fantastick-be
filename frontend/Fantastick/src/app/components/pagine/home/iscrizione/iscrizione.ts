import { Component, OnInit } from '@angular/core';
import { DataService } from './../../../../service/DataService';

@Component({
  selector: 'iscrizione',
  templateUrl: './iscrizione.html',
  styleUrls: ['./iscrizione.css']
})
export class IscrizioneComponent implements OnInit {
  constructor(private dataService: DataService) { }
  dato: any;
  title = 'Iscrizione!';

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData(): void {
    /*this.dataService.getBonus('MARCO').subscribe({
      next: (response: string) => {
        this.dato = response;
        console.log('Dato ottenuto:', this.dato);
      },
      error: (error) => {
        console.error('Errore durante il recupero del dato:', error);
      }
    });*/
  }
}