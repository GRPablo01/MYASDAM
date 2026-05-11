import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, BehaviorSubject, map } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

export interface Match {
  _id?: string;
  equipeDom: string;
  equipeExt: string;
  date: string;
  heure?: string;
  lieu?: string;

  enCours: boolean;
  compteRebours?: string;
  showInfos?: boolean;

  minute?: number;
  periode?: string;
  tempsAdditionnel?: number;

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

  private matchsEnCours$ = new BehaviorSubject<Match[]>([]);

  constructor(private http: HttpClient) {}

  // ======================
  // GET ALL MATCHS
  // ======================
  getMatchs(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  // ======================
  // GET ONE MATCH
  // ======================
  getMatchById(id: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }

  // ======================
  // CREATE MATCH
  // ======================
  createMatch(match: Match): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  // ======================
  // UPDATE MATCH (MODIFIER)
  // ======================
  updateMatch(id: string, match: Partial<Match>): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match);
  }

  // ======================
  // DELETE MATCH (SUPPRIMER)
  // ======================
  deleteMatch(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ======================
  // DEMARRER MATCH
  // ======================
  demarrerMatch(id: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/demarrer/${id}`, {});
  }

  // ======================
  // MINUTE
  // ======================
  updateMinute(id: string, data: any): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/minute/${id}`, data);
  }

  // ======================
  // MI-TEMPS
  // ======================
  miTemps(id: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/mitemps/${id}`, {});
  }

  // ======================
  // REPRISE
  // ======================
  repriseSecondePeriode(id: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/reprise/${id}`, {});
  }

  // ======================
  // TERMINER MATCH
  // ======================
  terminerMatch(id: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/terminer/${id}`, {});
  }

  // ======================
  // FORMAT MINUTE
  // ======================
  formaterMinute(match: Match): string {
    if (!match || match.statut !== 'En cours') return '';

    if (match.periode === 'MI-TPS') return 'MI-TPS';
    if (match.periode === 'TER') return 'TER';

    const minute = match.minute || 0;

    if (match.periode === '1MT') {
      return minute > 45 ? `45+${minute - 45}'` : `${minute}'`;
    }

    if (match.periode === '2MT') {
      return minute > 90 ? `90+${minute - 90}'` : `${minute}'`;
    }

    return `${minute}'`;
  }

  // ======================
  // LIVE CHECK
  // ======================
  isMatchLive(match: Match): boolean {
    return match.statut === 'En cours' && match.periode !== 'TER';
  }

  // ======================
  // PROGRESSION
  // ======================
  getProgressionMatch(match: Match): number {
    if (!match.minute) return 0;
    if (match.periode === 'TER') return 100;
    if (match.periode === 'MI-TPS') return 50;

    return Math.min(Math.round((match.minute / 90) * 100), 100);
  }
}