import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ConvocationService {

  private apiUrl = 'http://localhost:3000/api/convocation';
  private logUrl = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) {}

  // =========================
  // USER CONNECTÉ
  // =========================
  private getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('utilisateur') || '{}');
  }

  // =========================
  // GET CONVOCATIONS
  // =========================
  getConvocations(): Observable<Convocation[]> {
    return this.http.get<Convocation[]>(this.apiUrl);
  }

  // =========================
  // GET CONVOCATION BY ID
  // =========================
  getConvocationById(id: string): Observable<Convocation> {
    return this.http.get<Convocation>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // CREATE CONVOCATION + LOG
  // =========================
  createConvocation(convocation: Convocation): Observable<any> {

    const user = this.getCurrentUser();

    return this.http.post<Convocation>(this.apiUrl, convocation).pipe(

      switchMap((createdConvocation) => {

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'CREATE_CONVOCATION',
          description: `${user.role || 'Utilisateur'} a créé une convocation pour le match ${createdConvocation.match}`,
          type: 'CREATE',
          field: 'convocation',
          newValue: createdConvocation,
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => createdConvocation)
        );
      })
    );
  }

  // =========================
  // UPDATE CONVOCATION + LOG
  // =========================
  updateConvocation(id: string, data: any): Observable<any> {

    const user = this.getCurrentUser();

    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(

      switchMap((updatedConvocation: any) => {

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'UPDATE_CONVOCATION',
          description: `${user.role || 'Utilisateur'} a modifié une convocation du match ${updatedConvocation.match || data.match}`,
          type: 'UPDATE',
          field: 'convocation',
          newValue: updatedConvocation,
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => updatedConvocation)
        );
      })
    );
  }

  // =========================
  // UPDATE STATUT JOUEUR
  // =========================
  updateStatut(convocationId: string, joueurId: string, present: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${convocationId}/joueur/${joueurId}`,
      { present }
    );
  }

  // =========================
  // DELETE CONVOCATION + LOG
  // =========================
  deleteConvocation(id: string): Observable<any> {

    const user = this.getCurrentUser();

    return this.http.get<Convocation>(`${this.apiUrl}/${id}`).pipe(

      switchMap((convocation) => {

        return this.http.delete(`${this.apiUrl}/${id}`).pipe(

          switchMap((deleted) => {

            const logData = {
              user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
              role: user.role || 'unknown',
              action: 'DELETE_CONVOCATION',
              description: `${user.role || 'Utilisateur'} a supprimé une convocation du match ${convocation.match}`,
              type: 'DELETE',
              field: 'convocation',
              oldValue: convocation,
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