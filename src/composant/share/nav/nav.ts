// nav.component.ts

import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon } from '../../priver/icon/icon';

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
  imports: [
    CommonModule,
    RouterLink,
    Icon
  ],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})

export class Nav implements OnInit {

  // =========================================================
  // INJECTIONS
  // =========================================================

  private elementRef = inject(ElementRef);

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) { }

  // =========================================================
  // STATES
  // =========================================================

  role: string = 'invite';

  hoveredIndex: number = -1;
  hoveredChild: NavItem | null = null;

  openMenuIndex: number | null = null;

  activeMenus = {
    level1: -1,
    level2: -1,
    level3: -1
  };

  searchVisible: boolean = false;
  searchQuery: string = '';
  isDarkMode: string = '';

  // =========================================================
  // MENU
  // =========================================================

  menu: NavItem[] = [];

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadUserRole();

    this.generateMenu();

    this.listenRouterChanges();
  }

  // =========================================================
  // USER ROLE
  // =========================================================

  private loadUserRole(): void {

    const userStr = localStorage.getItem('utilisateur');

    if (!userStr) {
      this.role = 'invite';
      return;
    }

    try {

      const user = JSON.parse(userStr);

      this.role = user?.role || 'invite';

    } catch (error) {

      console.error(
        '[NAV] Erreur parsing utilisateur:',
        error
      );

      this.role = 'invite';
    }
  }

  // =========================================================
  // ROUTER LISTENER
  // =========================================================

  private listenRouterChanges(): void {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        this.closeAllMenus();

        this.openMenuIndex = null;

        this.searchVisible = false;

        this.updateActiveLinks();
      });
  }

  // =========================================================
  // MENU GENERATOR
  // =========================================================

  generateMenu(): void {

    const roleMenu: { [key: string]: NavItem[] } = {

      // =====================================================
      // SUPERADMIN
      // =====================================================

      superadmin: [

        {
          label: 'Gestion',
          icon: 'fas fa-users-cog',
          link: '/gestion',
          description: 'Administration centrale',
          children: [
            {
              label: 'Utilisateurs',
              icon: 'fas fa-user-shield',
              link: '/user',
              description: 'Gestion utilisateurs'
            },
            {
              label: 'Contenu Sportif',
              icon: 'fas fa-futbol',
              link: '/cont',
              description: 'Gestion sportive'
            },
            {
              label: 'Communication',
              icon: 'fas fa-bullhorn',
              link: '/commun',
              description: 'Communication'
            }
          ]
        },

        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/message',
          description: 'Messagerie interne'
        },

        {
          label: 'Classement',
          icon: 'fas fa-chart-line',
          link: '/class',
          description: 'Statistiques'
        }
      ],

      // =====================================================
      // ADMIN
      // =====================================================

      admin: [

        {
          label: 'Gestion',
          icon: 'fas fa-users-cog',
          link: '/gestion',
          description: 'Administration',
          children: [
            {
              label: 'Utilisateurs',
              icon: 'fas fa-user-shield',
              link: '/user'
            },
            {
              label: 'Contenu Sportif',
              icon: 'fas fa-futbol',
              link: '/cont'
            },
            {
              label: 'Communication',
              icon: 'fas fa-bullhorn',
              link: '/commun'
            }
          ]
        },

        {
          label: 'Messagerie',
          icon: 'fas fa-envelope',
          link: '/message'
        },

        {
          label: 'Classement',
          icon: 'fas fa-chart-line',
          link: '/statistiques'
        },

        {
          label: 'Convocation',
          icon: 'fas fa-clipboard-list',
          link: '/planning',
          children: [
            {
              label: 'Séances',
              icon: 'fas fa-dumbbell',
              link: '/seances'
            },
            {
              label: 'Rencontres',
              icon: 'fas fa-trophy',
              link: '/rencontres'
            }
          ]
        }
      ],

      // =====================================================
      // ENTRAINEUR
      // =====================================================

      entraineur: [

        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus'
        },

        {
          label: 'Équipe',
          icon: 'fas fa-users',
          link: '/equipe',
          children: [
            {
              label: 'Joueurs',
              icon: 'fas fa-user',
              link: '/joueurs'
            },
            {
              label: 'Disponibles',
              icon: 'fas fa-clipboard-list',
              link: '/disponibles'
            },
            {
              label: 'Statistiques',
              icon: 'fas fa-chart-bar',
              link: '/stats'
            }
          ]
        },

        {
          label: 'Convocation',
          icon: 'fas fa-clipboard-list',
          link: '/planning',
          children: [
            {
              label: 'Séances',
              icon: 'fas fa-dumbbell',
              link: '/seances'
            },
            {
              label: 'Rencontres',
              icon: 'fas fa-trophy',
              link: '/rencontres'
            }
          ]
        },

        {
          label: 'Calendrier',
          icon: 'fas fa-calendar-alt',
          link: '/calendrier'
        }
      ],

      // =====================================================
      // JOUEUR
      // =====================================================

      joueur: [

        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus'
        },

        {
          label: 'Équipe',
          icon: 'fas fa-users',
          link: '/equipe',
          children: [
            {
              label: 'Joueurs',
              icon: 'fas fa-user',
              link: '/joueurs'
            },
            {
              label: 'Disponibles',
              icon: 'fas fa-clipboard-list',
              link: '/disponibles'
            },
            {
              label: 'Mes statistiques',
              icon: 'fas fa-chart-bar',
              link: '/mes-stats'
            }
          ]
        },

        {
          label: 'Mes convocations',
          icon: 'fas fa-clipboard-list',
          link: '/convocations'
        },

        {
          label: 'Calendrier',
          icon: 'fas fa-calendar-alt',
          link: '/calendrier'
        }
      ],

      // =====================================================
      // INVITE
      // =====================================================

      invite: [

        {
          label: 'Actualités',
          icon: 'fas fa-newspaper',
          link: '/actus'
        },

        {
          label: 'Matchs',
          icon: 'fas fa-futbol',
          link: '/match'
        },

        {
          label: 'Contact',
          icon: 'fas fa-envelope',
          link: '/contact'
        }
      ]
    };

    this.menu = roleMenu[this.role] || roleMenu['invite'];

    this.updateActiveLinks();
  }

  // =========================================================
  // ACTIVE LINKS
  // =========================================================

  updateActiveLinks(): void {

    const currentUrl = this.router.url;

    this.menu.forEach(item => {

      item.active = item.link === currentUrl;

      item.children?.forEach(child => {
        child.active = child.link === currentUrl;
      });
    });
  }

  // =========================================================
  // MENU TOGGLE
  // =========================================================

  toggleMenu(index: number): void {

    this.openMenuIndex =
      this.openMenuIndex === index
        ? null
        : index;
  }

  // =========================================================
  // HOVER DESKTOP ONLY
  // =========================================================

  onMouseEnter(index: number): void {

    if (window.innerWidth <= 1024) return;

    this.hoveredIndex = index;
  }

  onMouseLeave(): void {

    this.hoveredIndex = -1;

    this.hoveredChild = null;
  }

  // =========================================================
  // CLICK OUTSIDE
  // =========================================================

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    if (!target) return;

    const navElement =
      this.elementRef.nativeElement;

    if (!navElement.contains(target)) {

      this.closeAllMenus();

      this.openMenuIndex = null;

      this.searchVisible = false;
    }
  }

  // =========================================================
  // SEARCH
  // =========================================================

  toggleSearch(): void {

    this.searchVisible = !this.searchVisible;

    if (this.searchVisible) {

      requestAnimationFrame(() => {

        const searchInput =
          document.getElementById('nav-search');

        searchInput?.focus();
      });
    }
  }

  onSearch(query: string): void {

    this.searchQuery = query.toLowerCase();

    console.log(
      '[MyAsdam] Recherche:',
      query
    );
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  navigate(link?: string): void {

    if (!link) return;

    this.router.navigate([link]);

    this.closeAllMenus();

    this.openMenuIndex = null;
  }

  // =========================================================
  // MENU HELPERS
  // =========================================================

  isAnyMenuOpen(): boolean {

    return (
      this.activeMenus.level1 !== -1 ||
      this.activeMenus.level2 !== -1 ||
      this.activeMenus.level3 !== -1
    );
  }

  closeAllMenus(): void {

    this.activeMenus = {
      level1: -1,
      level2: -1,
      level3: -1
    };

    this.hoveredIndex = -1;

    this.hoveredChild = null;
  }

  // =========================================================
  // LEVEL TOGGLES
  // =========================================================

  toggleLevel1(i: number, event: Event): void {

    event.preventDefault();

    event.stopPropagation();

    this.activeMenus.level1 =
      this.activeMenus.level1 === i
        ? -1
        : i;
  }

  toggleLevel2(i: number, event: Event): void {

    event.preventDefault();

    event.stopPropagation();

    this.activeMenus.level2 =
      this.activeMenus.level2 === i
        ? -1
        : i;
  }

  toggleLevel3(i: number, event: Event): void {

    event.preventDefault();

    event.stopPropagation();

    this.activeMenus.level3 =
      this.activeMenus.level3 === i
        ? -1
        : i;
  }

  // =========================================================
  // MENU EVENTS
  // =========================================================

  onMouseEnterLevel1(i: number): void {

    if (window.innerWidth <= 1024) return;

    this.hoveredIndex = i;
  }

  onMenuEnter(): void { }

  onMenuLeave(): void {

    this.closeAllMenus();
  }

  // =========================================================
  // MENU CLICK
  // =========================================================

  onMenuClick(
    item: NavItem,
    i: number,
    event: Event
  ): void {

    if (!item.children?.length) return;

    event.preventDefault();

    event.stopPropagation();

    this.toggleMenu(i);
  }
}