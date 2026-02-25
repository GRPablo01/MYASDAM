// services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events'; // Backend CommonJS

  constructor(private http: HttpClient) {}

  createEvent(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, event);
  }

  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
