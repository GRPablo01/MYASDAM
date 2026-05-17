import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  firstValueFrom,
  Observable,
  switchMap,
  map
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private utilisateur: any = null;

  private apiUrl = 'http://localhost:3000/api/users';
  private authUrl = 'http://localhost:3000/api/auth';
  private logUrl = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) {

    const data = localStorage.getItem('utilisateur');

    if (data) {
      this.utilisateur = JSON.parse(data);
    }
  }

  // ==========================
  // GET CURRENT USER
  // ==========================
  private getCurrentUser() {

    return this.utilisateur ||
      JSON.parse(localStorage.getItem('utilisateur') || '{}');
  }

  // ==========================
  // SAVE USER
  // ==========================
  setUser(user: any) {

    this.utilisateur = user;

    localStorage.setItem(
      'utilisateur',
      JSON.stringify(user)
    );
  }

  // ==========================
  // GET USER
  // ==========================
  getUser() {

    return this.utilisateur;
  }

  // ==========================
  // CLEAR USER
  // ==========================
  clearUser() {

    this.utilisateur = null;

    localStorage.removeItem('utilisateur');
  }

  // ==========================
  // IS LOGGED
  // ==========================
  isLoggedIn(): boolean {

    return !!this.utilisateur;
  }

  // ==========================
  // USER ROLE
  // ==========================
  getUserRole(): string {

    return (
      this.utilisateur?.role
        ?.trim()
        .toLowerCase()
      || ''
    );
  }

  // ==========================
  // RESET PASSWORD MAIL
  // ==========================
  envoyerLienReinitialisation(email: string) {

    return firstValueFrom(
      this.http.post(
        `${this.apiUrl}/reset-link`,
        { email }
      )
    );
  }

  // ==========================
  // RESET PASSWORD
  // ==========================
  async reinitialiserMotDePasse(
    email: string,
    password: string
  ) {

    return fetch(
      'http://localhost:3000/api/auth/reset-password',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );
  }

  // ==========================
  // CONFIRM RESET PASSWORD
  // ==========================
  confirmerResetMotDePasse(
    token: string,
    motDePasse: string
  ) {

    return this.http.post(
      `${this.apiUrl}/reset-link/confirm`,
      {
        token,
        password: motDePasse
      }
    ).toPromise();
  }

  // ==========================
  // GET ALL USERS
  // ==========================
  getAllUsers() {

    return this.http.get(
      `${this.authUrl}/users`
    );
  }

  // ==========================
  // AJOUTER SUIVIE + LOG
  // ==========================
  ajouterSuivie(
    followKey: string
  ): Observable<any> {

    const currentUser = this.getCurrentUser();

    if (!currentUser || !currentUser.key) {

      throw new Error(
        'Utilisateur non connecté'
      );
    }

    return this.http.put(
      `${this.apiUrl}/follow`,
      {
        myKey: currentUser.key,
        followKey
      }
    ).pipe(

      switchMap((response: any) => {

        const logData = {

          user:
            `${currentUser.prenom || 'Inconnu'} ` +
            `${currentUser.nom || ''}`,

          role:
            currentUser.role || 'unknown',

          action: 'FOLLOW_USER',

          description:
            `${currentUser.role || 'Utilisateur'} ` +
            `a ajouté un suivi utilisateur`,

          type: 'UPDATE',

          field: 'follow',

          newValue: {
            followKey
          },

          date: new Date()
        };

        return this.http.post(
          this.logUrl,
          logData
        ).pipe(

          map(() => response)
        );
      })
    );
  }

  // ==========================
  // UPDATE USER + LOG
  // ==========================
  updateUser(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    ).pipe(

      switchMap((updatedUser: any) => {

        const currentUser =
          this.getCurrentUser();

        const logData = {

          user:
            `${currentUser.prenom || 'Inconnu'} ` +
            `${currentUser.nom || ''}`,

          role:
            currentUser.role || 'unknown',

          action: 'UPDATE_USER',

          description:
            `${currentUser.role || 'Utilisateur'} ` +
            `a modifié l'utilisateur ` +
            `${updatedUser.nom || data.nom || ''}`,

          type: 'UPDATE',

          field: 'user',

          newValue: {
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            role: data.role
          },

          date: new Date()
        };

        return this.http.post(
          this.logUrl,
          logData
        ).pipe(

          map(() => updatedUser)
        );
      })
    );
  }

  // ==========================
  // DELETE USER + LOG
  // ==========================
  deleteUser(
    id: string
  ): Observable<any> {

    console.log(
      '📡 HTTP DELETE CALL:',
      id
    );

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    ).pipe(

      switchMap((userToDelete) => {

        return this.http.delete(
          `${this.apiUrl}/${id}`
        ).pipe(

          switchMap((deletedUser) => {

            const currentUser =
              this.getCurrentUser();

            const logData = {

              user:
                `${currentUser.prenom || 'Inconnu'} ` +
                `${currentUser.nom || ''}`,

              role:
                currentUser.role || 'unknown',

              action: 'DELETE_USER',

              description:
                `${currentUser.role || 'Utilisateur'} ` +
                `a supprimé l'utilisateur ` +
                `${userToDelete.nom || ''}`,

              type: 'DELETE',

              field: 'user',

              oldValue: {
                nom: userToDelete.nom,
                prenom: userToDelete.prenom,
                email: userToDelete.email,
                role: userToDelete.role
              },

              date: new Date()
            };

            return this.http.post(
              this.logUrl,
              logData
            ).pipe(

              map(() => deletedUser)
            );
          })
        );
      })
    );
  }
}