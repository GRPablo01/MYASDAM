import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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
  prenom?: string;       
  nom?: string;          
  image?: string;        
  saison?: string;
  likes: number;
  favoris: number;
  key?: string;
  dateCreation?: string;
  __v?: number;

  commentaires: Commentaire[];
  // propriétés frontend
  isLiked?: boolean;
  isFavori?: boolean;
  
}

@Injectable({
  providedIn: 'root'
})
export class ActusService {

  // URL de ton backend Express
  private apiUrl = 'http://localhost:3000/api/actus';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les actus
  getAllActus(): Observable<Actu[]> {
    return this.http.get<Actu[]>(this.apiUrl);
  }

  toggleLike(key: string, userId: string) {
    return this.http.post<{ likes: number; isLiked: boolean }>(
      `http://localhost:3000/api/actus/${key}/like`,
      { userId }
    );
  }
  
  toggleFavori(key: string, userId: string) {
    return this.http.post<{ favoris: number; isFavori: boolean }>(
      `http://localhost:3000/api/actus/${key}/favori`,
      { userId }
    );
  }
  


  // Angular service
  addCommentaire(key: string, nomComplet: string, contenu: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${key}/commentaire`, { nomComplet, contenu });
  }

  
}
