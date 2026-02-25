import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
  userCookie: 'accepted' | 'refused' | '' = ''; // ✅ accepte maintenant '' comme valeur
  userTheme: 'clair' | 'sombre' = 'sombre';

  Background = '';
  Background1 = '';
  Border = '';
  Text = '';
  Logo = '';

  constructor(
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const utilisateurString = localStorage.getItem('utilisateur');

    if (utilisateurString) {
      const utilisateur = JSON.parse(utilisateurString);

      this.userKey = utilisateur.key || null;
      this.userCookie = utilisateur.cookie ?? '';
      this.userTheme = utilisateur.theme || 'sombre';

      // console.log("🔑 userKey :", this.userKey);
      // console.log("🍪 userCookie :", this.userCookie);
      // console.log("🎨 userTheme :", this.userTheme);

      this.applyTheme(this.userTheme);

      // ✅ Affiche la bannière uniquement si cookie vide
      if (this.userCookie === '') {
        
        this.delayedShow();
      } else {
        
        this.show = false;
      }
    } else {
      console.log("⚠️ Aucun utilisateur trouvé → affichage bannière");
      this.applyTheme('sombre');
      this.delayedShow();
    }
  }

  private delayedShow(): void {
    setTimeout(() => {
      console.log("⏳ Bannière affichée");
      this.show = true;
      this.toggleBodyModal(true);
    }, 2000);
  }

  private applyTheme(theme: 'clair' | 'sombre'): void {
   

    if (theme === 'sombre') {
      this.Background = '#334155';
      this.Background1 = '#6978b8';
      this.Border = '2px solid #6978b8';
      this.Text = '#FFFFFF';
      this.Logo = 'assets/IconBlanc.svg';
    } else {
      this.Background = '#e9e6e6';
      this.Background1 = '#DC2626';
      this.Border = '2px solid #DC2626';
      this.Text = '#000000';
      this.Logo = 'assets/IconBlack.svg';
    }
  }

  accept(): void {
    
    this.updateCookie('accepted');
  }

  refuse(): void {
    
    this.updateCookie('refused');
  }

  private updateCookie(value: 'accepted' | 'refused'): void {

    if (!this.userKey) {
      console.warn("⚠️ Aucun utilisateur connecté");
      return;
    }

    console.log("📡 Envoi API → valeur :", value);

    const url = `http://localhost:3000/api/user/cookie/${this.userKey}`;

    this.http.put(url, { cookie: value }).subscribe({
      next: (res) => {
        

        const utilisateurString = localStorage.getItem('utilisateur');

        if (utilisateurString) {
          const utilisateur = JSON.parse(utilisateurString);
          utilisateur.cookie = value;
          localStorage.setItem('utilisateur', JSON.stringify(utilisateur));

          
        }

        this.show = false;
        this.toggleBodyModal(false);
      },
      error: err => {
        console.error("❌ Erreur mise à jour cookie :", err);
      }
    });
  }

  private toggleBodyModal(active: boolean): void {
    console.log("🔒 Modal active :", active);

    if (active) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }
}
