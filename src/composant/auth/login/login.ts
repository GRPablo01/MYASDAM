import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../priver/icon/icon';
import { ThemeService } from '../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    Icon
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm!: FormGroup;

  showPassword = false;
  isHovered = false;
  isLoading = false;

  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public themeservice: ThemeService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  // ==========================
  // CONNEXION
  // ==========================
  onSubmit(): void {

    this.message = null;
    this.messageType = null;

    if (this.loginForm.invalid) {
      this.messageType = 'error';
      this.message = 'Veuillez remplir correctement tous les champs';
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.http.post<any>(
      'http://localhost:3000/api/auth/login',
      this.loginForm.value
    )
    .subscribe({
      next: (res) => {

        this.isLoading = false;

        if (!res?.token || !res?.user) {
          this.messageType = 'error';
          this.message = 'Erreur inattendue lors de la connexion';
          return;
        }

        const utilisateur = {
          key: res.user.key,
          nom: res.user.nom,
          prenom: res.user.prenom,
          email: res.user.email,
          role: res.user.role,
          equipe: res.user.equipe,
          status: res.user.status,
          cookie: res.user.cookie || ''
        };

        localStorage.setItem('token', res.token);
        localStorage.setItem(
          'utilisateur',
          JSON.stringify(utilisateur)
        );

        this.messageType = 'success';
        this.message = 'Connexion réussie';

        this.loginForm.reset();

        setTimeout(() => {
          this.router.navigate(['/accueil']);
        }, 1000);
      },

      error: (err) => {

        this.isLoading = false;
        this.messageType = 'error';

        if (err.status === 404) {
          this.message = 'Utilisateur introuvable';
        } else if (err.status === 401) {
          this.message = 'Mot de passe incorrect';
        } else if (err.status === 0) {
          this.message = 'Impossible de contacter le serveur';
        } else {
          this.message =
            err.error?.message ||
            'Erreur lors de la connexion';
        }
      }
    });
  }

  // ==========================
  // PASSWORD
  // ==========================
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ==========================
  // THEME GLOBAL SERVICE
  // ==========================
  toggleTheme(): void {
    this.themeservice.toggleTheme();
  }

  get isDarkMode(): boolean {
    return this.themeservice.isDarkMode;
  }

  // ==========================
  // GOOGLE
  // ==========================
  loginWithGoogle(): void {
    window.location.href =
      'http://localhost:3000/api/auth/google';
  }

  // ==========================
  // FACEBOOK
  // ==========================
  loginWithFacebook(): void {
    window.location.href =
      'http://localhost:3000/api/auth/facebook';
  }

  // ==========================
  // STYLE HELPERS
  // ==========================
  darkenColor(color: string, amount: number): string {

    color = color.replace('#', '');

    const num = parseInt(color, 16);

    let r = (num >> 16) - amount;
    let g = ((num >> 8) & 255) - amount;
    let b = (num & 255) - amount;

    r = Math.max(r, 0);
    g = Math.max(g, 0);
    b = Math.max(b, 0);

    return `#${(
      (r << 16) |
      (g << 8) |
      b
    )
      .toString(16)
      .padStart(6, '0')}`;
  }
}