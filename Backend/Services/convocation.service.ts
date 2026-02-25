import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Convocation {
  _id?: string;
  joueurs: string[];
  equipe: string;
  match: string;
  dateMatch: string;
  lieu: string;
  statut: string;
  joueursDetails?: any; // ou typé proprement 👇
}

@Injectable({
  providedIn: 'root'
})
export class ConvocationService {

  private apiUrl = 'http://localhost:3000/api/convocation';

  constructor(private http: HttpClient) {}

  getConvocations(): Observable<Convocation[]> {
    return this.http.get<Convocation[]>(this.apiUrl);
  }

  // ✅ POST créer une convocation
  createConvocation(convocation: Convocation): Observable<Convocation> {
    return this.http.post<Convocation>(this.apiUrl, convocation);
  }
}
