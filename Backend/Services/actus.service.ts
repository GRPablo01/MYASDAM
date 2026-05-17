import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

export interface Commentaire {
  nomComplet: string;
  contenu: string;
  date?: string;
  userId?: string;
}

export interface Actu {
  _id: string;
  titre: string;
  auteur: string;
  description: string;
  image?: string;
  saison?: string;
  key?: string;
  dateCreation?: string;
  __v?: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActusService {

  private apiUrl = 'http://localhost:3000/api/actus';
  private logUrl = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) { }

  // =========================
  // USER CONNECTÉ
  // =========================
  private getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('utilisateur') || '{}');
  }

  // =========================
  // GET ALL ACTUS
  // =========================
  getAllActus(): Observable<Actu[]> {
    return this.http.get<Actu[]>(this.apiUrl);
  }

  // =========================
  // LIKE + LOG
  // =========================
  toggleLike(key: string, userId: string) {

    const user = this.getCurrentUser();

    return this.http.post<{ likes: number; isLiked: boolean }>(
      `${this.apiUrl}/${key}/like`,
      { userId }
    ).pipe(
      switchMap((res) => {

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'LIKE_ACTU',
          description: `${user.role || 'Utilisateur'} a aimé une actu`,
          type: 'UPDATE',
          field: 'actu',
          newValue: { key, userId },
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => res)
        );
      })
    );
  }

  // =========================
  // FAVORI + LOG
  // =========================
  toggleFavori(key: string, userId: string) {

    const user = this.getCurrentUser();

    return this.http.post<{ favoris: number; isFavori: boolean }>(
      `${this.apiUrl}/${key}/favori`,
      { userId }
    ).pipe(
      switchMap((res) => {

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'FAVORI_ACTU',
          description: `${user.role || 'Utilisateur'} a ajouté une actu en favori`,
          type: 'UPDATE',
          field: 'actu',
          newValue: { key, userId },
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => res)
        );
      })
    );
  }

  // =========================
  // DELETE ACTU + LOG
  // =========================
  deleteActu(id: string): Observable<any> {

    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      switchMap((deleted: any) => {

        const user = this.getCurrentUser();

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'DELETE_ACTU',
          description: `${user.role || 'Utilisateur'} a supprimé une actu`,
          type: 'DELETE',
          field: 'actu',
          oldValue: null,
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => deleted)
        );
      })
    );
  }


  // =========================
  // UPDATE ACTU + LOG
  // =========================
  updateActu(id: string, data: FormData | Partial<Actu>): Observable<any> {

    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      switchMap((updated) => {

        const user = this.getCurrentUser();

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'UPDATE_ACTU',
          description: `${user.role || 'Utilisateur'} a modifié une actu`,
          type: 'UPDATE',
          field: 'actu',
          newValue: updated,
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => updated)
        );
      })
    );
  }

  // =========================
  // COMMENTAIRE + LOG
  // =========================
  addCommentaire(key: string, nomComplet: string, contenu: string): Observable<any> {

    const user = this.getCurrentUser();

    return this.http.post(
      `${this.apiUrl}/${key}/commentaire`,
      { nomComplet, contenu }
    ).pipe(
      switchMap((res) => {

        const logData = {
          user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
          role: user.role || 'unknown',
          action: 'COMMENTAIRE_ACTU',
          description: `${user.role || 'Utilisateur'} a ajouté un commentaire`,
          type: 'CREATE',
          field: 'commentaire',
          newValue: { key, contenu },
          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => res)
        );
      })
    );
  }
}