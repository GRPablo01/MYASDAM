import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, switchMap } from 'rxjs';

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
  private logUrl = 'http://localhost:3000/api/logs';

  private matchsEnCours$ = new BehaviorSubject<Match[]>([]);

  constructor(private http: HttpClient) {}

  // =========================
  // USER CONNECTÉ
  // =========================
  private getCurrentUser() {
    return JSON.parse(localStorage.getItem('utilisateur') || '{}');
  }

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
  // CREATE MATCH + LOG
  // ======================
  createMatch(match: Match): Observable<any> {
    return this.http.post<Match>(this.apiUrl, match).pipe(
      switchMap((createdMatch) => {

        const user = this.getCurrentUser();

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'CREATE_MATCH',
          description: `${user.role || 'Utilisateur'} a créé un match`,
          type: 'CREATE',
          field: 'match',
          newValue: createdMatch,
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => createdMatch)
        );
      })
    );
  }

  // ======================
  // UPDATE MATCH + LOG
  // ======================
  updateMatch(id: string, match: Partial<Match>): Observable<any> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match).pipe(
      switchMap((updatedMatch) => {

        const user = this.getCurrentUser();

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'UPDATE_MATCH',
          description: `${user.role || 'Utilisateur'} a modifié un match`,
          type: 'UPDATE',
          field: 'match',
          newValue: updatedMatch,
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => updatedMatch)
        );
      })
    );
  }

  // ======================
  // DELETE MATCH + LOG
  // ======================
  deleteMatch(id: string): Observable<any> {

    return this.http.get<Match>(`${this.apiUrl}/${id}`).pipe(
      switchMap((match) => {

        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
          switchMap((deleted) => {

            const user = this.getCurrentUser();

            const logData = {
              user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
              role: user.role || 'unknown',
              action: 'DELETE_MATCH',
              description: `${user.role || 'Utilisateur'} a supprimé un match`,
              type: 'DELETE',
              field: 'match',
              oldValue: match,
              date: new Date()
            };

            return this.http.post(this.logUrl, logData).pipe(
              map(() => deleted)
            );
          })
        );
      })
    );
  }

  // ======================
  // AUTRES ACTIONS (inchangées)
  // ======================
  demarrerMatch(id: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/demarrer/${id}`, {});
  }

  updateMinute(id: string, data: any): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/minute/${id}`, data);
  }

  miTemps(id: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/mitemps/${id}`, {});
  }

  repriseSecondePeriode(id: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/reprise/${id}`, {});
  }

  terminerMatch(id: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/terminer/${id}`, {});
  }

  // ======================
  // UTILS
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

  isMatchLive(match: Match): boolean {
    return match.statut === 'En cours' && match.periode !== 'TER';
  }

  getProgressionMatch(match: Match): number {
    if (!match.minute) return 0;
    if (match.periode === 'TER') return 100;
    if (match.periode === 'MI-TPS') return 50;

    return Math.min(Math.round((match.minute / 90) * 100), 100);
  }

  private baseUrl = 'http://localhost:3000/uploads/';

  normalizeLogo(logo?: string): string {
    if (!logo) return 'assets/default-team.png';

    const clean = logo.replace(/^\/+/, '');

    if (clean.startsWith('http')) return clean;

    return this.baseUrl + clean;
  }
}