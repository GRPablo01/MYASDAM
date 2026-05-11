import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../priver/icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


interface Role {
  id?: string;           // pour rôles classiques
  ids?: string[];        // pour rôles multiples (admin + superadmin)
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
  isModalOpen: boolean = false;
  isHoverClose: boolean = false;
  hoveredFeature: number | null = null;

  // Définition des rôles
  roles: Role[] = [
    {
      id: 'joueur',
      label: 'Joueur',
      icon: 'fas fa-user',
      features: [
        'Consulter le calendrier',
        'Suivre les résultats de l’équipe',
        'Accéder à ta convocation'
      ],
      description: 'Accès complet aux fonctionnalités liées à votre participation et progression personnelle.'
    },
    {
      id: 'entraineur',
      label: 'Entraineur',
      icon: 'fas fa-chess-knight',
      features: [
        'Gérer les compositions d\'équipe',
        'Organiser les matchs et les entraînements',
        'Planifier les évents'
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
      ids: ['admin', 'superadmin'], // <-- Admin et SuperAdmin combinés
      label: 'Administrateur',
      icon: 'fas fa-shield-alt',
      features: ['Accès complet à toutes les fonctionnalités de la plateforme'],
      description: 'Contrôle total sur la plateforme et gestion complète des aspects du club.'
    }
  ];

  // Sélectionner seulement les 3 rôles visibles principaux
  visibleRoles: Role[] = this.roles
    .filter(r => !r.ids) // exclure le rôle admin/superadmin
    .slice(0, 3);

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

  closeRoleModal(event?: MouseEvent): void {
    if (!event || event.target === event.currentTarget) {
      this.selectedRole = null;
      document.body.style.overflow = 'auto';
    }
  }

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  adjustColor(color: string, amount: number = -20): string {
    let usePound = false;
  
    if (color[0] === "#") {
      color = color.slice(1);
      usePound = true;
    }
  
    const num = parseInt(color, 16);
  
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
  
    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);
  
    return (usePound ? "#" : "") +
      ((r << 16) | (g << 8) | b)
        .toString(16)
        .padStart(6, "0");
  }

  openRoleModal(role: Role): void {
    this.selectedRole = role;
    this.isModalOpen = true; // 🔥 Important pour ouvrir la modal
    document.body.style.overflow = 'hidden';
  }

  // Vérifier si l'utilisateur est admin ou superadmin
  isSuperUser(): boolean {
    return this.roles.some(r => r.ids?.includes(this.userRole));
  }

  openedFeaturePopup: string | null = null;

toggleFeaturePopup(roleId: string | null): void {

  if (this.openedFeaturePopup === roleId) {
    this.openedFeaturePopup = null;
  } else {
    this.openedFeaturePopup = roleId;
  }

}
}