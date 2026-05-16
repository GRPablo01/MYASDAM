import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';

// =========================
// BASE API
// =========================
const API_URL = 'http://localhost:3000/api';

// =========================
// INTERFACES
// =========================

export interface DatabaseData {
  users: any[];
  equipes: any[];
  matchs: any[];
  events: any[];
  convocations: any[];
  actus: any[];
  logs: any[];
  messages: any[];
}

// =========================
// CONVOCATION
// =========================
export interface Joueur {
  _id?: string;
  key: string;
  prenom: string;
  nom: string;
  email?: string;
  present: 'oui' | 'non' | 'non_repondu';
}

export interface Convocation {
  _id?: string;
  key: string;
  joueurs: Joueur[];
  equipe: string;
  match: string;
  dateMatch: string;
  lieu: string;
  statut?: string;
  isRead?: boolean;
  expanded?: boolean;
}

// =========================
// ACTUS
// =========================
export interface Actu {
  _id: string;
  titre: string;
  auteur: string;
  description: string;
  image?: string;
  saison?: string;
  key?: string;
  dateCreation?: string;
}

// =========================
// EQUIPES
// =========================
export interface Equipe {
  _id?: string;
  nom: string;
  ville?: string;
  logo: string;
}

// =========================
// MATCH
// =========================
export interface Match {
  _id?: string;
  equipeDom: string;
  equipeExt: string;
  date: string;
  heure?: string;
  lieu?: string;
  enCours: boolean;
  minute?: number;
  periode?: string;
  statut?: string;
  scoreDom?: number;
  scoreExt?: number;
  key?: string;
}

// =========================
// MESSAGE
// =========================
export interface Message {
  _id?: string;
  texte: string;
  expediteurId: string;
  destinataireId: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient,
  ) {}

  // ==================================================
  // 🔥 DASHBOARD GLOBAL DATA
  // ==================================================
  getAllDatabaseData(): Observable<DatabaseData> {
    return forkJoin({
      users: this.http.get<any[]>(`${API_URL}/users`),
      equipes: this.http.get<any[]>(`${API_URL}/equipes`),
      matchs: this.http.get<any[]>(`${API_URL}/matchs`),
      events: this.http.get<any[]>(`${API_URL}/events`),
      convocations: this.http.get<any[]>(`${API_URL}/convocation`),
      actus: this.http.get<any[]>(`${API_URL}/actus`),
      logs: this.http.get<any[]>(`${API_URL}/logs`),
      messages: this.http.get<any[]>(`${API_URL}/messages`)
    });
  }

  // ==================================================
  // 🔐 USER (AUTH SYSTEM)
  // ==================================================
  private currentUser$ = new BehaviorSubject<any>(null);

  setUser(user: any) {
    this.currentUser$.next(user);
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('utilisateur') || 'null');
  }

  clearUser() {
    this.currentUser$.next(null);
    localStorage.removeItem('utilisateur');
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  getUserRole(): string {
    return this.getUser()?.role?.trim().toLowerCase() || '';
  }

  // USERS API
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/users`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${API_URL}/users/${id}`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${API_URL}/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/users/${id}`);
  }

  followUser(myKey: string, followKey: string): Observable<any> {
    return this.http.put(`${API_URL}/users/follow`, {
      myKey,
      followKey
    });
  }

  // ==================================================
  // 📅 EVENTS
  // ==================================================
  createEvent(event: any): Observable<any> {
    return this.http.post(`${API_URL}/events/create`, event);
  }

  getEvents(): Observable<any> {
    return this.http.get(`${API_URL}/events`);
  }

  updateEvent(id: string, event: any): Observable<any> {
    return this.http.put(`${API_URL}/events/${id}`, event);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/events/${id}`);
  }

  // ==================================================
  // 🏆 EQUIPES
  // ==================================================
  getEquipes(): Observable<Equipe[]> {
    return this.http.get<Equipe[]>(`${API_URL}/equipes`);
  }

  // ==================================================
  // ⚽ MATCHS
  // ==================================================
  getMatchs(): Observable<Match[]> {
    return this.http.get<Match[]>(`${API_URL}/matchs`);
  }

  createMatch(match: Match): Observable<Match> {
    return this.http.post<Match>(`${API_URL}/matchs`, match);
  }

  updateMatch(id: string, match: Partial<Match>): Observable<Match> {
    return this.http.put<Match>(`${API_URL}/matchs/${id}`, match);
  }

  deleteMatch(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/matchs/${id}`);
  }

  demarrerMatch(id: string): Observable<Match> {
    return this.http.post<Match>(`${API_URL}/matchs/demarrer/${id}`, {});
  }

  terminerMatch(id: string): Observable<Match> {
    return this.http.post<Match>(`${API_URL}/matchs/terminer/${id}`, {});
  }

  // ==================================================
  // 📢 ACTUS
  // ==================================================
  getAllActus(): Observable<Actu[]> {
    return this.http.get<Actu[]>(`${API_URL}/actus`);
  }

  updateActu(key: string, data: Actu): Observable<any> {
    return this.http.put(`${API_URL}/actus/${key}`, data);
  }

  deleteActu(key: string): Observable<any> {
    return this.http.delete(`${API_URL}/actus/${key}`);
  }

  addCommentaire(key: string, nomComplet: string, contenu: string): Observable<any> {
    return this.http.post(`${API_URL}/actus/${key}/commentaire`, {
      nomComplet,
      contenu
    });
  }

  toggleLike(key: string, userId: string) {
    return this.http.post(`${API_URL}/actus/${key}/like`, { userId });
  }

  toggleFavori(key: string, userId: string) {
    return this.http.post(`${API_URL}/actus/${key}/favori`, { userId });
  }

  // ==================================================
  // 📩 MESSAGES
  // ==================================================
  getAllMessages(): Observable<any> {
    return this.http.get(`${API_URL}/messages`);
  }

  sendMessage(msg: Message): Observable<any> {
    return this.http.post(`${API_URL}/messages`, msg);
  }

  recupererConversation(user1: string, user2: string): Observable<any> {
    return this.http.get(`${API_URL}/messages/conversation/${user1}/${user2}`);
  }

  dernierMessage(user1: string, user2: string): Observable<any> {
    return this.http.get(`${API_URL}/messages/dernier/${user1}/${user2}`);
  }

  updateMessage(id: string, message: any): Observable<any> {
    return this.http.put(`${API_URL}/messages/${id}`, message);
  }

  deleteMessage(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/messages/${id}`);
  }

  // ==================================================
  // 📊 LIVE WATCH DATABASE
  // ==================================================
  watchDatabaseChanges(intervalMs: number = 3000): Observable<DatabaseData> {

    return new Observable(observer => {

      let previousData = '';

      const load = () => {

        this.getAllDatabaseData().subscribe({
          next: (data) => {

            const current = JSON.stringify(data);

            if (current !== previousData) {
              previousData = current;
              observer.next(data);
            }

          },
          error: (err) => observer.error(err)
        });

      };

      load();

      const interval = setInterval(load, intervalMs);

      return () => clearInterval(interval);
    });
  }
}