import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EquipeService, Equipe } from '../../../../../Backend/Services/equipe.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-creer-match',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './creer-match.html',
  styleUrls: ['./creer-match.css'],
})
export class CreerMatch implements OnInit {

  matchForm!: FormGroup;
  message: string | null = null;

  showMatchForm = false;
  equipes: Equipe[] = [];

  hoverCard = false;
  localisationPreview: 'Domicile' | 'Exterieur' = 'Exterieur';

  isMobile = window.innerWidth <= 970;
  closing = false;
  currentStep = 1;
  hoverClose = false;

  showNotification = false;
  notificationMessage = '';

  backendUrl = 'http://localhost:3000';
  private logUrl = 'http://localhost:3000/api/logs';

  isLoggedIn = false;
  theme: 'clair' | 'sombre' = 'sombre';

  stadesDomicile = [
    'stade de danjoutin',
    "stade d'andelnans"
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private equipeService: EquipeService,
    public themeService: ThemeService,
  ) {

    this.matchForm = this.fb.group({
      date: ['', Validators.required],
      heure: ['', Validators.required],
      lieu: ['', Validators.required],
      categorie: ['', Validators.required],

      equipeDom: ['', Validators.required],
      equipeExt: ['', Validators.required],

      logoDom: [''],
      logoExt: [''],

      typeMatch: ['Amical', Validators.required],
      localisationMatch: ['Exterieur']
    });
  }

  ngOnInit(): void {

    this.loadUserTheme();

    // =========================
    // LOAD EQUIPES
    // =========================
    this.equipeService.getEquipes().subscribe({
      next: (data) => {
        this.equipes = data || [];
        console.log('✅ équipes chargées :', this.equipes);
      },
      error: (err) => {
        console.error('❌ erreur équipes :', err);
      }
    });

    // =========================
    // LOCALISATION MATCH
    // =========================
    this.matchForm.get('lieu')?.valueChanges.subscribe((lieu: string) => {

      if (!lieu) return;

      const normalise = this.normaliserTexte(lieu);

      const estDomicile = this.stadesDomicile
        .map(s => this.normaliserTexte(s))
        .includes(normalise);

      this.localisationPreview = estDomicile ? 'Domicile' : 'Exterieur';

      this.matchForm.patchValue({
        localisationMatch: this.localisationPreview
      }, { emitEvent: false });
    });

    // =========================
    // LOGOS AUTOMATIQUES
    // =========================
    this.matchForm.get('equipeDom')?.valueChanges.subscribe(id => {
      this.updateLogo('dom', id);
    });

    this.matchForm.get('equipeExt')?.valueChanges.subscribe(id => {
      this.updateLogo('ext', id);
    });
  }

  // =========================
  // THEME
  // =========================
  private loadUserTheme(): void {

    const userData = localStorage.getItem('utilisateur');

    if (!userData) {
      this.isLoggedIn = false;
      this.theme = 'sombre';
      return;
    }

    try {
      const user = JSON.parse(userData);
      this.isLoggedIn = true;
      this.theme = user.theme === 'clair' ? 'clair' : 'sombre';
    } catch (e) {
      console.error('❌ theme error', e);
      this.theme = 'sombre';
    }
  }

  // =========================
  // NORMALISATION
  // =========================
  normaliserTexte(texte: string): string {
    return (texte || '')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // =========================
  // LOGO UPDATE
  // =========================
  updateLogo(type: 'dom' | 'ext', equipeId: string) {

    if (!equipeId) return;

    const equipe = this.equipes.find(e => e._id === equipeId);

    if (!equipe) {
      console.warn('⚠️ équipe introuvable :', equipeId);
      return;
    }

    const logoUrl = equipe.logo
      ? `${this.backendUrl}/${equipe.logo.replace(/^\/?uploads\//, 'uploads/')}`
      : '';

    this.matchForm.patchValue(
      type === 'dom' ? { logoDom: logoUrl } : { logoExt: logoUrl },
      { emitEvent: false }
    );
  }

  // =========================
  // UI
  // =========================
  toggleMatchForm() {
    this.showMatchForm = !this.showMatchForm;
  }

  showToast(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 4000);
  }

  closeNotification(): void {
    this.showNotification = false;
  }

  // =========================
  // USER
  // =========================
  getCurrentUser(): any {
    const user = localStorage.getItem('utilisateur');

    return user ? JSON.parse(user) : {
      prenom: 'Inconnu',
      nom: '',
      role: 'unknown'
    };
  }

  // =========================
  // CREATE MATCH
  // =========================
  creerMatch(): void {

    console.log('🚀 START CREATE MATCH');
    console.log('📦 FORM:', this.matchForm.value);

    if (this.matchForm.invalid) {
      console.error('❌ FORM INVALID');
      return;
    }

    const payload = this.matchForm.value;
    console.log('📤 PAYLOAD:', payload);

    this.http.post(`${this.backendUrl}/api/matchs`, payload)
      .subscribe({

        next: (res: any) => {

          console.log('✅ MATCH CREATED');
          console.log('📥 RESPONSE:', res);

          this.notificationMessage = res.message || 'Match créé avec succès !';
          this.showNotification = true;

          this.matchForm.reset({
            typeMatch: 'Amical',
            localisationMatch: 'Exterieur'
          });

          this.showMatchForm = false;

          // ================= LOG =================
          const user = this.getCurrentUser();

          const logData = {
            user: `${user.prenom} ${user.nom}`,
            role: user.role,
            action: 'CREATE_MATCH',
            description: `${user.role} a créé un match`,
            type: 'CREATE',
            field: 'match',
            newValue: payload,
            date: new Date()
          };

          console.log('📝 LOG:', logData);

          this.http.post(this.logUrl, logData).subscribe({
            next: () => console.log('✅ LOG OK'),
            error: (err) => console.error('❌ LOG ERROR', err)
          });

          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
        },

        error: (err) => {
          console.error('❌ MATCH ERROR', err);
          this.message = 'Erreur création match';
        }
      });

    console.log('⏳ REQUEST SENT');
  }
}