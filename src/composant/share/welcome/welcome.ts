// welcome.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatchService, Match } from '../../../../Backend/Services/match.service';
import { Icon } from '../../priver/icon/icon';

interface Utilisateur {
  nom?: string;
  prenom?: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, Icon],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome implements OnInit {

  constructor(private matchService: MatchService) {}

  // 🔐 Utilisateur
  utilisateur: Utilisateur | null = null;
  isLoggedIn = false;

  nom = '';
  prenom = '';
  initiales = '';
  theme: 'clair' | 'sombre' = 'clair';

  // 📱 Responsive
  isMobile = false;

  // 🎨 Couleurs dynamiques
  Background = '';
  Background1 = '';
  Background2 = '';
  Background3 = '';
  Background4 = '';
  Background5 = '';
  BorderHeader = '';
  BorderHeader1 = '';
  Text = '';
  Text1 = '';
  Text2 = '';

  // 🎠 Carrousel
  matchs: Match[] = [];
  currentMatch = 0;
  totalMatches = 0;

  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();
    this.loadMatchs();
  }

  // 📱 Détection mobile
  detectMobile(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  /**
   * 🔹 Charger utilisateur depuis localStorage
   */
  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (storedUser) {
      try {
        this.utilisateur = JSON.parse(storedUser);
        this.isLoggedIn = true;

        this.nom = this.utilisateur?.nom || '';
        this.prenom = this.utilisateur?.prenom || '';
        this.initiales = this.getInitiales(this.nom, this.prenom);

        this.theme =
          this.utilisateur?.theme === 'sombre' ||
          this.utilisateur?.theme === 'clair'
            ? this.utilisateur.theme
            : 'clair';

      } catch (error) {
        console.error('Erreur parsing utilisateur :', error);
        this.utilisateur = null;
        this.isLoggedIn = false;
        this.theme = 'clair';
      }
    } else {
      this.utilisateur = null;
      this.isLoggedIn = false;
      this.theme = 'clair';
    }

    this.setThemeColors();
  }

  // 🔤 Initiales
  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

  /**
   * 🎨 Gestion des thèmes
   */
  private setThemeColors(): void {

    // 🔴 1️⃣ NON CONNECTÉ
    if (!this.isLoggedIn) {

      this.Background  = '#1E293B';
      this.Text = '#FFFFFF';
      this.Background1 = '#6978b8';
      this.BorderHeader = '#334155';
      this.Text1 = '#6978b8';
      this.Text2 = '#6978b8';
      this.Background3 = '#64748B';
      this.Background4 = '#334155';
      this.Background5 = '#334155';
      this.BorderHeader1 = '2px solid #6978b8';


      // this.Background1 = '#334155';
      // this.Background2 = '#475569';
      // this.Background3 = '#64748B';
      // this.Background4 = '#334155';
      // this.BorderHeader = '#334155';
      

      return;
    }

    // 🌙 2️⃣ CONNECTÉ + SOMBRE
    if (this.theme === 'sombre') {

      this.Background  = '#1E293B';
      this.Text = '#FFFFFF';
      this.Background1 = '#6978b8';
      this.BorderHeader = '#64748B';
      this.Text1 = '#6978b8';
      this.Background3 = '#334155';
      this.Background4 = '#6978b8';
      this.Text2 = '#6978b8';
      this.Background5 = '#64748B';
      this.BorderHeader1 = '2px solid #6978b8';


      // this.Background1 = '#6978b8';
      // this.Background2 = '#0F172A';
      // this.Background3 = '#334155';
      // this.Background4 = '#6978b8';
      

      return;
    }

    // ☀️ 3️⃣ CONNECTÉ + CLAIR
    this.Background  = '#FFFFFF';
    this.Text = '#000000';
    this.Background1 = '#a80303';
    this.BorderHeader = '#64748B';
    this.Text1 = '#DC2626';
    this.Text2 = '#DC2626';
    this.Background3 = '#FFFFFF';
    this.Background4 = '#DC2626';

    this.Background5 = '#334155';
      this.BorderHeader1 = '2px solid #DC2626';

    // this.Background1 = '#a80303';
    // this.Background2 = '#DC2626';
    // this.Background3 = '#FFFFFF';
    // this.Background4 = '#DC2626';
    
  }

  /**
   * ⚽ Charger les matchs
   */
  private loadMatchs(): void {
    this.matchService.getMatchs().subscribe({
      next: (data) => {
        this.matchs = data;
        this.totalMatches = data.length;
      },
      error: (err) => {
        console.error('Erreur récupération matchs :', err);
      }
    });
  }

  // 🎠 Navigation carrousel
  nextMatch(): void {
    if (!this.totalMatches) return;
    this.currentMatch = (this.currentMatch + 1) % this.totalMatches;
  }

  prevMatch(): void {
    if (!this.totalMatches) return;
    this.currentMatch =
      (this.currentMatch - 1 + this.totalMatches) % this.totalMatches;
  }

  goToMatch(index: number): void {
    this.currentMatch = index;
  }

  // Méthodes utilitaires pour le téléphone mockup

// Méthodes pour le mockup téléphone

/**
 * Retourne l'index du match suivant
 */
getNextIndex(): number {
  if (!this.totalMatches) return 0;
  return (this.currentMatch + 1) % this.totalMatches;
}

/**
 * Génère les initiales d'une équipe
 */
getTeamInitials(teamName: string | undefined): string {
  if (!teamName) return '?';
  
  // Si c'est un acronyme déjà court (ASDAM, PSG, etc.)
  if (teamName.length <= 4) return teamName.toUpperCase();
  
  // Sinon prend les 3 premières lettres
  return teamName.substring(0, 3).toUpperCase();
}

/**
 * Retourne une couleur de gradient basée sur le nom de l'équipe
 */
getTeamColor(teamName: string | undefined): string {
  if (!teamName) return 'linear-gradient(135deg, #666 0%, #333 100%)';
  
  // Couleurs prédéfinies pour certaines équipes
  const colors: { [key: string]: string } = {
    'ASDAM': 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    'Paris Saint-Germain': 'linear-gradient(135deg, #004170 0%, #002540 100%)',
    'PSG': 'linear-gradient(135deg, #004170 0%, #002540 100%)',
    'Olympique de Marseille': 'linear-gradient(135deg, #00bfff 0%, #0080ff 100%)',
    'OM': 'linear-gradient(135deg, #00bfff 0%, #0080ff 100%)',
  };
  
  if (colors[teamName]) return colors[teamName];
  
  // Génère une couleur unique basée sur le nom
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `linear-gradient(135deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue}, 70%, 30%) 100%)`;
}

/**
 * Retourne une possession simulée (à remplacer par vraies données)
 */
getPossession(): number {
  // Si tu as des données réelles, utilise-les ici
  return 50 + Math.floor(Math.random() * 20); // Entre 50% et 70%
}

/**
 * Retourne un nombre de tirs simulé (à remplacer par vraies données)
 */
getTirs(): number {
  // Si tu as des données réelles, utilise-les ici
  return Math.floor(Math.random() * 15) + 5; // Entre 5 et 20
}


}
