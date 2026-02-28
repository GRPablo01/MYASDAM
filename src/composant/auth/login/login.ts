import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../priver/icon/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink,Icon],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  isDarkMode: boolean = false;
  showPassword: boolean = false;
  isHovered = false;
  
  // Messages
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  // 🎨 Couleurs dynamiques
  Backgroundprincipal = '';
  Backgroundcards = '';
  Textprincipal = '';
  Textsecondaire = '';
  Rougeprincipal = '';
  Rougehover = '';
  Rougesoftbackground = '';
  Bordernormal = '';
  Borderfocusrouge = '';
  Borderhoverdouce = '';
  Iconnormal = '';
  Iconhover = '';
  Iconactive = '';
  Fondboutonprincipal = '';
  Fondboutonsecondaire = '';
  Cardhover = '';
  Sidebarlienhover = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'sombre';
    }
    
    this.setThemeColors();
  }

  // 🔹 Soumission du formulaire
  onSubmit(): void {
    this.message = null;
    this.messageType = null;

    if (this.loginForm.invalid) {
      this.messageType = 'error';
      this.message = 'Veuillez remplir correctement tous les champs';
      return;
    }

    this.http
      .post<any>('http://localhost:3000/api/auth/login', this.loginForm.value)
      .subscribe({
        next: (res) => {
          if (!res?.token || !res?.user) {
            this.messageType = 'error';
            this.message = 'Erreur inattendue lors de la connexion';
            return;
          }

          this.messageType = 'success';
          this.message = 'Connexion réussie 🎉';

          const utilisateur = {
            nom: res.user.nom,
            prenom: res.user.prenom,
            email: res.user.email,
            role: res.user.role,
            theme: res.user.theme
          };

          localStorage.setItem('token', res.token);
          localStorage.setItem('utilisateur', JSON.stringify(utilisateur));

          this.loginForm.reset();

          setTimeout(() => {
            this.router.navigate(['/accueil']);
          }, 1000);
        },
        error: (err) => {
          this.messageType = 'error';
          if (err.status === 404) this.message = 'Utilisateur introuvable';
          else if (err.status === 401) this.message = 'Mot de passe incorrect';
          else if (err.status === 0) this.message = 'Impossible de contacter le serveur';
          else this.message = err.error?.message || 'Erreur lors de la connexion';
        }
      });
  }

  // 🔹 Afficher / masquer le mot de passe
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔹 Toggle thème clair/sombre
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'sombre' : 'clair');
    this.setThemeColors();
  }

  // 🎨 Gestion des couleurs selon le thème
  setThemeColors(): void {
    if (this.isDarkMode) {
      // 🌙 SOMBRE
      this.Backgroundprincipal = '#121212';
      this.Backgroundcards = '#1E1E1E';
      this.Textprincipal = '#F5F5F5';
      this.Textsecondaire = '#B3B3B3';
      this.Rougeprincipal = '#C1121F';
      this.Rougehover = '#FF4D4D';
      this.Rougesoftbackground = '#2A0F12';
      this.Bordernormal = '1px solid #2A2A2A';
      this.Borderfocusrouge = '1px solid #C1121F';
      this.Borderhoverdouce = '1px solid #3A3A3A';
      this.Iconnormal = '#CFCFCF';
      this.Iconhover = '#FF4D4D';
      this.Iconactive = '#C1121F';
      this.Fondboutonprincipal = '#FF4D4D';
      this.Fondboutonsecondaire = '#2A0F12';
      this.Cardhover = '#242424';
      this.Sidebarlienhover = '#2A0F12';
    } else {
      // ☀️ CLAIR
      this.Backgroundprincipal = '#F4F6F8';
      this.Backgroundcards = '#FFFFFF';
      this.Textprincipal = '#1A1A1A';
      this.Textsecondaire = '#555555';
      this.Rougeprincipal = '#C1121F';
      this.Rougehover = '#E5383B';
      this.Rougesoftbackground = '#FDEBEC';
      this.Bordernormal = '1px solid #E5E7EB';
      this.Borderfocusrouge = '1px solid #C1121F';
      this.Borderhoverdouce = '1px solid #D1D5DB';
      this.Iconnormal = '#444444';
      this.Iconhover = '#C1121F';
      this.Iconactive = '#C1121F';
      this.Fondboutonprincipal = '#E5383B';
      this.Fondboutonsecondaire = '#FDEBEC';
      this.Cardhover = '#F9FAFB';
      this.Sidebarlienhover = '#FDEBEC';
    }
  }

  // 🔹 Connexion avec Google
  loginWithGoogle(): void {
    // Implémenter la logique OAuth Google
    console.log('Connexion avec Google...');
    // window.location.href = 'http://localhost:3000/api/auth/google';
  }

  // 🔹 Connexion avec Facebook
  loginWithFacebook(): void {
    // Implémenter la logique OAuth Facebook
    console.log('Connexion avec Facebook...');
    // window.location.href = 'http://localhost:3000/api/auth/facebook';
  }
}