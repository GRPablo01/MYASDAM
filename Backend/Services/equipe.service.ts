// src/app/services/equipe.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

export interface Equipe {
  _id?: string;
  nom: string;
  ville?: string;
  logo: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  private apiUrl = 'http://localhost:3000/api/equipes';
  private logUrl = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) {}

  // =========================
  // GET USER CONNECTÉ
  // =========================
  private getCurrentUser() {

    return JSON.parse(
      localStorage.getItem('user') || '{}'
    );
  }

  // =========================
  // GET EQUIPES
  // =========================
  getEquipes(): Observable<Equipe[]> {

    return this.http.get<Equipe[]>(this.apiUrl);
  }

  normalizeLogo(logo?: string): string {
    if (!logo) return 'assets/default-team.png';
  
    // déjà URL complète
    if (logo.startsWith('http')) return logo;
  
    // image upload backend
    return `http://localhost:3000/uploads/${logo}`;
  }

  // =========================
  // CREATE EQUIPE + LOG
  // =========================
  createEquipe(equipe: Equipe): Observable<any> {

    return this.http.post<Equipe>(
      this.apiUrl,
      equipe
    ).pipe(

      switchMap((createdEquipe) => {

        const currentUser = this.getCurrentUser();

        const logData = {

          user:
            `${currentUser.prenom || 'Inconnu'} ` +
            `${currentUser.nom || ''}`,

          role: currentUser.role || 'unknown',

          action: 'CREATE_EQUIPE',

          description:
            `${currentUser.role || 'Utilisateur'} a créé ` +
            `l'équipe`,

          type: 'CREATE',

          field: 'equipe',

          newValue: {
            nom: createdEquipe.nom,
            ville: createdEquipe.ville,
            logo: createdEquipe.logo
          },

          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => createdEquipe)
        );
      })
    );
  }

  // =========================
  // UPDATE EQUIPE + LOG
  // =========================
  updateEquipe(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    ).pipe(

      switchMap((updatedEquipe: any) => {

        const currentUser = this.getCurrentUser();

        const logData = {

          user:
            `${currentUser.prenom || 'Inconnu'} ` +
            `${currentUser.nom || ''}`,

          role: currentUser.role || 'unknown',

          action: 'UPDATE_EQUIPE',

          description:
            `${currentUser.role || 'Utilisateur'} a modifié ` +
            `l'équipe ${updatedEquipe.nom || data.nom}`,

          type: 'UPDATE',

          field: 'equipe',

          newValue: {
            nom: data.nom,
            ville: data.ville,
            logo: data.logo
          },

          date: new Date()
        };

        return this.http.post(this.logUrl, logData).pipe(
          map(() => updatedEquipe)
        );
      })
    );
  }


  // ======================
// DELETE EQUIPE + LOG
// ======================
deleteEquipe(id: string, oldEquipe: any): Observable<any> {

  return this.http.delete(`${this.apiUrl}/${id}`).pipe(

    switchMap((deleted: any) => {

      const user = this.getCurrentUser();

      const logData = {
        user: `${user.prenom || 'Inconnu'} ${user.nom || ''}`,
        role: user.role || 'unknown',
        action: 'DELETE_EQUIPE',
        description: `${user.role || 'Utilisateur'} a supprimé une équipe`,
        type: 'DELETE',
        field: 'equipe',
        oldValue: oldEquipe,
        date: new Date()
      };

      return this.http.post(this.logUrl, logData).pipe(
        map(() => deleted)
      );
    })
  );
}
}