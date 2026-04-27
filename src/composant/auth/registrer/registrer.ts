import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../priver/icon/icon';
import { ThemeService } from '../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-registrer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    Icon
  ],
  templateUrl: './registrer.html',
  styleUrls: ['./registrer.css']
})
export class Registrer implements OnInit {

  registerForm!: FormGroup;

  showPassword = false;
  isSubmitting = false;

  currentStep = 1;

  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  stepLabels = ['Identité', 'Connexion', 'Rôle', 'Finaliser'];

  roles = ['joueur', 'entraineur', 'admin', 'invité'];

  equipes = [
    'U6', 'U7', 'U8', 'U9',
    'U10', 'U11', 'U12',
    'U13', 'U13F', 'U18',
    'U23', 'SeniorA',
    'SeniorB', 'SeniorD'
  ];

  codeParRole: { [key: string]: string } = {
    joueur: 'Joueur2026',
    entraineur: 'Coach2026',
    admin: 'Admin2026'
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public themeservice: ThemeService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /* ======================================================
      FORMULAIRE
  ====================================================== */

  initForm(): void {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      role: ['joueur', Validators.required],
      equipe: [''],
      codeAcces: [''],

      poste: [''],
      numeroMaillot: [''],

      club: ['ASDAM'],
      key: [''],
      theme: ['light'],
      status: ['présent']
    });
  }

  /* ======================================================
      ETAPES
  ====================================================== */

  nextStep(): void {
    if (this.currentStep < 4) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  /* ======================================================
      PASSWORD
  ====================================================== */

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): number {
    const pwd = this.registerForm.get('password')?.value || '';
    let score = 0;

    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    return score;
  }

  getPasswordStrengthText(): string {
    switch (this.getPasswordStrength()) {
      case 1: return 'Très faible';
      case 2: return 'Faible';
      case 3: return 'Moyen';
      case 4: return 'Fort';
      default: return '';
    }
  }

  /* ======================================================
      VALIDATION ETAPES
  ====================================================== */

  isStep1Valid(): boolean {
    return !!(
      this.registerForm.get('nom')?.valid &&
      this.registerForm.get('prenom')?.valid
    );
  }

  isStep2Valid(): boolean {
    return !!(
      this.registerForm.get('email')?.valid &&
      this.registerForm.get('password')?.valid
    );
  }

  isStep3Valid(): boolean {
    const role = this.registerForm.get('role')?.value;

    if (role === 'invité') return true;

    if (!this.isCodeValid()) return false;

    if (role === 'admin') return true;

    return !!this.registerForm.get('equipe')?.value;
  }

  isStep4Valid(): boolean {
    return !!this.registerForm.get('club')?.value;
  }

  /* ======================================================
      ROLE
  ====================================================== */

  onRoleChange(): void {
    const role = this.registerForm.get('role')?.value;

    if (role === 'invité') {
      this.registerForm.patchValue({
        equipe: '',
        codeAcces: ''
      });
    }

    if (role === 'admin') {
      this.registerForm.patchValue({
        equipe: 'ALL',
        codeAcces: ''
      });
    }

    if (role === 'joueur' || role === 'entraineur') {
      this.registerForm.patchValue({
        equipe: '',
        codeAcces: ''
      });
    }
  }

  isCodeValid(): boolean {
    const role = this.registerForm.get('role')?.value;
    const code = this.registerForm.get('codeAcces')?.value;

    if (!role || !code) return true;

    return this.codeParRole[role] === code;
  }

  /* ======================================================
      THEME
  ====================================================== */

  toggleTheme(): void {
    this.themeservice.toggleTheme();
  }

  /* ======================================================
      SUBMIT
  ====================================================== */

  onSubmit(): void {

    this.message = null;
    this.messageType = null;

    if (this.registerForm.invalid) {
      this.messageType = 'error';
      this.message = 'Veuillez remplir correctement les champs';
      return;
    }

    const role = this.registerForm.value.role;
    const codeAcces = this.registerForm.value.codeAcces;
    const equipe = this.registerForm.value.equipe;

    if (role !== 'invité') {
      if (!codeAcces) {
        this.messageType = 'error';
        this.message = 'Code accès obligatoire';
        return;
      }

      if (!this.isCodeValid()) {
        this.messageType = 'error';
        this.message = 'Code accès incorrect';
        return;
      }
    }

    if ((role === 'joueur' || role === 'entraineur') && !equipe) {
      this.messageType = 'error';
      this.message = 'Equipe obligatoire';
      return;
    }

    if (role === 'admin') {
      this.registerForm.get('equipe')?.setValue('ALL');
    }

    if (role === 'invité') {
      this.registerForm.patchValue({
        equipe: '',
        codeAcces: ''
      });
    }

    this.isSubmitting = true;

    const formData = { ...this.registerForm.value };

    this.http.post<any>(
      'http://localhost:3000/api/auth/register',
      formData
    ).subscribe({

      next: (res) => {

        this.isSubmitting = false;

        if (!res?.user) {
          this.messageType = 'error';
          this.message = 'Erreur serveur';
          return;
        }

        this.messageType = 'success';
        this.message = 'Inscription réussie 🎉';

        localStorage.setItem(
          'utilisateur',
          JSON.stringify(res.user)
        );

        localStorage.setItem(
          'theme',
          res.user.theme || 'light'
        );

        this.registerForm.reset({
          role: 'joueur',
          theme: 'light',
          status: 'présent'
        });

        this.currentStep = 1;

        setTimeout(() => {
          this.router.navigate(['/connexion']);
        }, 1500);
      },

      error: (err) => {

        this.isSubmitting = false;
        this.messageType = 'error';

        if (err.status === 409) {
          this.message = 'Email déjà utilisé';
        } else if (err.status === 0) {
          this.message = 'Serveur inaccessible';
        } else {
          this.message = err.error?.message || 'Erreur inscription';
        }
      }
    });
  }
}