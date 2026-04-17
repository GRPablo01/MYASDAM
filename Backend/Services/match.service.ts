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
  
  // Gestion du temps du match (90 minutes)
  minute?: number;              // Minute actuelle (0-90+)
  periode?: string;             // '1MT', 'MI-TPS', '2MT', 'PROL', 'TAB', 'TER'
  tempsAdditionnel?: number;    // Minutes ajoutées (ex: 3 pour 45+3)
  
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
  
  // BehaviorSubject pour suivre les matchs en temps réel
  private matchsEnCours$ = new BehaviorSubject<Match[]>([]);

  constructor(private http: HttpClient) {}

  // 🔵 Récupérer tous les matchs
  getMatchs(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  // 🔵 Récupérer un match par ID
  getMatchById(id: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }

  // 🔵 Créer un match
  createMatch(match: Match): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  // 🔵 Mettre à jour un match
  updateMatch(id: string, match: Partial<Match>): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match);
  }

  // 🔵 Supprimer un match
  deleteMatch(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 🔵 Démarrer un match (met à jour le statut et initialise le temps)
  demarrerMatch(id: string): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${id}/demarrer`, {
      statut: 'En cours',
      periode: '1MT',
      minute: 1
    });
  }

  // 🔵 Mettre à jour la minute du match
  updateMinute(id: string, minute: number, periode?: string, tempsAdditionnel?: number): Observable<Match> {
    const update: Partial<Match> = { minute };
    if (periode) update.periode = periode;
    if (tempsAdditionnel !== undefined) update.tempsAdditionnel = tempsAdditionnel;
    
    return this.http.patch<Match>(`${this.apiUrl}/${id}/minute`, update);
  }

  // 🔵 Passage mi-temps
  miTemps(id: string): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${id}/mitemps`, {
      periode: 'MI-TPS',
      minute: 45
    });
  }

  // 🔵 Reprise 2ème mi-temps
  repriseSecondePeriode(id: string): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${id}/reprise`, {
      periode: '2MT',
      minute: 46
    });
  }

  // 🔵 Terminer le match
  terminerMatch(id: string): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${id}/terminer`, {
      statut: 'Terminé',
      periode: 'TER',
      minute: 90
    });
  }

  // 🔵 Formater l'affichage de la minute
  formaterMinute(match: Match): string {
    if (!match || match.statut !== 'En cours') return '';
    
    // Périodes spéciales
    const periodesSpeciales: { [key: string]: string } = {
      'MI-TPS': 'MI-TPS',
      'TER': 'TER',
      'PROL': 'PROL',
      'TAB': 'TAB'
    };
    
    if (match.periode && periodesSpeciales[match.periode]) {
      return periodesSpeciales[match.periode];
    }
    
    const minute = match.minute || 0;
    const additionnel = match.tempsAdditionnel || 0;
    
    // 1ère mi-temps (1-45 + temps additionnel)
    if (match.periode === '1MT') {
      if (minute > 45) {
        return `45+${minute - 45}'`;
      }
      return `${minute}'`;
    }
    
    // 2ème mi-temps (46-90 + temps additionnel)
    if (match.periode === '2MT') {
      if (minute > 90) {
        return `90+${minute - 90}'`;
      }
      return `${minute}'`;
    }
    
    return `${minute}'`;
  }

  // 🔵 Vérifier si le match est en cours (live)
  isMatchLive(match: Match): boolean {
    return match.statut === 'En cours' && 
           match.periode !== 'TER' && 
           match.periode !== 'MI-TPS';
  }

  // 🔵 Obtenir le pourcentage de progression du match (0-100%)
  getProgressionMatch(match: Match): number {
    if (!match.minute) return 0;
    if (match.periode === 'TER') return 100;
    if (match.periode === 'MI-TPS') return 50;
    
    const maxMinutes = 90;
    const current = Math.min(match.minute, maxMinutes);
    return Math.round((current / maxMinutes) * 100);
  }

  // 🔵 Simulation temps réel (pour test/dev)
  simulerTempsMatch(matchId: string): Observable<number> {
    return interval(60000).pipe(  // Mise à jour toutes les minutes
      takeWhile(() => true),
      map(tick => tick + 1)
    );
  }
}