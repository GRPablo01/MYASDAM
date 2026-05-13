import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private api = 'http://localhost:3000/api/contact';

  constructor(private http: HttpClient) {}

  // ➕ ajouter contact
  addContact(data: any) {
    return this.http.post(`${this.api}/add`, data);
  }

  // 📥 récupérer contacts
  getContacts(userId: string) {
    return this.http.get(`${this.api}/${userId}`);
  }

  // 🗑️ supprimer contact
  removeContact(data: any) {
    return this.http.request('delete', `${this.api}/remove`, {
      body: data
    });
  }
}