import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EquipeService, Equipe } from '../../../../Backend/Services/equipe.service';

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
  localisationPreview: 'Domicile' | 'Exterieur' = 'Exterieur';

  backendUrl = 'http://localhost:3000';

  // 🔐 Gestion thème dynamique
  isLoggedIn = false;
  theme: 'clair' | 'sombre' = 'sombre';

  // 🎨 Couleurs dynamiques
  Background = '';
  Background1 = '';
  Background2 = '';
  Background3 = '';
  Background4 = '';
  Background5 = '';
  Background6 = '';
  Background7 = '';
  Background8 = '';
  Background9 = '';
  icon = '';
  BorderHeader = '';
  BorderHeader1 = '';
  BorderHeader2 = '';
  Text = '';

  stadesDomicile = [
    'stade de danjoutin',
    "stade d'andelnans"
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private equipeService: EquipeService
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

    // 🔥 Récupérer user depuis localStorage
    this.loadUserTheme();

    // 🔥 Appliquer le thème
    this.setThemeColors();

    // 🔥 Charger équipes
    this.equipeService.getEquipes().subscribe({
      next: data => this.equipes = data,
      error: err => console.error(err)
    });

    // 🔥 Détection domicile / extérieur
    this.matchForm.get('lieu')?.valueChanges.subscribe((lieu: string) => {
      if (!lieu) return;

      const lieuNormalise = this.normaliserTexte(lieu);

      const estDomicile = this.stadesDomicile
        .map(s => this.normaliserTexte(s))
        .includes(lieuNormalise);

      this.localisationPreview = estDomicile ? 'Domicile' : 'Exterieur';

      this.matchForm.patchValue({
        localisationMatch: this.localisationPreview
      }, { emitEvent: false });
    });

    // 🔥 Logo équipe domicile
    this.matchForm.get('equipeDom')?.valueChanges.subscribe(() => {
      this.updateLogo('dom');
    });

    // 🔥 Logo équipe extérieur
    this.matchForm.get('equipeExt')?.valueChanges.subscribe(() => {
      this.updateLogo('ext');
    });
  }

  // ============================================
  // 🔐 Récupération du thème utilisateur
  // ============================================
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
    } catch (error) {
      console.error('Erreur parsing user localStorage', error);
      this.theme = 'sombre';
    }
  }

  // ============================================
  // 🔥 Normalisation texte
  // ============================================
  normaliserTexte(texte: string): string {
    return texte
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  updateLogo(type: 'dom' | 'ext') {

    const nomEquipe = type === 'dom'
      ? this.matchForm.value.equipeDom
      : this.matchForm.value.equipeExt;

    const equipe = this.equipes.find(e => e.nom === nomEquipe);
    if (!equipe) return;

    const logoUrl = equipe.logo
      ? `${this.backendUrl}/${equipe.logo.replace(/^\/?uploads\//, 'uploads/')}`
      : '';

    if (type === 'dom') {
      this.matchForm.patchValue({ logoDom: logoUrl }, { emitEvent: false });
    } else {
      this.matchForm.patchValue({ logoExt: logoUrl }, { emitEvent: false });
    }
  }

  toggleMatchForm() {
    this.showMatchForm = !this.showMatchForm;
  }

  creerMatch() {

    if (this.matchForm.invalid) {
      console.warn('⛔ Formulaire invalide');
      return;
    }

    this.http.post(`${this.backendUrl}/api/matchs`, this.matchForm.value).subscribe({

      next: (res: any) => {

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

  // ============================================
  // 🎨 Gestion thème dynamique
  // ============================================
  private setThemeColors(): void {

    // 🌙 THÈME SOMBRE
    if (this.theme === 'sombre') {

      this.Background = '#1E293B';
      this.BorderHeader = '2px solid #64748B';
      this.Text = '#FFFFFF';

      this.Background1 = 'linear-gradient(135deg,#6978b8,#818fd5)';
      this.Background2 = '#6978b8';
      this.Background3 = '#818fd5';
      this.Background4 = '#64748B';

      this.Background5 = '#1E293B';
      this.icon = '#FFFFFF';

      this.Background6 = '#818fd5';
      this.Background7 = '#6978b8';
      this.Background8 = '#454f7ba1';

      this.BorderHeader1 = '2px solid #64748B';
      this.Background9 = '#505c91';
      this.BorderHeader2 = '2px dotted #64748B';

      return;
    }

    // 🔆 THÈME CLAIR
    this.Background = '#FFFFFF';
    this.BorderHeader = '2px solid #A80303';
    this.Text = '#000000';

    this.Background1 = 'linear-gradient(135deg,#DC2626,#BE123C)';
    this.Background2 = '#DC2626';
    this.Background3 = '#BE123C';
    this.Background4 = '#A80303';

    this.Background5 = '#FFFFFF';
    this.icon = '#DC2626';

    this.Background6 = '#BE123C';
    this.Background7 = '#DC2626';
    this.Background8 = '#c9c8c8b3';

    this.BorderHeader1 = '2px solid #A80303';
    this.Background9 = '#F3F4F6';
    this.BorderHeader2 = '2px dotted #A80303';
  }
}
