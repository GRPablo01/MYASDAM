import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EquipeService, Equipe } from '../../../../Backend/Services/equipe.service';
import { ThemeService } from '../../../../Backend/Services/theme.service';

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
  hoverCard: boolean = false;
  localisationPreview: 'Domicile' | 'Exterieur' = 'Exterieur';
  isMobile = window.innerWidth <= 970;

  backendUrl = 'http://localhost:3000';

  // 🔐 Gestion thème dynamique
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
    public themeService:ThemeService,
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

    console.log("🚀 Initialisation composant CreerMatch");

    // 🔥 Récupérer user depuis localStorage
    this.loadUserTheme();

    // 🔥 Charger équipes
    console.log("📡 Appel API pour récupérer les équipes...");

    this.equipeService.getEquipes().subscribe({

      next: data => {
        console.log("✅ Équipes récupérées :", data);

        this.equipes = data;

        console.log("📊 Nombre d'équipes :", this.equipes.length);

        this.equipes.forEach(equipe => {
          console.log("⚽ Equipe :", equipe.nom, "| Logo :", equipe.logo);
        });
      },

      error: err => {
        console.error("❌ Erreur récupération équipes :", err);
      }
    });

    // 🔥 Détection domicile / extérieur
    this.matchForm.get('lieu')?.valueChanges.subscribe((lieu: string) => {

      console.log("📍 Lieu saisi :", lieu);

      if (!lieu) return;

      const lieuNormalise = this.normaliserTexte(lieu);

      const estDomicile = this.stadesDomicile
        .map(s => this.normaliserTexte(s))
        .includes(lieuNormalise);

      this.localisationPreview = estDomicile ? 'Domicile' : 'Exterieur';

      console.log("🏟 Localisation détectée :", this.localisationPreview);

      this.matchForm.patchValue({
        localisationMatch: this.localisationPreview
      }, { emitEvent: false });
    });

    // 🔥 Équipe domicile
    this.matchForm.get('equipeDom')?.valueChanges.subscribe((equipe) => {

      console.log("🏠 Équipe domicile sélectionnée :", equipe);

      this.updateLogo('dom');
    });

    // 🔥 Équipe extérieur
    this.matchForm.get('equipeExt')?.valueChanges.subscribe((equipe) => {

      console.log("✈️ Équipe extérieur sélectionnée :", equipe);

      this.updateLogo('ext');
    });
  }

  // ============================================
  // 🔐 Récupération thème utilisateur
  // ============================================
  private loadUserTheme(): void {

    const userData = localStorage.getItem('utilisateur');

    console.log("👤 Données utilisateur localStorage :", userData);

    if (!userData) {
      this.isLoggedIn = false;
      this.theme = 'sombre';
      return;
    }

    try {
      const user = JSON.parse(userData);

      console.log("👤 Utilisateur parsé :", user);

      this.isLoggedIn = true;
      this.theme = user.theme === 'clair' ? 'clair' : 'sombre';

      console.log("🎨 Thème appliqué :", this.theme);

    } catch (error) {

      console.error('❌ Erreur parsing user localStorage', error);
      this.theme = 'sombre';
    }
  }

  // ============================================
  // 🔥 Normalisation texte
  // ============================================
  normaliserTexte(texte: string): string {

    const resultat = texte
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    console.log("🔤 Texte normalisé :", resultat);

    return resultat;
  }

  updateLogo(type: 'dom' | 'ext') {

    const nomEquipe = type === 'dom'
      ? this.matchForm.value.equipeDom
      : this.matchForm.value.equipeExt;

    console.log("🔎 Recherche équipe :", nomEquipe);

    const equipe = this.equipes.find(e => e.nom === nomEquipe);

    console.log("📦 Équipe trouvée :", equipe);

    if (!equipe) {
      console.warn("⚠️ Aucune équipe trouvée pour :", nomEquipe);
      return;
    }

    const logoUrl = equipe.logo
      ? `${this.backendUrl}/${equipe.logo.replace(/^\/?uploads\//, 'uploads/')}`
      : '';

    console.log("🖼 Logo généré :", logoUrl);

    if (type === 'dom') {

      console.log("🏠 Logo domicile appliqué");

      this.matchForm.patchValue({ logoDom: logoUrl }, { emitEvent: false });

    } else {

      console.log("✈️ Logo extérieur appliqué");

      this.matchForm.patchValue({ logoExt: logoUrl }, { emitEvent: false });
    }
  }

  toggleMatchForm() {

    this.showMatchForm = !this.showMatchForm;

    console.log("📋 Formulaire affiché :", this.showMatchForm);
  }

  creerMatch() {

    console.log("📤 Tentative création match");

    if (this.matchForm.invalid) {

      console.warn("⛔ Formulaire invalide :", this.matchForm.value);

      return;
    }

    console.log("📦 Données envoyées au backend :", this.matchForm.value);

    this.http.post(`${this.backendUrl}/api/matchs`, this.matchForm.value).subscribe({

      next: (res: any) => {

        console.log("✅ Réponse serveur :", res);

        this.message = res.message || 'Match créé avec succès !';

        this.matchForm.reset({
          typeMatch: 'Amical',
          localisationMatch: 'Exterieur'
        });

        this.showMatchForm = false;

        setTimeout(() => {
          this.message = '';
        }, 3000);
      },

      error: (err) => {

        console.error('❌ ERREUR SERVEUR :', err);

        this.message = 'Erreur lors de la création du match';
      }
    });
  }
}