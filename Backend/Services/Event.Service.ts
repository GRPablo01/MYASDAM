import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:3000/api/events';
  private logUrl = 'http://localhost:3000/api/logs';

  private events$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  // =========================
  // USER CONNECTÉ
  // =========================
  private getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('utilisateur') || '{}');
  }

  // ======================
  // GET EVENTS
  // ======================
  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ======================
  // GET EVENT BY ID
  // ======================
  getEventById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ======================
  // CREATE EVENT + LOG
  // ======================
  createEvent(event: any): Observable<any> {

    const user = this.getCurrentUser();

    const eventToSend = {
      ...event,
      createdBy: user?._id || user?.id
    };

    return this.http.post(this.apiUrl, eventToSend).pipe(
      switchMap((createdEvent: any) => {

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'CREATE_EVENT',
          description: `${user.role || 'Utilisateur'} a créé un événement`,
          type: 'CREATE',
          field: 'event',
          newValue: createdEvent,
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => createdEvent)
        );
      })
    );
  }

  // ======================
  // UPDATE EVENT + LOG
  // ======================
  updateEvent(id: string, event: any): Observable<any> {

    return this.http.put(`${this.apiUrl}/${id}`, event).pipe(
      switchMap((updatedEvent: any) => {

        const user = this.getCurrentUser();

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'UPDATE_EVENT',
          description: `${user.role || 'Utilisateur'} a modifié un événement`,
          type: 'UPDATE',
          field: 'event',
          newValue: updatedEvent,
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => updatedEvent)
        );
      })
    );
  }

  // ======================
  // DELETE EVENT + LOG
  // ======================
  deleteEvent(id: string): Observable<any> {

    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      switchMap((event: any) => {

        return this.http.delete(`${this.apiUrl}/${id}`).pipe(
          switchMap((deleted: any) => {

            const user = this.getCurrentUser();

            const logData = {
              user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
              role: user.role || 'unknown',
              action: 'DELETE_EVENT',
              description: `${user.role || 'Utilisateur'} a supprimé un événement`,
              type: 'DELETE',
              field: 'event',
              oldValue: event,
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
}