import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../priver/icon/icon';

interface Role {
  id: string;
  label: string;
  features: string[];
  description: string;
}

interface User {
  id?: string;
  nom?: string;
  role?: string;
  theme?: string;
}

@Component({
  selector: 'app-fonctionalite',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './fonctionalite.html',
  styleUrl: './fonctionalite.css',
})
export class Fonctionalite implements OnInit {

  // ===============================
  // USER
  // ===============================
  user: User | null = null;
  userRole: string = '';
  userTheme: string = 'clair';
  theme: 'clair' | 'sombre' = 'clair';

  // ===============================
  // COULEURS GLOBALES
  // ===============================
  Logo = '';
  Forme = '';

  Background: string = '';
  Background1: string = '';
  Background2: string = '';
  Background3: string = '';
  Background4: string = '';
  Background5: string = '';
  Background6: string = '';
  Background7: string = '';
  Background8: string = '';
  Background9: string = '';
  Background10: string = '';
  Background11: string = '';
  Background12: string = '';

  Text: string = '';
  Text1: string = '';
  Text2: string = '';
  Text3: string = '';

  BorderHeader: string = '';
  BorderHeader1: string = '';
  BorderHeader2: string = '';
  BorderHeader3: string = '';

  backgroundDegrade1: string = '';
  backgroundDegrade2: string = '';

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
    this.loadUserFromLocalStorage();
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  private loadUserFromLocalStorage(): void {
    const userData = localStorage.getItem('utilisateur');

    if (!userData) {
      console.warn('Aucun utilisateur dans le localStorage');
      this.setThemeColors();
      return;
    }

    try {
      this.user = JSON.parse(userData);
      this.userRole = this.user?.role || '';
      this.userTheme = this.user?.theme || 'clair';
      this.theme = this.userTheme === 'sombre' ? 'sombre' : 'clair';
    } catch (error) {
      console.error('Erreur parsing utilisateur:', error);
    }

    this.setThemeColors();
  }

  // ===============================
  // THEMES
  // ===============================
  private setThemeColors(): void {

    // 🔴 NON CONNECTÉ
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
      return;
    }

    // 🌙 SOMBRE
    if (this.theme === 'sombre') {

      this.Background  = '#1E293B';
      this.Text = '#FFFFFF';

      this.Background1 = '#6978b8';
      this.Background2 = '#6978b8';
      this.Background3 = '#6978b8';
      this.Background4 = '#6978b8';
      this.Background5 = '#6978b8';

      this.BorderHeader = '2px solid #64748B';
      this.Text1 = '#6978b8';

      this.Background6 = '#334155';

      this.Background7 = '#6978b8';
      this.Background8 = '#334155';
      this.BorderHeader1 = '2px solid #6978b8';

      this.Background9 = '#334155';
      this.BorderHeader2 = '2px solid #6978b8';

      this.BorderHeader3 = '2px solid #6978b8';
      this.Background10 = '#6978b8';
      this.Background11 = '#64748B';

      this.Background12 = '#6978b8';
      return;
    }

    // ☀️ CLAIR
    this.Background  = '#FFFFFF';
    this.Text = '#000000';

    this.Background1 = '#DC2626';
    this.Background2 = '#DC2626';
    this.Background3 = '#DC2626';
    this.Background4 = '#DC2626';
    this.Background5 = '#DC2626';

    this.BorderHeader = '2px solid #a80303';
    this.Text1 = '#DC2626';

    this.Background6 = '#e9e6e6';

    this.Background7 = '#DC2626';
    this.Background8 = '#e9e6e6';
    this.BorderHeader1 = '2px solid #DC2626';

    this.Background9 = '#e9e6e6';
    this.BorderHeader2 = '2px solid #DC2626';

    this.BorderHeader3 = '2px solid #DC2626';
    this.Background10 = '#DC2626';
    this.Background11 = '#a3464680';

    this.Background12 = '#DC2626';
  }

  // ===============================
  // ROLES
  // ===============================
  roles: Role[] = [
    {
      id: 'joueur',
      label: 'Joueur',
      features: [
        'Consulter le calendrier des matchs',
        'Voir les statistiques personnelles',
        'Accéder aux feuilles de match',
        'Communiquer avec l\'équipe'
      ],
      description: 'Accès complet aux fonctionnalités liées à votre participation et progression personnelle.'
    },
    {
      id: 'entraineur',
      label: 'Entraineur',
      features: [
        'Gérer les compositions d\'équipe',
        'Analyser les statistiques collectives',
        'Planifier les entraînements',
        'Valider les présences'
      ],
      description: 'Outils avancés pour la gestion tactique et l\'analyse de performance collective.'
    },
    {
      id: 'inviter',
      label: 'Invité',
      features: [
        'Voir les matchs publics',
        'Consulter les résultats',
        'Accéder aux informations de base'
      ],
      description: 'Consultation des informations publiques sans accès aux données sensibles du club.'
    },
    {
      id: 'admin',
      label: 'Administrateur',
      features: [
        'Gérer les utilisateurs',
        'Configurer les paramètres',
        'Accès aux statistiques globales',
        'Gestion des droits d\'accès'
      ],
      description: 'Contrôle total sur la plateforme et gestion complète des aspects du club.'
    }
  ];

  private roleColors: { [key: string]: string } = {
    joueur: '#dc2626',
    entraineur: '#2563eb',
    inviter: '#059669',
    admin: '#7c3aed'
  };

  private roleIcons: { [key: string]: string } = {
    joueur: '⚽',
    entraineur: '📋',
    inviter: '👁️',
    admin: '⚡'
  };

  private accessLevels: { [key: string]: number } = {
    joueur: 60,
    entraineur: 80,
    inviter: 30,
    admin: 100
  };

  getRoleColor(roleId: string): string {
    return this.roleColors[roleId] || '#dc2626';
  }

  getRoleIcon(roleId: string): string {
    return this.roleIcons[roleId] || '●';
  }

  getAccessLevel(roleId: string): number {
    return this.accessLevels[roleId] || 50;
  }
}
