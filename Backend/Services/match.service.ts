import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Match {
  _id?: string;

  equipeDom: string;
  equipeExt: string;

  date: string;
  heure?: string;
  lieu?: string;
  minute?: string;
  logoDom?: string;
  logoExt?: string;

  statut?: string;
  localisationMatch?: string;


  scoreDom?: number;
  scoreExt?: number;

  categorie?: string;
  typeMatch?: string;
  key?: string;

  createdAt?: string;
  updatedAt?: string;

  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private apiUrl = 'http://localhost:3000/api/matchs';

  constructor(private http: HttpClient) {}

  // 🔵 Récupérer tous les matchs
  getMatchs(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

}
