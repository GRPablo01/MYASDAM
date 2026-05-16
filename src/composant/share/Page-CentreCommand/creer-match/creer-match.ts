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

  // =========================
  // NOTIFICATION
  // =========================
  showNotification = false;
  notificationMessage = '';

  backendUrl = 'http://localhost:3000';

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

      // ⚠️ IMPORTANT: ici on stocke les IDs, pas les noms
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

    // ==========================
    // LOAD EQUIPES
    // ==========================
    this.equipeService.getEquipes().subscribe({
      next: data => {
        this.equipes = data || [];
        console.log("✅ équipes :", this.equipes);
      },
      error: err => {
        console.error("❌ erreur équipes :", err);
      }
    });

    // ==========================
    // LIEU -> DOMICILE / EXTERIEUR
    // ==========================
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

    // ==========================
    // EQUIPES LISTENERS
    // ==========================
    this.matchForm.get('equipeDom')?.valueChanges.subscribe((id) => {
      this.updateLogo('dom', id);
    });

    this.matchForm.get('equipeExt')?.valueChanges.subscribe((id) => {
      this.updateLogo('ext', id);
    });
  }


  // =========================
  // TOAST
  // =========================
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
  // ======================================
  // THEME
  // ======================================
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
      console.error(e);
      this.theme = 'sombre';
    }
  }

  // ======================================
  // NORMALISATION
  // ======================================
  normaliserTexte(texte: string): string {
    return texte
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // ======================================
  // LOGO (CORRIGÉ)
  // ======================================
  updateLogo(type: 'dom' | 'ext', equipeId: string) {

    if (!equipeId) return;

    // 🔥 CORRECTION IMPORTANTE : on utilise _id et pas nom
    const equipe = this.equipes.find(e => e._id === equipeId);

    if (!equipe) {
      console.warn("⚠️ équipe non trouvée :", equipeId);
      return;
    }

    const logoUrl = equipe.logo
      ? `${this.backendUrl}/${equipe.logo.replace(/^\/?uploads\//, 'uploads/')}`
      : '';

    if (type === 'dom') {
      this.matchForm.patchValue({ logoDom: logoUrl }, { emitEvent: false });
    } else {
      this.matchForm.patchValue({ logoExt: logoUrl }, { emitEvent: false });
    }
  }

  // ======================================
  // UI
  // ======================================
  toggleMatchForm() {
    this.showMatchForm = !this.showMatchForm;
  }

  // ======================================
  // CREATE MATCH
  // ======================================
  creerMatch() {

    if (this.matchForm.invalid) {
      console.error("Form invalide");
      return;
    }

    this.http.post(`${this.backendUrl}/api/matchs`, this.matchForm.value)
      .subscribe({
        next: (res: any) => {

          this.notificationMessage = res.message || 'Match créé avec succès !';
          this.showNotification = true;
        
          // reset form
          this.matchForm.reset({
            typeMatch: 'Amical',
            localisationMatch: 'Exterieur'
          });
        
          this.showMatchForm = false;
        
          // auto hide toast
          setTimeout(() => {
            this.showNotification = false;
          }, 3000);
        },

        error: (err) => {
          console.error(err);
          this.message = 'Erreur création match';
        }
      });
  }
}