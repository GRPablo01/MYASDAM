import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// =========================
// LOG INTERFACE
// =========================
export interface log {
  user: string;
  role: string;
  action: string;
  description: string;
  date?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl = 'http://localhost:3000/api/logs';

  constructor(private http: HttpClient) {}

  // GET ALL LOGS
  getLogs(): Observable<log[]> {
    return this.http.get<log[]>(this.apiUrl);
  }

  // CREATE LOG
  createLog(log: log): Observable<log> {
    return this.http.post<log>(this.apiUrl, log);
  }

  // CLEAR LOGS
  clearLogs(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}