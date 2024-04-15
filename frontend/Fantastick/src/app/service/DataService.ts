import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getDato(nome: string): Observable<any> {
    return this.http.get<any>(`https://fantastick-be.vercel.app/`).pipe(
      tap((data: any) => {
        console.log('Ricevuto qualcosa:');
      })
    );
  }
}