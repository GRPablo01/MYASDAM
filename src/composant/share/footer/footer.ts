import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../priver/icon/icon';


interface Social {
  label: string;
  link: string;
  icon?: string;
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
  imports: [CommonModule,Icon],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer implements OnInit {

  // Responsive
  isMobile = false;
  utilisateur: Utilisateur | null = null;
  isLoggedIn = false;

  // Infos utilisateur
  nom: string = '';
  prenom: string = '';
  initiales: string = '';
  role: string = 'joueur';
  theme: 'clair' | 'sombre' = 'clair';

  // Hover sur logo
  logoHover: boolean = false;

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
  backgroundDegrade2: string = '';
  Logo: string = '';
  Forme: string = '';

  // Réseaux sociaux
  socials: Social[] = [
    { 
      label: 'Twitter', 
      link: 'https://twitter.com', 
      icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' 
    },
    { 
      label: 'FaceBook', 
      link: 'https://facebook.com', 
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' 
    },
    { 
      label: 'Instagram', 
      link: 'https://instagram.com', 
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' 
    }
  ];

  // Liens footer avec rôle
  links: Link[] = [
    { label: 'Accueil', url: '/', roles: ['admin', 'entraineur', 'joueur'] },
    { label: 'À propos', url: '/about', roles: ['admin','entraineur', 'joueur'] },
    { label: 'Tableau de bord', url: '/dashboard', roles: ['admin', 'entraineur', 'joueur'] },
    { label: 'Admin', url: '/admin', roles: ['admin'] },
    { label: 'Contact', url: '/contact', roles: ['admin', 'entraineur', 'joueur'] }
  ];

  legalLinks = [
    { label: 'Mentions légales', icon: 'fa-scale-balanced', url: '/legal' },
    { label: 'Confidentialité', icon: 'fa-shield-halved', url: '/privacy' },
    { label: 'Cookies', icon: 'fa-cookie-bite', url: '/cookies' }
  ];

  // 🔹 Liens filtrés selon le rôle
  filteredLinks: Link[] = [];

  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();
    this.filterLinksByRole();
  }

  onMouseEnter() { this.logoHover = true; }
  onMouseLeave() { this.logoHover = false; }

  detectMobile(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => { this.isMobile = window.innerWidth < 768; });
  }

  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      try {
        const user: Utilisateur = JSON.parse(storedUser);
        this.nom = user.nom || '';
        this.prenom = user.prenom || '';
        this.initiales = this.getInitiales(this.nom, this.prenom);
        this.theme = user.theme === 'sombre' || user.theme === 'clair' ? user.theme : 'clair';
        this.role = user.role || 'joueur';

        // console.log('💡 Utilisateur chargé :', user);
        // console.log('🔹 Nom:', this.nom, '| Prénom:', this.prenom);
        // console.log('🎨 Thème:', this.theme);
        // console.log('🛡️ Rôle:', this.role);

      } catch (error) {
        console.error('Erreur parsing utilisateur :', error);
        this.theme = 'clair';
        this.role = 'joueur';
      }
    } else {
      console.warn('⚠️ Aucun utilisateur trouvé. Rôle par défaut :', this.role);
    }

    this.setThemeColors();
  }

  private filterLinksByRole(): void {
    this.filteredLinks = this.links.filter(link => !link.roles || link.roles.includes(this.role));
    // console.log('🔗 Liens disponibles pour le rôle', this.role, ':', this.filteredLinks);
  }

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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  

}
