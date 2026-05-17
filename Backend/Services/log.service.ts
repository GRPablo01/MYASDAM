// src/app/services/log.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

// =========================
// INTERFACE LOG
// =========================
export interface LogItem {
  _id?: string;

  // utilisateur
  user: string;
  role: string;

  // action
  action: string;
  description: string;

  // type de log
  type:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'SYSTEM';

  // élément concerné
  entity?: string;
  entityId?: string;

  // modification
  field?: string;
  oldValue?: any;
  newValue?: any;

  // date
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  // =========================
  // API URL
  // =========================
  private apiUrl = 'http://localhost:3000/api/logs';

  // =========================
  // STATE
  // =========================
  private logsSubject = new BehaviorSubject<LogItem[]>([]);
  logs$ = this.logsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // =========================
  // GET TOUS LES LOGS
  // =========================
  getLogs(): Observable<LogItem[]> {
    return this.http.get<LogItem[]>(this.apiUrl);
  }

  // =========================
  // LOAD LOGS
  // =========================
  loadLogs(): void {
    this.getLogs().subscribe({
      next: (logs) => {
        this.logsSubject.next(logs);
      },
      error: (err) => {
        console.error('Erreur chargement logs :', err);
      }
    });
  }

  // =========================
  // GET LOG PAR ID
  // =========================
  getLogById(id: string): Observable<LogItem> {
    return this.http.get<LogItem>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // CREATE LOG
  // =========================
  createLog(log: Partial<LogItem>): Observable<LogItem> {

    const newLog: LogItem = {
      user: log.user || 'Système',
      role: log.role || 'system',

      action: log.action || 'UNKNOWN',
      description: log.description || 'Aucune description',

      type: log.type || 'SYSTEM',

      entity: log.entity,
      entityId: log.entityId,

      field: log.field,
      oldValue: log.oldValue,
      newValue: log.newValue,

      createdAt: new Date()
    };

    return this.http.post<LogItem>(this.apiUrl, newLog);
  }

  // =========================
  // SAVE LOG RAPIDE
  // =========================
  saveLog(logData: Partial<LogItem>): void {

    const log: LogItem = {
      user: logData.user || 'Système',
      role: logData.role || 'system',

      action: logData.action || 'UNKNOWN',
      description: logData.description || '',

      type: logData.type || 'SYSTEM',

      entity: logData.entity,
      entityId: logData.entityId,

      field: logData.field,
      oldValue: logData.oldValue,
      newValue: logData.newValue,

      createdAt: new Date()
    };

    this.http.post<LogItem>(this.apiUrl, log).subscribe({
      next: () => {
        console.log('Log ajouté');
        this.loadLogs();
      },
      error: (err) => {
        console.error('Erreur ajout log :', err);
      }
    });
  }

  // =========================
  // UPDATE LOG
  // =========================
  updateLog(
    id: string,
    data: Partial<LogItem>
  ): Observable<LogItem> {
    return this.http.put<LogItem>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // =========================
  // DELETE LOG
  // =========================
  deleteLog(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // =========================
  // CLEAR LOCAL STATE
  // =========================
  clearLogs(): void {
    this.logsSubject.next([]);
  }

  // =========================
  // HELPERS
  // =========================

  // Création
  logCreate(
    user: string,
    role: string,
    entity: string,
    entityId: string,
    description: string
  ): void {

    this.saveLog({
      user,
      role,

      action: 'CREATE',
      description,

      type: 'CREATE',

      entity,
      entityId
    });
  }

  // Modification
  logUpdate(
    user: string,
    role: string,
    entity: string,
    entityId: string,
    field: string,
    oldValue: any,
    newValue: any
  ): void {

    this.saveLog({
      user,
      role,

      action: 'UPDATE',
      description: `${field} modifié`,

      type: 'UPDATE',

      entity,
      entityId,

      field,
      oldValue,
      newValue
    });
  }

  // Suppression
  logDelete(
    user: string,
    role: string,
    entity: string,
    entityId: string,
    description: string
  ): void {

    this.saveLog({
      user,
      role,

      action: 'DELETE',
      description,

      type: 'DELETE',

      entity,
      entityId
    });
  }

  // Connexion
  logLogin(
    user: string,
    role: string
  ): void {

    this.saveLog({
      user,
      role,

      action: 'LOGIN',
      description: `${user} s'est connecté`,

      type: 'LOGIN'
    });
  }

  // Déconnexion
  logLogout(
    user: string,
    role: string
  ): void {

    this.saveLog({
      user,
      role,

      action: 'LOGOUT',
      description: `${user} s'est déconnecté`,

      type: 'LOGOUT'
    });
  }
}