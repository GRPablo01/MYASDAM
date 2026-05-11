import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Joueur {
  _id?: string;
  key: string;
  prenom: string;
  nom: string;
  email?: string; 
  present: 'oui' | 'non' | 'non_repondu';
}

export interface Convocation {
  _id?:string;
  key: string;
  joueurs: Joueur[];       // 🔹 ici on met le type correct
  equipe: string;
  match: string;
  dateMatch: string;
  lieu: string;
  statut?: string;          // si nécessaire
  isRead?: boolean;
  // 🔹 Propriété locale pour l’affichage
  expanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConvocationService {

  private apiUrl = 'http://localhost:3000/api/convocation';

  constructor(private http: HttpClient) {}

  getConvocations(): Observable<Convocation[]> {
    return this.http.get<Convocation[]>(this.apiUrl);
  }

  // ✅ POST créer une convocation
  createConvocation(convocation: Convocation): Observable<Convocation> {
    return this.http.post<Convocation>(this.apiUrl, convocation);
  }


  updateStatut(convocationId: string, joueurId: string, present: string) {
    return this.http.put(
      `http://localhost:3000/api/convocations/${convocationId}/joueur/${joueurId}`,
      { present }
    );
  }

  updateConvocationByKey(id: string, data: any) {
    return this.http.put(`http://localhost:3000/api/convocation/${id}`, data);
  }
  
  deleteConvocationByKey(id: string) {
    return this.http.delete(`http://localhost:3000/api/convocation/${id}`);
  }
}
