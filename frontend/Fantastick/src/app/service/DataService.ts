import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BonusModel } from './models/BonusModel'
import { CategorieModel } from './models/CategorieModel'
import { GiocatoreModel } from './models/GiocatoreModel'
import { LegaModel } from './models/LegaModel'
import { SquadraModel } from './models/SquadraModel'
import { UserModel } from './models/UserModel'

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  getBonus(id: string): Observable<any> {
    return this.http.get<any>(`https://fantastick.adaptable.app/bonus/${id}`).pipe(
      tap((data: BonusModel) => {
        console.log('Dati ricevuti:', data.CDESCRIZIONE);
      }),
      catchError(error => {
        console.error('Errore durante la richiesta:', error);
        return of(null);
      })
    );
  }

  getCategorie(id: string): Observable<any> {
    return this.http.get<any>(`https://fantastick.adaptable.app/categorie/${id}`).pipe(
      tap((data: CategorieModel) => {
        console.log('Dati ricevuti:', data.CDESCRIZIONE);
      }),
      catchError(error => {
        console.error('Errore durante la richiesta:', error);
        return of(null);
      })
    );
  }

  getGiocatore(id: string): Observable<any> {
    return this.http.get<any>(`https://fantastick.adaptable.app/giocatore/${id}`).pipe(
      tap((data: GiocatoreModel) => {
        console.log('Dati ricevuti:', data.CNOME);
      }),
      catchError(error => {
        console.error('Errore durante la richiesta:', error);
        return of(null);
      })
    );
  }

  getLega(id: string): Observable<any> {
    return this.http.get<any>(`https://fantastick.adaptable.app/lega/${id}`).pipe(
      tap((data: LegaModel) => {
        console.log('Dati ricevuti:', data.CNOME);
      }),
      catchError(error => {
        console.error('Errore durante la richiesta:', error);
        return of(null);
      })
    );
  }

  getSquadra(id: string): Observable<any> {
    return this.http.get<any>(`https://fantastick.adaptable.app/squadra/${id}`).pipe(
      tap((data: SquadraModel) => {
        console.log('Dati ricevuti:', data.IDCREATORE);
      }),
      catchError(error => {
        console.error('Errore durante la richiesta:', error);
        return of(null);
      })
    );
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`https://fantastick.adaptable.app/user/${id}`).pipe(
      tap((data: UserModel) => {
        console.log('Dati ricevuti:', data.CNICKNAME);
      }),
      catchError(error => {
        console.error('Errore durante la richiesta:', error);
        return of(null);
      })
    );
  }
}