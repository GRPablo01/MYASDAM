import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private apiUrl = 'http://localhost:3000/api/messages';

    constructor(private http: HttpClient) {}

    // ==========================================
    // RECUPERER TOUS LES MESSAGES
    // ==========================================
    getAllMessages(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    // ==========================================
    // ENVOYER MESSAGE
    // ==========================================
    sendMessage(msg: {
        texte: string;
        expediteurId: string;
        destinataireId: string;
    }): Observable<any> {

        return this.http.post(`${this.apiUrl}`, msg);
    }

    // ==========================================
    // CONVERSATION
    // ==========================================
    recupererConversation(
        user1: string,
        user2: string
    ): Observable<any> {

        return this.http.get(
            `${this.apiUrl}/conversation/${user1}/${user2}`
        );
    }

    // ==========================================
    // DERNIER MESSAGE
    // ==========================================
    dernierMessage(
        user1: string,
        user2: string
    ): Observable<any> {

        return this.http.get(
            `${this.apiUrl}/dernier/${user1}/${user2}`
        );
    }

    // ==========================================
  // UPDATE  ← CELLE QUI MANQUAIT
  // ==========================================
  updateMessage(id: string, message: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, message);
  }

  // ==========================================
  // DELETE
  // ==========================================
  deleteMessage(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

    
}