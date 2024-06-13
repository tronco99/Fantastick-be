import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BonusModel } from './models/BonusModel'

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  getDato(nome: string): Observable<any> {
    return this.http.get<any>(`https://fantastick.adaptable.app/`).pipe(
      tap((data: BonusModel) => {
        console.log('Dati ricevuti:', data.IDLEGA);
      }),
      catchError(error => {
        console.error('Errore durante la richiesta:', error);
        return of(null); // Ritorna un observable con un valore di fallback
      })
    );
  }
}