// nav.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon } from "../../priver/icon/icon";

interface NavItem {
  label: string;
  icon?: string;
  link?: string;
  children?: NavItem[];
  badge?: string | number;
  active?: boolean;
  description?: string;
  shortcut?: string;
  footer?: {
    label: string;
    link: string;
  };
  isCenter?: boolean;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav implements OnInit {

  // Rôle de l'utilisateur, par défaut 'invite'
  role: string = 'invite';
  hoveredIndex: number = -1;
  hoveredChild: NavItem | null = null;

  activeMenus = { level1: -1, level2: -1, level3: -1 };
  

  // Menu dynamique
  menu: NavItem[] = [];

  // Index du menu ouvert (pour sous-menus)
  openMenuIndex: number | null = null;

  // Recherche
  searchVisible: boolean = false;
  searchQuery: string = '';
  isDarkMode: string = '';

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 🔹 Récupération du rôle depuis le localStorage
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.role = user.role || 'invite';
      } catch (error) {
        console.error('Erreur parsing localStorage utilisateur :', error);
        this.role = 'invite';
      }
    }

    // 🔹 Génération du menu
    this.generateMenu();
  }

  // 🔹 Génération dynamique du menu avec enfants selon le rôle MyAsdam
  generateMenu(): void {
    // Définition des menus par rôle pour MyAsdam (Club de Foot + Convocations)
    const roleMenu: { [key: string]: NavItem[] } = {

      // ============================================
      // SUPERADMIN - Gestion complète du club
      // Navigation principale avec 4 sections
      // ============================================
      // ============================================
      // SUPERADMIN - Gestion complète du club
      // Navigation principale avec 4 sections
      // ============================================
      superadmin: [
        // Gestion
        {
          label: 'Gestion',
          icon: 'fas fa-users-cog',
          link: '/gestion',
          description: 'Administration centrale : membres, contenu sportif et communication',
          children: [
            {
              label: 'Utilisateurs',
              icon: 'fas fa-user-shield',
              link: '/user',
              description: 'Gestion des rôles, permissions et accès utilisateurs',
            },
            {
              label: 'Contenu Sportif',
              icon: 'fas fa-futbol',
              link: '/superadmin/gestion/sport',
              description: 'Matchs, calendriers, résultats et événements sportifs',
            },
            {
              label: 'Communication',
              icon: 'fas fa-bullhorn',
              link: '/superadmin/gestion/communication',
              description: 'Actualités, newsletters et notifications push',
            }
          ]

        },

        // Messagerie
        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/messagerie',
          description: 'Emails internes, discussions et support utilisateurs',
        },

        // Classement
        {
          label: 'Classement',
          icon: 'fas fa-chart-line',
          link: '/statistiques',
          description: 'Analyse de performance et rapports d\'activité',
        },

        // Convocation
        {
          label: 'Convocation',
          icon: 'fas fa-clipboard-list',
          link: 'planning',
          description: 'Organisation des séances et rencontres',
          children: [
            {
              label: 'Séances',
              icon: 'fas fa-dumbbell',
              link: '/seances',
              description: 'Programmation des séances et présences',
            },
            {
              label: 'Rencontres',
              icon: 'fas fa-trophy',
              link: '/rencontres',
              description: 'Gestion des matchs et tournois',
            }
          ]
        },
      ],

      // ============================================
      // ADMIN - Gestion opérationnelle
      // ============================================
      admin: [
        // Gestion
        {
          label: 'Gestion',
          icon: 'fas fa-users-cog',
          link: '/gestion',
          description: 'Administration centrale : membres, contenu sportif et communication',
          children: [
            {
              label: 'Utilisateurs',
              icon: 'fas fa-user-shield',
              link: '/user',
              description: 'Gestion des rôles, permissions et accès utilisateurs',
            },
            {
              label: 'Contenu Sportif',
              icon: 'fas fa-futbol',
              link: '/sport',
              description: 'Matchs, calendriers, résultats et événements sportifs',
            },
            {
              label: 'Communication',
              icon: 'fas fa-bullhorn',
              link: '/communication',
              description: 'Actualités, newsletters et notifications push',
            }
          ]

        },

        // Messagerie
        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/messagerie',
          description: 'Emails internes, discussions et support utilisateurs',
        },

        // Classement
        {
          label: 'Classement',
          icon: 'fas fa-chart-line',
          link: '/statistiques',
          description: 'Analyse de performance et rapports d\'activité',
        },

        // Convocation
        {
          label: 'Convocation',
          icon: 'fas fa-clipboard-list',
          link: '/planning',
          description: 'Organisation des séances et rencontres',
          children: [
            {
              label: 'Séances',
              icon: 'fas fa-dumbbell',
              link: '/seances',
              description: 'Programmation des séances et présences',
            },
            {
              label: 'Rencontres',
              icon: 'fas fa-trophy',
              link: '/rencontres',
              description: 'Gestion des matchs et tournois',
            }
          ]
        },
      ],

      // ============================================
      // ENTRAINEUR - Focus équipe et convocations
      // ============================================
      entraineur: [
        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus',
          description: 'Infos du club'
        },
        {
          label: 'Équipe',
          icon: 'fas fa-users',
          link: '/equipe',
          description: 'Gestion de l\'équipe',
          children: [
            {
              label: 'Joueurs',
              icon: 'fas fa-user',
              link: '/joueurs',
              description: 'Liste des joueurs'
            },
            {
              label: 'Effectif disponible',
              icon: 'fas fa-clipboard-list',
              link: '/disponibles',
              description: 'Joueurs disponibles ce week-end'
            },
            {
              label: 'Statistiques joueurs',
              icon: 'fas fa-chart-bar',
              link: '/stats',
              description: 'Performance individuelle'
            }
          ]
        },
        // Convocation
        {
          label: 'Convocation',
          icon: 'fas fa-clipboard-list',
          link: '/planning',
          description: 'Organisation des séances et rencontres',
          children: [
            {
              label: 'Séances',
              icon: 'fas fa-dumbbell',
              link: '/seances',
              description: 'Programmation des séances et présences',
            },
            {
              label: 'Rencontres',
              icon: 'fas fa-trophy',
              link: '/rencontres',
              description: 'Gestion des matchs et tournois',
            }
          ]
        },
        {
          label: 'Calendrier',
          icon: 'fas fa-calendar-alt',
          link: '/calendrier',
          description: 'Planning',
        },
        
      ],

      // ============================================
      // JOUEUR - Espace personnel
      // ============================================
      joueur: [
        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus',
          description: 'Infos du club'
        },
        {
          label: 'Équipe',
          icon: 'fas fa-users',
          link: '/equipe',
          description: 'Mon équipe et coéquipiers',
          children: [
            {
              label: 'Joueurs',
              icon: 'fas fa-user',
              link: '/joueurs',
              description: 'Liste des coéquipiers'
            },
            {
              label: 'Effectif disponible',
              icon: 'fas fa-clipboard-list',
              link: 'disponibles',
              description: 'Joueurs disponibles ce week-end'
            },
            {
              label: 'Mes statistiques',
              icon: 'fas fa-chart-bar',
              link: '/mes-stats',
              description: 'Mes performances individuelles'
            }
          ]
        },
        {
          label: 'Mes convocations',
          icon: 'fas fa-clipboard-list',
          link: '/convocations',
          description: 'Mes séances et matchs',
          children: [
            {
              label: 'Séances',
              icon: 'fas fa-dumbbell',
              link: '/seances',
              description: 'Mes séances d\'entraînement'
            },
            {
              label: 'Rencontres',
              icon: 'fas fa-trophy',
              link: '/rencontres',
              description: 'Mes matchs et tournois'
            }
          ]
        },
        {
          label: 'Calendrier',
          icon: 'fas fa-calendar-alt',
          link: '/calendrier',
          description: 'Mon planning'
        },
      ],

      // ============================================
      // INVITE - Vue publique limitée
      // ============================================
      invite: [
        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus',
          description: 'News du club'
        },
        {
          label: 'Matchs',
          icon: 'fas fa-futbol',
          link: '/match',
          description: 'Calendrier des matchs',
        },
        {
          label: 'Contact',
          icon: 'fas fa-envelope',
          link: '/contact',
          description: 'Nous contacter'
        },
      ]
    };

    // 🔹 Menu final selon rôle (fallback sur invite si rôle inconnu)
    this.menu = roleMenu[this.role] || roleMenu['invite'];

    // console.log(`[MyAsdam] Menu généré pour le rôle: ${this.role} (${this.menu.length} items)`);
  }

  // 🔹 Toggle sous-menu au clic
  toggleMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }
  // 🔹 Ouvrir un sous-menu au hover (pour desktop)
  onMouseEnter(index: number): void {
    if (window.innerWidth > 768) {
      this.hoveredIndex = index;
    }
  }

  // 🔹 Fermer le hover
  onMouseLeave(): void {
    this.hoveredIndex = -1;
    this.hoveredChild = null;
  }

  // 🔹 Fermer les menus si on clique en dehors
  @HostListener('document:click', ['$event.target'])
  clickOutside(target: EventTarget | null): void {
    if (!(target instanceof HTMLElement)) return;

    const navEl = document.querySelector('nav');
    if (navEl && !navEl.contains(target)) {
      this.openMenuIndex = null;
      this.searchVisible = false;
    }
  }

  // 🔹 Fonction pour afficher/masquer la barre de recherche
  toggleSearch(): void {
    this.searchVisible = !this.searchVisible;
    if (this.searchVisible) {
      // Focus sur l'input après l'affichage
      setTimeout(() => {
        const searchInput = document.getElementById('nav-search');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  // 🔹 Recherche dans le menu
  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    // Implémenter la logique de filtrage si nécessaire
    console.log(`[MyAsdam] Recherche: ${query}`);
  }

  // 🔹 Navigation vers un lien
  navigate(link: string | undefined): void {
    if (link) {
      this.router.navigate([link]);
      this.openMenuIndex = null; // Fermer le menu après navigation
    }
  }

  isAnyMenuOpen(): boolean { return this.activeMenus.level1 !== -1 || this.activeMenus.level2 !== -1 || this.activeMenus.level3 !== -1; }
  closeAllMenus(): void { this.activeMenus = { level1: -1, level2: -1, level3: -1 }; }

  toggleLevel1(i: number, event: Event): void {
    event.preventDefault();
    this.activeMenus.level1 = this.activeMenus.level1 === i ? -1 : i;
  }

  toggleLevel2(i: number, event: Event): void {
    event.preventDefault();
    this.activeMenus.level2 = this.activeMenus.level2 === i ? -1 : i;
  }

  toggleLevel3(i: number, event: Event): void {
    event.preventDefault();
    this.activeMenus.level3 = this.activeMenus.level3 === i ? -1 : i;
  }

  onMouseEnterLevel1(i: number): void { this.hoveredIndex = i; }
  onMenuEnter(): void { }
  onMenuLeave(): void { this.activeMenus.level1 = -1; this.activeMenus.level2 = -1; this.activeMenus.level3 = -1; this.hoveredIndex = -1; }


  onMenuClick(item: any, i: number, event: Event) {
    if (item.children) {
      event.preventDefault();
      this.toggleMenu(i);
    }
  }
}