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

  // =========================
// LOG URL
// =========================
private logUrl = 'http://localhost:3000/api/logs';

/* ======================================================
    USER CONNECTÉ
====================================================== */

getCurrentUser(): any {

  const user = localStorage.getItem('utilisateur');

  return user
    ? JSON.parse(user)
    : {
        prenom: 'Inconnu',
        nom: '',
        role: 'unknown'
      };
}

/* ======================================================
    SUBMIT + LOG
====================================================== */

onSubmit(): void {

  // console.log('🚀 onSubmit déclenché');

  this.message = null;
  this.messageType = null;

  // =========================
  // VALIDATION FORMULAIRE
  // =========================
  if (this.registerForm.invalid) {

    // console.log('❌ Formulaire invalide', this.registerForm.value);

    this.messageType = 'error';
    this.message = 'Veuillez remplir correctement les champs';
    return;
  }

  // console.log('✅ Formulaire valide', this.registerForm.value);

  const role = this.registerForm.value.role;
  const codeAcces = this.registerForm.value.codeAcces;
  const equipe = this.registerForm.value.equipe;

  // console.log('ℹ️ Rôle sélectionné :', role);

  // =========================
  // VALIDATION CODE ACCÈS
  // =========================
  if (role !== 'invité') {

    // console.log('🔐 Vérification code accès...');

    if (!codeAcces) {
      // console.log('❌ Code accès manquant');
      this.messageType = 'error';
      this.message = 'Code accès obligatoire';
      return;
    }

    if (!this.isCodeValid()) {
      // console.log('❌ Code accès invalide');
      this.messageType = 'error';
      this.message = 'Code accès incorrect';
      return;
    }

    // console.log('✅ Code accès valide');
  }

  // =========================
  // VALIDATION ÉQUIPE
  // =========================
  if ((role === 'joueur' || role === 'entraineur') && !equipe) {

    console.log('❌ Équipe obligatoire pour ce rôle');

    this.messageType = 'error';
    this.message = 'Equipe obligatoire';
    return;
  }

  // console.log('✅ Validation équipe OK');

  // =========================
  // ADMIN
  // =========================
  if (role === 'admin') {
    // console.log('🛠️ Admin détecté → équipe forcée ALL');
    this.registerForm.get('equipe')?.setValue('ALL');
  }

  // =========================
  // INVITÉ
  // =========================
  if (role === 'invité') {
    // console.log('👤 Invité détecté → reset champs équipe/code');

    this.registerForm.patchValue({
      equipe: '',
      codeAcces: ''
    });
  }

  this.isSubmitting = true;

  const formData = { ...this.registerForm.value };

  // console.log('📦 Données envoyées au backend :', formData);

  // =========================
  // REGISTER
  // =========================
  this.http.post<any>(
    'http://localhost:3000/api/auth/register',
    formData
  ).subscribe({

    next: (res) => {

      // console.log('📩 Réponse backend reçue :', res);

      this.isSubmitting = false;

      // =========================
      // 🔥 FIX IMPORTANT ICI
      // =========================
      const userId = res.userId || res.user?._id || res.user?.id;

      if (!userId) {
        // console.log('❌ Aucun userId dans la réponse');

        this.messageType = 'error';
        this.message = 'Erreur serveur : userId manquant';
        return;
      }

      // console.log('🎉 Inscription réussie userId :', userId);

      // =========================
      // USER LOCAL STORAGE SAFE
      // =========================
      const user = {
        _id: userId,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        role: formData.role,
        equipe: formData.equipe
      };

      localStorage.setItem('utilisateur', JSON.stringify(user));
      localStorage.setItem('theme', 'light');

      // console.log('💾 User sauvegardé en localStorage');

      // =========================
      // SUCCESS MESSAGE
      // =========================
      this.messageType = 'success';
      this.message = 'Inscription réussie 🎉';

      // =========================
      // LOG
      // =========================
      const currentUser = this.getCurrentUser();

      const logData = {
        user: `${currentUser.prenom || 'Inconnu'} ${currentUser.nom || ''}`,
        role: currentUser.role || formData.role || 'unknown',
        action: 'REGISTER_USER',
        description: `${formData.prenom} ${formData.nom} s'est inscrit avec le rôle ${formData.role}`,
        type: 'CREATE',
        field: 'user',
        newValue: {
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          role: formData.role,
          equipe: formData.equipe
        },
        date: new Date()
      };

      // console.log('📝 Log envoyé :', logData);

      this.http.post(this.logUrl, logData).subscribe({
        next: () => console.log('✅ Log inscription créé'),
        error: (err) => console.error('❌ Erreur log inscription', err)
      });

      // =========================
      // RESET FORM
      // =========================
      this.registerForm.reset({
        role: 'joueur',
        theme: 'light',
        status: 'présent'
      });

      this.currentStep = 1;

      // console.log('🔄 Formulaire reset + step 1');

      // =========================
      // REDIRECTION
      // =========================
      setTimeout(() => {

        // console.log('➡️ Redirection vers /accueil');

        this.router.navigate(['/accueil']);

      }, 1500);
    },

    error: (err) => {

      this.isSubmitting = false;

      console.error('❌ Erreur backend inscription :', err);

      this.messageType = 'error';

      if (err.status === 409) {
        this.message = 'Email déjà utilisé';
        // console.log('⚠️ Email déjà utilisé');

      } else if (err.status === 0) {
        this.message = 'Serveur inaccessible';
        // console.log('⚠️ Serveur inaccessible');

      } else {
        this.message = err.error?.message || 'Erreur inscription';
        // console.log('⚠️ Erreur inconnue');
      }
    }
  });
}
}