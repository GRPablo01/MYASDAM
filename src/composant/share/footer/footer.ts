import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Icon } from '../../priver/icon/icon';
import { FormsModule } from '@angular/forms';

interface Social {
  label: string;
  link: string;
  icon: string; // classe font awesome
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
  imports: [CommonModule, Icon,FormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer implements OnInit {

  // ===============================
  // RESPONSIVE
  // ===============================
  isMobile = false;

  // ===============================
  // AUTH
  // ===============================
  utilisateur: Utilisateur | null = null;
  isLoggedIn = false;

  nom = '';
  prenom = '';
  initiales = '';
  role = 'joueur';
  theme: 'clair' | 'sombre' = 'clair';

  logoHover = false;

  // ===============================
  // COULEURS
  // ===============================
  Background = '';
  Background4 = '';
  Background6 = '';
  BackgroundGlow = '';
  CardBackground = '';
  TextMuted = '';
  SocialBackground = '';
  GradientPrimary = '';
  BadgeBackground = '';
  IconBackgroundPrimary = '';
  HoverBackground = '';
  BorderLight = '';
  BorderHeader = '';
  Text = '';
  Text1 = '';
  Text2 = '';

  // ===============================
  // LIENS
  // ===============================
  filteredLinks: Link[] = [];

  socials: Social[] = [
    {
      label: 'Facebook',
      link: 'https://facebook.com',
      icon: 'fa-brands fa-facebook-f'
    },
    {
      label: 'Instagram',
      link: 'https://instagram.com',
      icon: 'fa-brands fa-instagram'
    },
    {
      label: 'LinkedIn',
      link: 'https://linkedin.com',
      icon: 'fa-brands fa-linkedin-in'
    }
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
      this.setThemeColors();
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
    }

    this.setThemeColors();
  }

  private filterLinksByRole(): void {
    const links: Link[] = [
      { label: 'Accueil', url: '/', roles: ['admin', 'entraineur', 'joueur'] },
      { label: 'À propos', url: '/about', roles: ['admin','entraineur', 'joueur'] },
      { label: 'Dashboard', url: '/dashboard', roles: ['admin','entraineur','joueur'] },
      { label: 'Admin', url: '/admin', roles: ['admin'] },
      { label: 'Contact', url: '/contact', roles: ['admin','entraineur','joueur'] }
    ];

    this.filteredLinks = links.filter(link =>
      !link.roles || link.roles.includes(this.role)
    );
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

  private setThemeColors(): void {

    if (!this.isLoggedIn || this.theme === 'sombre') {
      this.Background = '#1E293B';
      this.Background4 = '#334155';
      this.Background6 = '#334155';
      this.BackgroundGlow = 'rgba(105,120,184,0.5)';
      this.CardBackground = 'rgba(255,255,255,0.05)';
      this.TextMuted = 'rgba(255,255,255,0.6)';
      this.SocialBackground = 'rgba(255,255,255,0.05)';
      this.GradientPrimary = 'linear-gradient(135deg,#6978b8,#818fd5)';
      this.BadgeBackground = 'rgba(105,120,184,0.15)';
      this.IconBackgroundPrimary = 'rgba(105,120,184,0.2)';
      this.HoverBackground = 'rgba(255,255,255,0.05)';
      this.BorderLight = 'rgba(255,255,255,0.1)';
      this.BorderHeader = '2px solid #64748B';
      this.Text = '#FFFFFF';
      this.Text1 = '#6978b8';
      this.Text2 = '#6978b8';
      return;
    }

    this.Background = '#FFFFFF';
    this.Background4 = '#DC2626';
    this.Background6 = '#f3f3f3';
    this.BackgroundGlow = 'rgba(220,38,38,0.5)';
    this.CardBackground = 'rgba(255,255,255,0.7)';
    this.TextMuted = 'rgba(0,0,0,0.5)';
    this.SocialBackground = 'rgba(0,0,0,0.03)';
    this.GradientPrimary = 'linear-gradient(135deg,#F43F5E,#BE123C)';
    this.BadgeBackground = 'rgba(244,63,94,0.15)';
    this.IconBackgroundPrimary = 'rgba(244,63,94,0.1)';
    this.HoverBackground = 'rgba(0,0,0,0.05)';
    this.BorderLight = 'rgba(0,0,0,0.1)';
    this.BorderHeader = '2px solid #DC2626';
    this.Text = '#000000';
    this.Text1 = '#DC2626';
    this.Text2 = '#DC2626';
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMouseEnter() { this.logoHover = true; }
  onMouseLeave() { this.logoHover = false; }
}
