import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Icon } from '../../priver/icon/icon';

@Component({
  selector: 'app-registrer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink, Icon],
  templateUrl: './registrer.html',
  styleUrls: ['./registrer.css']
})
export class Registrer implements OnInit {

  registerForm!: FormGroup;
  isDarkMode: boolean = false;
  showPassword: boolean = false;
  isSubmitting: boolean = false;
  isHovered = false;

  // Messages
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  currentStep: number = 1;
  stepLabels: string[] = ['Identité', 'Connexion', 'Rôle', 'Finaliser'];

  roles: string[] = ['joueur', 'entraineur', 'admin', 'invité'];

  equipes: string[] = [
    'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12',
    'U13', 'U13F', 'U18', 'U23', 'SeniorA', 'SeniorB', 'SeniorD'
  ];

  // Codes d'accès fixes par rôle
  codeParRole: { [role: string]: string } = {
    joueur: 'Joueur2026',
    entraineur: 'Coach2026',
    admin: 'Admin2026'
  };

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
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['joueur', Validators.required],
      poste: [''],
      numeroMaillot: [''],
      club: ['ASDAM'],
      equipe: [''],
      codeAcces: [''],
      key: [''],
      theme: ['clair'],
      status: ['présent']
    });

    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'sombre';
    }
    
    this.setThemeColors();
  }

  /* 🔄 étapes */
  nextStep(): void { 
    if (this.currentStep < 4) this.currentStep++; 
  }
  
  prevStep(): void { 
    if (this.currentStep > 1) this.currentStep--; 
  }
  
  goToStep(step: number): void { 
    if (step < this.currentStep) this.currentStep = step; 
  }

  /* 👁️ password */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /* ✅ validation des étapes */
  isStep1Valid(): boolean {
    return !!(this.registerForm.get('nom')?.valid && this.registerForm.get('prenom')?.valid);
  }
  
  isStep2Valid(): boolean {
    return !!(this.registerForm.get('email')?.valid && this.registerForm.get('password')?.valid);
  }
  
  isStep3Valid(): boolean {
    const role = this.registerForm.get('role')?.value;
    if (role === 'invité') return true;
    
    const codeValid = this.isCodeValid();
    const equipe = this.registerForm.get('equipe')?.value;
    return !!role && codeValid && !!equipe;
  }
  
  isStep4Valid(): boolean {
    return !!(this.registerForm.get('club')?.value && this.registerForm.get('theme')?.value);
  }

  /* 🎭 rôle changé */
  onRoleChange(): void {
    const role = this.registerForm.get('role')?.value;
    if (role === 'invité') {
      this.registerForm.get('equipe')?.setValue('');
      this.registerForm.get('codeAcces')?.setValue('');
    } else if (role === 'admin') {
      this.registerForm.get('equipe')?.setValue('ALL');
      this.registerForm.get('codeAcces')?.setValue('');
    } else {
      this.registerForm.get('codeAcces')?.setValue('');
      this.registerForm.get('equipe')?.setValue('');
    }
  }

  /* 🔑 validation code d'accès selon rôle */
  isCodeValid(): boolean {
    const role = this.registerForm.get('role')?.value;
    const code = this.registerForm.get('codeAcces')?.value;
    if (!role || !code) return true;
    return this.codeParRole[role] === code;
  }

  /* 🚀 soumission */
  onSubmit(): void {
    this.message = null;
    this.messageType = null;

    if (this.registerForm.invalid) {
      this.messageType = 'error';
      this.message = 'Veuillez remplir correctement tous les champs';
      return;
    }

    const role = this.registerForm.get('role')?.value;
    const codeAcces = this.registerForm.get('codeAcces')?.value;
    const equipe = this.registerForm.get('equipe')?.value;

    if (role === 'joueur' || role === 'entraineur') {
      if (!codeAcces) {
        this.messageType = 'error';
        this.message = 'Le code d\'accès est obligatoire pour ce rôle';
        return;
      }
      if (!this.isCodeValid()) {
        this.messageType = 'error';
        this.message = 'Code d\'accès incorrect pour le rôle sélectionné';
        return;
      }
      if (!equipe) {
        this.messageType = 'error';
        this.message = 'L\'équipe est obligatoire pour ce rôle';
        return;
      }
    }

    if (role === 'admin') {
      if (!codeAcces) {
        this.messageType = 'error';
        this.message = 'Le code d\'accès est obligatoire pour l\'admin';
        return;
      }
      if (!this.isCodeValid()) {
        this.messageType = 'error';
        this.message = 'Code d\'accès incorrect pour l\'admin';
        return;
      }
      this.registerForm.get('equipe')?.setValue('ALL');
    }

    if (role === 'invité') {
      this.registerForm.get('equipe')?.setValue('');
      this.registerForm.get('codeAcces')?.setValue('');
    }

    this.isSubmitting = true;

    const formData = { ...this.registerForm.value };
    ['poste', 'numeroMaillot', 'club', 'equipe', 'key', 'codeAcces']
      .forEach(field => {
        if (!formData[field]) delete formData[field];
      });

    this.http.post<any>('http://localhost:3000/api/auth/register', formData)
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (!res?.user) {
            this.messageType = 'error';
            this.message = 'Erreur inattendue : utilisateur non retourné';
            return;
          }
          this.messageType = 'success';
          this.message = 'Inscription réussie 🎉';
          
          const utilisateur = {
            nom: res.user.nom,
            prenom: res.user.prenom,
            email: res.user.email,
            role: res.user.role,
            club: res.user.club,
            theme: res.user.theme,
            equipe: res.user.equipe,
            codeAcces: res.user.codeAcces,
            initiales: res.user.initiales,
            key: res.user.key,
            status: res.user.status,
            compte: res.user.compte,
            compteDesactiveTime: res.user.compteDesactiveTime,
            poste: res.user.poste,
          };
          
          localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
          localStorage.setItem('theme', res.user.theme);
          
          this.registerForm.reset({
            role: 'joueur',
            theme: 'clair',
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
            this.message = 'Impossible de contacter le serveur';
          } else {
            this.message = err.error?.message || 'Erreur lors de l\'inscription';
          }
        }
      });
  }

  /* 🔐 force mot de passe */
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
}