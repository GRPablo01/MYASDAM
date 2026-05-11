import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Icon } from '../../priver/icon/icon';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { RouterLink } from '@angular/router';

interface Social {
  label: string;
  link: string;
  icon: string;
}

interface Link {
  label: string;
  url: string;
  roles?: string[];
}

interface Utilisateur {
  nom?: string;
  prenom?: string;
  theme?: 'clair' | 'sombre';
  role?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, Icon, FormsModule,RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer implements OnInit {

  constructor(public themeService: ThemeService) {}

  // ===============================
  // RESPONSIVE
  // ===============================
  isMobile = false;

  // ===============================
  // AUTH
  // ===============================
  utilisateur: Utilisateur | null = null;
  isLoggedIn = false;

  currentYear: number = new Date().getFullYear();

  nom = '';
  prenom = '';
  initiales = '';
  role = 'invite';
  theme: 'clair' | 'sombre' = 'clair';

  logoHover = false;
  isHoverCgu = false;
  isHoverMentions = false;
  isHoverConfidentialite = false;
  isHoverCookies = false;
  isHoverContact = false;

  // ===============================
  // LIENS
  // ===============================
  filteredLinks: Link[] = [];

  private allLinks: Link[] = [
    { label: 'Accueil', url: '/', roles: ['invite', 'joueur', 'entraineur', 'admin', 'superadmin'] },
    { label: 'Actualités', url: '/actualites', roles: ['invite', 'joueur', 'entraineur'] },
    { label: 'Dashboard', url: '/dashboard', roles: ['joueur', 'entraineur', 'admin', 'superadmin'] },
    { label: 'Mon équipe', url: '/equipe', roles: ['joueur', 'entraineur'] },
    { label: 'Gestion', url: '/admin', roles: ['admin', 'superadmin'] },
    { label: 'Contact', url: '/contact', roles: ['invite', 'joueur', 'entraineur'] }
  ];

  socials: Social[] = [
    { label: 'Facebook', link: 'https://facebook.com', icon: 'fa-brands fa-facebook-f' },
    { label: 'Instagram', link: 'https://instagram.com', icon: 'fa-brands fa-instagram' },
    { label: 'LinkedIn', link: 'https://linkedin.com', icon: 'fa-brands fa-linkedin-in' }
  ];

  legalLinks = [
    { label: 'Mentions légales', url: '/mentions', icon: 'fa-scale-balanced' },
    { label: 'Confidentialité', url: '/privacy', icon: 'fa-shield-halved' },
    { label: 'CGU', url: '/cgu', icon: 'fa-file-contract' }
  ];

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();
    this.filterLinksByRole();
  }

  detectMobile(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (!storedUser) {
      this.isLoggedIn = false;
      this.role = 'invite';
      return;
    }

    try {
      const user: Utilisateur = JSON.parse(storedUser);
      this.utilisateur = user;
      this.isLoggedIn = true;

      this.nom = user.nom || '';
      this.prenom = user.prenom || '';
      this.initiales = this.getInitiales(this.nom, this.prenom);

      this.role = user.role || 'joueur';
      this.theme = user.theme === 'sombre' ? 'sombre' : 'clair';

    } catch {
      this.isLoggedIn = false;
      this.role = 'invite';
    }
  }

  private filterLinksByRole(): void {
    const role = (this.role || 'invite').toLowerCase();

    this.filteredLinks = this.allLinks.filter(link =>
      !link.roles || link.roles.includes(role)
    );
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMouseEnter() { this.logoHover = true; }
  onMouseLeave() { this.logoHover = false; }


  hoveredItem: string | null = null;

  footerLinks = [
    { name: 'cgu', label: 'CGU', link: '/cgu' },
    { name: 'mentions', label: 'Mentions légales', link: '/mentions-legales' },
    { name: 'confidentialite', label: 'Confidentialité', link: '/confidentialite' },
    { name: 'cookies', label: 'Cookies', link: '/cookies' },
    { name: 'contact', label: 'Contact', link: '/contact' }
  ];
}