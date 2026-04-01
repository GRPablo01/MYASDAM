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

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);

      this.userKey = utilisateur.key || null;

      // ✅ IMPORTANT : normalisation
      this.userCookie = (utilisateur.cookie || '').trim();

      // console.log("🍪 Cookie utilisateur :", this.userCookie);

      // ✅ CONDITION PRINCIPALE
      if (!this.userCookie) {
        this.delayedShow();
      } else {
        this.show = false;
      }

    } else {
      // console.log("⚠️ Aucun utilisateur → affichage bannière");
      this.delayedShow();
    }
  }

  private delayedShow(): void {
    setTimeout(() => {
      this.show = true;
      this.toggleBodyModal(true);
    }, 1500);
  }

  accept(): void {
    this.updateCookie('accepter');
  }

  refuse(): void {
    this.updateCookie('refuser');
  }

  private updateCookie(value: 'accepter' | 'refuser'): void {

    // ✅ Si pas connecté → fallback local
    if (!this.userKey) {
      console.warn("⚠️ Aucun utilisateur connecté");

      this.saveCookieLocal(value);

      this.show = false;
      this.toggleBodyModal(false);
      this.showNotificationMessage(`Cookies ${value} !`);
      return;
    }

    const url = `http://localhost:3000/api/user/cookie/${this.userKey}`;

    this.http.put(url, { cookie: value }).subscribe({
      next: () => {
        this.saveCookieLocal(value);

        this.show = false;
        this.toggleBodyModal(false);
        this.showNotificationMessage(`Cookies ${value} !`);
      },
      error: err => {
        console.error("❌ Erreur :", err);

        this.show = false;
        this.toggleBodyModal(false);
        this.showNotificationMessage(`Erreur lors du choix des cookies`);
      }
    });
  }

  // ✅ Factorisation propre
  private saveCookieLocal(value: string) {
    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);
      utilisateur.cookie = value;
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    }
  }

  private toggleBodyModal(active: boolean): void {
    if (active) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  showNotificationMessage(message: string) {
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