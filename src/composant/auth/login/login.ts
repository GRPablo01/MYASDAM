import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  loginForm: FormGroup;

  // ✅ messages propres
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  currentStep = 1;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    console.log('💡 Login component initialisé');

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    console.log('📝 Formulaire créé', this.loginForm.value);
  }

  onSubmit(): void {
    console.log('🚀 Soumission du formulaire', this.loginForm.value);

    // 🔄 reset message AVANT toute action
    this.message = null;
    this.messageType = null;

    if (this.loginForm.invalid) {
      console.warn('⚠️ Formulaire invalide');
      this.messageType = 'error';
      this.message = 'Veuillez remplir correctement tous les champs';
      return;
    }

    this.http
      .post<any>('http://localhost:3000/api/auth/login', this.loginForm.value)
      .subscribe({
        next: (res) => {
          console.log('✅ Réponse du serveur', res);

          if (!res?.token || !res?.user) {
            this.messageType = 'error';
            this.message = 'Erreur inattendue lors de la connexion';
            return;
          }

          // ✅ SUCCÈS
          this.messageType = 'success';
          this.message = 'Connexion réussie 🎉';

          const utilisateur = {
            nom: res.user.nom,
            prenom: res.user.prenom,
            email: res.user.email,
            role: res.user.role,
            club: res.user.club,
            theme: res.user.theme,
            equipe: res.user.equipe,
            initiales: res.user.initiales,
            key: res.user.key,
            status: res.user.status,
            compte: res.user.compte,
            compteDesactiveTime: res.user.compteDesactiveTime,
            suivis: res.user.suivis || [],
            abonnements: res.user.abonnements || [],
            poste: res.user.poste,
          };

          console.log('💾 Sauvegarde utilisateur', utilisateur);
          localStorage.setItem('utilisateur', JSON.stringify(utilisateur));

          this.loginForm.reset();
          console.log('🧹 Formulaire réinitialisé');

          // ➡️ Redirection
          setTimeout(() => {
            this.router.navigate(['/accueil']);
          }, 1000);
        },

        error: (err) => {
          console.error('❌ Erreur connexion', err);

          this.messageType = 'error';

          if (err.status === 404) {
            this.message = 'Utilisateur introuvable';
          } else if (err.status === 401) {
            this.message = 'Mot de passe incorrect';
          } else if (err.status === 0) {
            this.message = 'Impossible de contacter le serveur';
          } else {
            this.message = 'Erreur lors de la connexion';
          }
        },
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
