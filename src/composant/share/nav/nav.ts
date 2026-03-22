import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Icon } from "../../priver/icon/icon";
import { Router } from '@angular/router';
import { ThemeService } from '../../../../Backend/Services/theme.service';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

interface Utilisateur {
  role?: string;
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
  hoverIndex: number = -1;

  constructor(
    private router: Router,
    public themeService: ThemeService
  ) {}

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
      { label: 'Actualité', path: '/actus', icon: 'fas fa-newspaper' },
      { label: 'Communiquer', path: '/commun', icon: 'fas fa-comments' },
      { label: 'Matchs', path: '/match', icon: 'fas fa-futbol' },
      { label: 'Classement', path: '/classe', icon: 'fas fa-trophy' },
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
  }

  private loadUser(): void {

    const utilisateurStr = localStorage.getItem('utilisateur');

    if (!utilisateurStr) {
      this.userRole = 'invité';
      this.navLinks = this.roleLinks['invité'];
      return;
    }

    try {
      const utilisateur: Utilisateur = JSON.parse(utilisateurStr);
      this.utilisateur = utilisateur;
      this.isLoggedIn = true;

      this.userRole = (utilisateur.role || '').toLowerCase();
      if (!this.userRole || !this.roleLinks[this.userRole]) {
        this.userRole = 'invité';
      }

      this.navLinks = this.roleLinks[this.userRole];

    } catch {
      this.userRole = 'invité';
      this.navLinks = this.roleLinks['invité'];
    }
  }

  getLinkStyle(isActive: boolean, index: number) {

    if (isActive) {
      return {
        background: this.themeService.primary,
        color: '#FFF'
      };
    }

    if (this.hoverIndex === index) {
      return {
        background: this.themeService.Sidebarlienhover,
        color: this.themeService.Textprincipal
      };
    }

    return {
      background: 'transparent',
      color: this.themeService.Textprincipal
    };
  }
}