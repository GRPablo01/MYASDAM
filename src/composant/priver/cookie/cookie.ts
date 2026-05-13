import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-cookie',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './cookie.html',
  styleUrls: ['./cookie.css']
})
export class Cookie implements OnInit {

  show = false;

  userKey: string | null = null;
  userRole = '';
  userCookie = '';
  userNom = '';
  userPrenom = '';

  showNotification = false;
  notificationMessage = '';

  private alreadyHandled = false;

  constructor(
    private http: HttpClient,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // console.log('🍪 Cookie INIT');

    this.initUser();
    this.checkDisplay();
  }

  // =========================
  // INIT USER
  // =========================
  private initUser(): void {

    const data = localStorage.getItem('utilisateur');

    if (data) {
      const user = JSON.parse(data);

      this.userKey = user.key || null;
      this.userRole = (user.role || '').toLowerCase().trim();

      this.userNom = user.nom || '';
      this.userPrenom = user.prenom || '';

      // 🔥 PRIORITÉ ABSOLUE : localStorage cookie
      const localCookie = localStorage.getItem('cookie_choice');

      this.userCookie = (localCookie || '').trim();

      // console.log('👤 USER INIT:', {
      //   key: this.userKey,
      //   role: this.userRole,
      //   cookie: this.userCookie
      // });

    } else {
      this.userKey = null;
      this.userRole = 'guest';
      this.userNom = '';
      this.userPrenom = '';
      this.userCookie = '';
    }
  }

  // =========================
  // DISPLAY LOGIC (FIXÉ)
  // =========================
  private checkDisplay(): void {

    if (this.alreadyHandled) return;
    this.alreadyHandled = true;

    // ❌ super-admin jamais affiché
    if (this.userRole === 'super-admin') return;

    // 🔥 PRIORITÉ ABSOLUE LOCAL STORAGE
    const cookie = localStorage.getItem('cookie_choice');

    if (cookie === 'accepter' || cookie === 'refuser') {
      // console.log('✔ Cookie déjà choisi (localStorage) → pas d’affichage');
      this.show = false;
      return;
    }

    // fallback mémoire
    if (this.userCookie === 'accepter' || this.userCookie === 'refuser') {
      // console.log('✔ Cookie déjà choisi (memory) → pas d’affichage');
      this.show = false;
      return;
    }

    // 🍪 afficher banner
    // console.log('🍪 Affichage banner cookie');

    setTimeout(() => {
      this.show = true;
      document.body.classList.add('modal-open');
    }, 1200);
  }

  // =========================
  // ACTIONS
  // =========================
  accept(): void {
    this.saveChoice('accepter');
  }

  refuse(): void {
    this.saveChoice('refuser');
  }

  private saveChoice(value: 'accepter' | 'refuser'): void {

    if (!this.userKey) {
      this.close();
      this.notify('Connexion requise');
      return;
    }

    const url = `http://localhost:3000/api/auth/cookie/${this.userKey}`;

    this.http.put(url, { cookie: value }).subscribe({
      next: (res) => {

        // console.log('✅ COOKIE SAVED:', res);

        // 🔥 sync state
        this.userCookie = value;

        // 💾 IMPORTANT : persist localStorage
        localStorage.setItem('cookie_choice', value);

        // 🧹 UI cleanup
        this.close();
        this.notify(`Cookies ${value}`);

      },

      error: (err) => {
        console.error('❌ ERROR COOKIE:', err);

        this.close();
        this.notify('Erreur serveur');
      }
    });
  }

  // =========================
  // UI
  // =========================
  close(): void {
    this.show = false;
    document.body.classList.remove('modal-open');
  }

  notify(msg: string): void {
    this.notificationMessage = msg;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 4000);
  }

  closeNotification(): void {
    this.showNotification = false;
  }
}