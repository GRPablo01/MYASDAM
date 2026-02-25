import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Icon } from "../../priver/icon/icon";

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

interface Utilisateur {
  role?: string;
  theme?: 'clair' | 'sombre';
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule, Icon],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav implements OnInit {

  utilisateur: Utilisateur | null = null;

  userRole: string = 'invité';
  navLinks: NavLink[] = [];
  isLoggedIn: boolean = false;

  // 🔹 Theme
  userTheme: 'clair' | 'sombre' | null = null;
  theme: 'clair' | 'sombre' = 'clair';

  // Couleurs dynamiques
  Text = '';
  Text1 = '';
  Background = '';
  Background1 = '';
  Background2 = '';
  Logo = '';
  borderligne = '';

  private roleLinks: { [role: string]: NavLink[] } = {

    joueur: [
      { label: 'Accueil', path: '/accueil', icon: 'fas fa-home' },
      { label: 'Actualité', path: '/actus', icon: 'fas fa-newspaper' },
      { label: 'Communiquer', path: '/commun', icon: 'fas fa-comments' },
      { label: 'Matchs', path: '/match', icon: 'fas fa-futbol' },
      { label: 'Classement', path: '/classe', icon: 'fas fa-trophy' },
    ],

    entraineur: [
      { label: 'Accueil', path: '/accueil', icon: 'fas fa-home' },
      { label: 'Équipe', path: '/equipe', icon: 'fas fa-users' },
      { label: 'Statistiques', path: '/stats', icon: 'fas fa-chart-bar' },
      { label: 'Calendrier', path: '/calendrier', icon: 'fas fa-calendar-alt' },
      { label: 'Communiquer', path: '/commun', icon: 'fas fa-comments' },
    ],

    admin: [
      { label: 'Accueil', path: '/accueil', icon: 'fas fa-home' },
      { label: 'Actualité', path: '/actus', icon: 'fas fa-newspaper' },
      { label: 'Matchs', path: '/match', icon: 'fas fa-futbol' },
      { label: 'Classement', path: '/classe', icon: 'fas fa-trophy' },
      { label: 'Gestion Utilisateurs', path: '/gestion-utilisateurs', icon: 'fas fa-users-cog' },
      { label: 'Administration', path: '/admin', icon: 'fas fa-cogs' },
    ],

    invité: [
      { label: 'Accueil', path: '/accueil', icon: 'fas fa-home' },
      { label: 'Actualité', path: '/actus', icon: 'fas fa-newspaper' },
      { label: 'Matchs', path: '/match', icon: 'fas fa-futbol' },
      { label: 'Classement', path: '/classe', icon: 'fas fa-trophy' },
    ],
  };

  ngOnInit(): void {
    this.loadUser();
    this.setThemeColors();
  }

  /** 🔹 Chargement utilisateur */
  private loadUser(): void {

    const utilisateurStr = localStorage.getItem('utilisateur');

    // 🔴 NON CONNECTÉ
    if (!utilisateurStr) {
      this.utilisateur = null;
      this.userTheme = null;
      this.userRole = 'invité';
      this.navLinks = this.roleLinks['invité'];
      return;
    }

    // 🟢 CONNECTÉ
    try {
      const utilisateur: Utilisateur = JSON.parse(utilisateurStr);
      this.utilisateur = utilisateur;
      this.isLoggedIn = true;

      // 🔹 Rôle
      this.userRole = (utilisateur.role || '').toLowerCase();
      if (!this.userRole || !this.roleLinks[this.userRole]) {
        this.userRole = 'invité';
      }
      this.navLinks = this.roleLinks[this.userRole];

      // 🔹 Thème
      this.userTheme = utilisateur.theme || null;
      if (this.userTheme === 'clair' || this.userTheme === 'sombre') {
        this.theme = this.userTheme;
      }

    } catch (error) {
      console.error('Erreur parsing utilisateur', error);
      this.userRole = 'invité';
      this.navLinks = this.roleLinks['invité'];
      this.theme = 'clair';
      this.userTheme = null;
    }
  }

  /** 🎨 Gestion thème dynamique */
  private setThemeColors(): void {

    // 🔴 1️⃣ NON CONNECTÉ
    if (!this.utilisateur) {
      this.Background  = '#475569';
      this.Background1 = '#6978b8';
      this.Text = '#FFFFFF';
      this.Text1 = '#FFFFFF';
      this.borderligne = '1px solid #475569';
      this.Logo = 'assets/IconGris.svg';
      return;
    }

    // 🌙 2️⃣ CONNECTÉ + SOMBRE
    if (this.theme === 'sombre') {
      this.Background  = '#0F172A';
      this.Background1 = '#6978b8';
      this.Text = '#FFFFFF';
      this.Text1 = '#FFFFFF';
      this.borderligne = '1px solid #334155';
      this.Logo = 'assets/IconBlanc.svg';
    }

    // ☀️ 3️⃣ CONNECTÉ + CLAIR
    else {
      this.Background  = '#DC2626';
      this.Background1 = '#DC2626';
      this.Text = '#000000';
      this.Text1 = '#FFFFFF';
      this.borderligne = '1px solid #E5E7EB';
      this.Logo = 'assets/IconBlack.svg';
    }
  }



  hoverIndex: number = -1;

getLinkStyle(isActive: boolean, index: number) {
  if (isActive) {
    return {
      color: 'white',
      background: this.Background1
    };
  } else if (this.hoverIndex === index) {
    return {
      color: 'white',
      background: this.Background1
    };
  } else {
    return {
      color: this.Text,
      background: 'transparent'
    };
  }
}
}
