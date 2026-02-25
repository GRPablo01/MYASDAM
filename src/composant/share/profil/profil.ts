import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Utilisateur {
  nom: string;
  prenom: string;
  photoProfil?: string;
  theme?: 'clair' | 'sombre';
  role?: string;
  email?: string;
  statut?: 'en ligne' | 'ne pas déranger' | 'absent'; // ← ajouté
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.html',
  styleUrls: ['./profil.css'],
  standalone: true,
  imports: [CommonModule],
})
export class Profil implements OnInit {

  dropdownOpen = false;
  utilisateur: Utilisateur | null = null;

  theme: 'clair' | 'sombre' = 'clair';

  // Infos utilisateur
  nom = '';
  prenom = '';
  role = '';
  email = '';
  initials = '';
  statut: 'en ligne' | 'ne pas déranger' | 'absent' = 'en ligne'; // ← ajouté

  // 🎨 Couleurs dynamiques utilisées dans ton HTML
  Text = '';
  Background = '';
  Background1 = '';
  Background2 = '';
  Background3 = '';
  Background4 = '';
  TextRouge = '';
  borderligne = '';
  StatutColor = ''; // couleur pour afficher le statut

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
    this.setThemeColors();
  }

  /** Chargement utilisateur */
  private loadUser(): void {
    const userStr = localStorage.getItem('utilisateur');

    // 🔴 NON CONNECTÉ
    if (!userStr) {
      this.utilisateur = null;
      this.setStatutColor();
      return;
    }

    // 🟢 CONNECTÉ
    try {
      const user: Utilisateur = JSON.parse(userStr);
      this.utilisateur = user;

      this.nom = user.nom || '';
      this.prenom = user.prenom || '';
      this.role = user.role || '';
      this.email = user.email || '';
      this.statut = user.statut || 'en ligne'; // ← récupère le statut

      if (user.theme === 'clair' || user.theme === 'sombre') {
        this.theme = user.theme;
      }

      this.generateInitials();
      this.setStatutColor();

    } catch (error) {
      console.error('Erreur parsing utilisateur', error);
      this.utilisateur = null;
      this.setStatutColor();
    }
  }

  /** Génération initiales */
  private generateInitials(): void {
    const n = this.nom.trim().charAt(0).toUpperCase();
    const p = this.prenom.trim().charAt(0).toUpperCase();
    this.initials = (n || '') + (p || '');
  }

  /** Toggle menu */
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /** Fermer si clic extérieur */
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#userButton') && !target.closest('#dropdownMenu')) {
      this.dropdownOpen = false;
    }
  }

  /** Changement thème */
  changeTheme(nouveauTheme: 'clair' | 'sombre'): void {
    this.theme = nouveauTheme;

    if (this.utilisateur) {
      this.utilisateur.theme = nouveauTheme;
      localStorage.setItem('utilisateur', JSON.stringify(this.utilisateur));
    }

    this.setThemeColors();
  }

  /** Changer statut */
  changeStatut(nouveauStatut: 'en ligne' | 'ne pas déranger' | 'absent'): void {
    this.statut = nouveauStatut;

    if (this.utilisateur) {
      this.utilisateur.statut = nouveauStatut;
      localStorage.setItem('utilisateur', JSON.stringify(this.utilisateur));
    }

    this.setStatutColor();
  }

  /** Définir couleur du statut pour affichage */
  private setStatutColor(): void {
    switch (this.statut) {
      case 'en ligne':
        this.StatutColor = '#22C55E'; // vert
        break;
      case 'ne pas déranger':
        this.StatutColor = '#F87171'; // rouge
        break;
      case 'absent':
        this.StatutColor = '#FBBF24'; // jaune/orange
        break;
      default:
        this.StatutColor = '#94A3B8'; // gris neutre
    }
  }

  /** 🎨 Gestion des thèmes */
  private setThemeColors(): void {

    // 🔴 1️⃣ NON CONNECTÉ
    if (!this.utilisateur) {
      this.Background  = '#475569';
      this.Background1 = '#334155';
      this.Background2 = '#475569';
      this.Background3 = '#64748B';

      this.Text = '#FFFFFF';
      this.TextRouge = '#F87171';
      this.borderligne = '#94A3B8';
      return;
    }

    // 🌙 2️⃣ CONNECTÉ + SOMBRE
    if (this.theme === 'sombre') {
      this.Background  = '#0F172A';
      this.Background1 = '#6978b8';
      this.Background2 = '#0F172A';
      this.Background3 = '#334155';
      this.Background4 = '#6978b8';

      this.Text = '#FFFFFF';
      this.TextRouge = '#F87171';
      this.borderligne = '#334155';
    }

    // ☀️ 3️⃣ CONNECTÉ + CLAIR
    else {
      this.Background  = '#DC2626';
      this.Background1 = '#a80303';
      this.Background2 = '#DC2626';
      this.Background3 = '#FFFFFF';
      this.Background4 = '#DC2626';

      this.Text = '#000';
      this.TextRouge = '#DC2626';
      this.borderligne = '#CBD5E1';
    }
  }

  /** Déconnexion */
  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/connexion']);
  }
}