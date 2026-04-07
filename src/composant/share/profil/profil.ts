import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Icon } from "../../priver/icon/icon";
import { ThemeService } from '../../../../Backend/Services/theme.service';

interface Utilisateur {
  nom: string;
  prenom: string;
  photoProfil?: string;
  role?: string;
  email?: string;
  statut?: 'en ligne' | 'ne pas déranger' | 'absent';
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.html',
  styleUrls: ['./profil.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, Icon, RouterLink],
})
export class Profil implements OnInit {

  utilisateur: Utilisateur | null = null;

  menuOpen = false;

  nom = '';
  prenom = '';
  role = '';
  email = '';
  initials = '';

  statut: 'en ligne' | 'ne pas déranger' | 'absent' = 'en ligne';
  StatutColor = '';

  unreadMessagesCount: number = 3;
  currentYear: number = new Date().getFullYear();

  constructor(
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.setStatutColor();
  }

  /**
   * Chargement utilisateur depuis localStorage
   */
  private loadUser(): void {
    const userStr = localStorage.getItem('utilisateur');
    if (!userStr) return;

    try {
      const user: Utilisateur = JSON.parse(userStr);
      this.utilisateur = user;

      this.nom = user.nom || '';
      this.prenom = user.prenom || '';
      this.role = user.role || 'supporter';
      this.email = user.email || '';
      this.statut = user.statut || 'en ligne';

      this.generateInitials();
    } catch (error) {
      console.error('Erreur parsing utilisateur', error);
    }
  }

  /**
   * Génération des initiales
   */
  private generateInitials(): void {
    const n = this.nom?.charAt(0)?.toUpperCase() || '';
    const p = this.prenom?.charAt(0)?.toUpperCase() || '';
    this.initials = n + p;
  }

  /**
   * Toggle menu utilisateur
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Formate le rôle
   */
  formatRole(role: string | null | undefined): string {
    if (!role || role === 'Inviter') return 'Supporter';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  /**
   * Fermer menu
   */
  closeMenu(): void {
    this.menuOpen = false;
  }

  /**
   * Fermer menu si clic extérieur
   */
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#userMenuButton') && !target.closest('#userMenuDropdown')) {
      this.menuOpen = false;
    }
  }

  /**
   * Changer statut utilisateur
   */
  changeStatut(nouveauStatut: 'en ligne' | 'ne pas déranger' | 'absent'): void {
    this.statut = nouveauStatut;
    if (this.utilisateur) {
      this.utilisateur.statut = nouveauStatut;
      localStorage.setItem('utilisateur', JSON.stringify(this.utilisateur));
    }
    this.setStatutColor();
  }

  /**
   * Définir couleur du statut
   */
  private setStatutColor(): void {
    switch (this.statut) {
      case 'en ligne': this.StatutColor = '#22C55E'; break;
      case 'ne pas déranger': this.StatutColor = '#EF4444'; break;
      case 'absent': this.StatutColor = '#F59E0B'; break;
      default: this.StatutColor = '#94A3B8'; break;
    }
  }

  /**
   * Déconnexion
   */
  deconnecter(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/connexion']);
  }

  /**
   * Label du statut
   */
  getStatutLabel(): string {
    switch (this.statut) {
      case 'en ligne': return 'En ligne';
      case 'ne pas déranger': return 'Ne pas déranger';
      case 'absent': return 'Absent';
      default: return 'Hors ligne';
    }
  }

  /**
   * Gradient selon le rôle
   */
  getRoleGradient(role: string): string {
    const gradients: Record<string, string> = {
      'superadmin': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      'admin': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      'entraineur': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'joueur': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      'inviter': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
    };
    return gradients[role] || gradients['inviter'];
  }

  /**
   * Background badge rôle
   */
  getRoleBadgeBg(role: string): string {
    const colors: Record<string, string> = {
      'superadmin': 'rgba(251, 191, 36, 0.15)',
      'admin': 'rgba(139, 92, 246, 0.15)',
      'entraineur': 'rgba(16, 185, 129, 0.15)',
      'joueur': 'rgba(59, 130, 246, 0.15)',
      'inviter': 'rgba(107, 114, 128, 0.15)'
    };
    return colors[role] || colors['inviter'];
  }

  /**
   * Couleur texte badge rôle
   */
  getRoleBadgeColor(role: string): string {
    const colors: Record<string, string> = {
      'superadmin': '#b45309',
      'admin': '#6d28d9',
      'entraineur': '#059669',
      'joueur': '#2563eb',
      'inviter': '#4b5563'
    };
    return colors[role] || colors['inviter'];
  }

}