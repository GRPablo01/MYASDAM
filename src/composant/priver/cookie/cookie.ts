import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
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

  showNotification = false;
  notificationMessage = '';
  notificationProgress: number = 100;
  private notificationInterval: any;

  userKey: string | null = null;
  userCookie: string = '';
  userRole: string = '';

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.handleDisplayLogic();
  }

  // =============================
  // INIT USER
  // =============================
  private initUser(): void {
    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);

      this.userKey = utilisateur.key || null;
      this.userRole = (utilisateur.role || '').toLowerCase().trim();
      this.userCookie = (utilisateur.cookie || '').trim();
    } else {
      // invité
      this.userKey = null;
      this.userRole = 'guest';
      this.userCookie = localStorage.getItem('cookie_choice') || '';
    }
  }

  // =============================
  // AFFICHAGE TEMPLATE
  // =============================
  private handleDisplayLogic(): void {

    // ❌ super-admin → jamais affiché
    if (this.userRole === 'super-admin') {
      this.show = false;
      return;
    }

    // ✅ si aucun choix → on affiche
    if (!this.userCookie) {
      this.delayedShow();
    } else {
      this.show = false;
    }
  }

  private delayedShow(): void {
    setTimeout(() => {
      this.show = true;
      this.toggleBodyModal(true);
    }, 1500);
  }

  // =============================
  // ACTIONS
  // =============================
  accept(): void {
    this.updateCookie('accepter');
  }

  refuse(): void {
    this.updateCookie('refuser');
  }

  private updateCookie(value: 'accepter' | 'refuser'): void {

    // ✅ utilisateur non connecté → localStorage uniquement
    if (!this.userKey) {
      this.saveCookieLocal(value);

      this.closeBanner();
      this.showNotificationMessage(`Cookies ${value} !`);
      return;
    }

    const url = `http://localhost:3000/api/user/cookie/${this.userKey}`;

    this.http.put(url, { cookie: value }).subscribe({
      next: () => {
        this.saveCookieLocal(value);
        this.closeBanner();
        this.showNotificationMessage(`Cookies ${value} !`);
      },
      error: err => {
        console.error("❌ Erreur :", err);
        this.closeBanner();
        this.showNotificationMessage(`Erreur lors du choix des cookies`);
      }
    });
  }

  // =============================
  // LOCAL STORAGE
  // =============================
  private saveCookieLocal(value: string): void {
    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);
      utilisateur.cookie = value;
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    } else {
      localStorage.setItem('cookie_choice', value);
    }
  }

  // =============================
  // UI
  // =============================
  private closeBanner(): void {
    this.show = false;
    this.toggleBodyModal(false);
  }

  private toggleBodyModal(active: boolean): void {
    if (active) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  showNotificationMessage(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  closeNotification(): void {
    this.showNotification = false;
    clearInterval(this.notificationInterval);
    this.notificationProgress = 100;
  }
}