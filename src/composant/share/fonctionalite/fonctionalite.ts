import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../priver/icon/icon';
import { ThemeService } from '../../../../Backend/Services/theme.service';

interface Role {
  id: string;
  label: string;
  features: string[];
  description: string;
  icon: string;
}

interface User {
  id?: string;
  nom?: string;
  role?: string;
}

@Component({
  selector: 'app-fonctionalite',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './fonctionalite.html',
  styleUrls: ['./fonctionalite.css'],
})
export class Fonctionalite implements OnInit {

  user: User | null = null;
  userRole: string = '';
  selectedRole: Role | null = null;
  showLoginModal: boolean = false;

  roles: Role[] = [
    {
      id: 'joueur',
      label: 'Joueur',
      icon: 'fas fa-user',
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
      icon: 'fas fa-chess-knight',
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
      icon: 'fas fa-eye',
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
      icon: 'fas fa-shield-alt',
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

  private roleIconsFA: { [key: string]: string } = {
    joueur: 'fas fa-futbol',
    entraineur: 'fas fa-clipboard-list',
    inviter: 'fas fa-eye',
    admin: 'fas fa-crown'
  };

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    // ✅ Rien à faire pour le thème → déjà géré dans ThemeService (constructor)
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  private loadUserFromLocalStorage(): void {
    const userData = localStorage.getItem('utilisateur');
    if (!userData) return;

    try {
      this.user = JSON.parse(userData);
      this.userRole = this.user?.role || '';
    } catch (error) {
      console.error('Erreur parsing utilisateur:', error);
    }
  }

  getRoleColor(roleId: string): string {
    return this.roleColors[roleId] || '#dc2626';
  }

  getRoleIcon(roleId: string): string {
    return this.roleIconsFA[roleId] || 'fas fa-user';
  }

  openRoleModal(role: Role): void {
    this.selectedRole = role;
    document.body.style.overflow = 'hidden';
  }

  closeRoleModal(event?: MouseEvent): void {
    if (!event || event.target === event.currentTarget) {
      this.selectedRole = null;
      document.body.style.overflow = 'auto';
    }
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  requestRoleAccess(role: Role): void {
    alert(`Demande d'accès envoyée pour le rôle: ${role.label}`);
  }
}