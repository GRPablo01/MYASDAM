import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

// =========================
// INTERFACES ASDAM
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

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ==================================================
  // 🔥 1. RECUPERER TOUTE LA BASE DE DONNEES
  // ==================================================
  getAllDatabaseData(): Observable<DatabaseData> {
    return forkJoin({
      users: this.http.get<any[]>(`${this.apiUrl}/users`),
      equipes: this.http.get<any[]>(`${this.apiUrl}/equipes`),
      matchs: this.http.get<any[]>(`${this.apiUrl}/matchs`),
      events: this.http.get<any[]>(`${this.apiUrl}/events`),
      convocations: this.http.get<any[]>(`${this.apiUrl}/convocation`),
      actus: this.http.get<any[]>(`${this.apiUrl}/actus`),
      logs: this.http.get<any[]>(`${this.apiUrl}/logs`),
      messages: this.http.get<any[]>(`${this.apiUrl}/messages`)
    });
  }

  // ==================================================
  // 🔥 2. USERS (comme ton AuthService)
  // ==================================================

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    console.log('📡 DELETE USER:', id);
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // 🔥 suivre un utilisateur
  followUser(myKey: string, followKey: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/follow`, {
      myKey,
      followKey
    });
  }

  // ==================================================
  // 🔥 3. SURVEILLANCE BDD EN TEMPS RÉEL
  // ==================================================

  watchDatabaseChanges(intervalMs: number = 3000): Observable<DatabaseData> {

    return new Observable(observer => {

      let previousData = '';

      const loadData = () => {

        this.getAllDatabaseData().subscribe({
          next: (data) => {

            const currentData = JSON.stringify(data);

            if (currentData !== previousData) {
              previousData = currentData;
              observer.next(data);
            }

          },
          error: (err) => observer.error(err)
        });

      };

      loadData();

      const interval = setInterval(loadData, intervalMs);

      return () => clearInterval(interval);
    });
  }
}