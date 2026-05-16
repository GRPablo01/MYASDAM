// dash.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../../priver/icon/icon';

import { SectionDate2 } from '../../section-date2/section-date2';
import { Info } from '../../info/info';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Commande } from '../../Page-CentreCommand/commande/commande';






interface User {
  nom?: string;
  prenom?: string;
  email?: string;
  role?: UserRole;
  status?: string;
  theme?: 'clair' | 'sombre';
  photo?: string;
}

type UserRole = 'joueur' | 'entraineur' | 'invite' | 'admin' | 'superadmin' ;

type ViewSection =
  | 'Centre de Commande'
  | 'planning'
  | 'match'
  | 'profil'
  | 'admin'
  | 'equipe'
  | 'convocations'
  | 'gestion';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    Icon,
    Commande,
    SectionDate2,
    Info
  ],
  templateUrl: './dash.html',
  styleUrls: ['./dash.css']
})
export class Dash implements OnInit {

  user: User | null = null;

  constructor(public themeService: ThemeService) {}

  // rôle effectif (invite si non connecté)
  role: UserRole = 'invite';

  currentView!: ViewSection;
  theme: 'clair' | 'sombre' = 'clair';
  isLoading = false;

  hoveredItem: ViewSection | null = null;

  // =========================
  // COULEURS
  // =========================
  Background = '';
  Background1 = '';
  Background2 = '';
  Background3 = '';
  Background4 = '';
  Text = '';
  Text1 = '';
  BorderHeader = '';

  activeMatchFilter = 'all';

  calendarDates = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    isToday: i === 5,
    events: Math.floor(Math.random() * 3)
  }));

  // =========================
  // NAVIGATION
  // =========================
  readonly navItems: Record<UserRole, { id: ViewSection; label: string; icon: string }[]> = {

    joueur: [
      { id: 'planning', label: 'Planning', icon: 'fa-solid fa-calendar-days' },
      { id: 'match', label: 'Match', icon: 'fa-solid fa-futbol' },
      { id: 'equipe', label: 'Mon Équipe', icon: 'fa-solid fa-people-group' },
      { id: 'convocations', label: 'Convocations', icon: 'fa-solid fa-calendar-check' },
      { id: 'profil', label: 'Profil', icon: 'fa-solid fa-user' }
    ],

    entraineur: [
      { id: 'Centre de Commande', label: 'Centre de Commande', icon: 'fa-solid fa-sliders' },
      { id: 'planning', label: 'Planning', icon: 'fa-solid fa-calendar-days' },
      { id: 'match', label: 'Match', icon: 'fa-solid fa-futbol' },
      { id: 'equipe', label: 'Mon Équipe', icon: 'fa-solid fa-people-group' },
      { id: 'convocations', label: 'Convocations', icon: 'fa-solid fa-calendar-check' },
      { id: 'profil', label: 'Profil', icon: 'fa-solid fa-user' }
    ],

    invite: [
      { id: 'Centre de Commande', label: 'Centre de Commande', icon: 'fa-solid fa-sliders' },
      { id: 'planning', label: 'Planning', icon: 'fa-solid fa-calendar-days' },
      { id: 'profil', label: 'Profil', icon: 'fa-solid fa-user' }
    ],

    admin: [
      { id: 'Centre de Commande', label: 'Centre de Commande', icon: 'fa-solid fa-sliders' },
      { id: 'planning', label: 'Planning', icon: 'fa-solid fa-calendar-days' },
      { id: 'match', label: 'Match', icon: 'fa-solid fa-futbol' },
      { id: 'gestion', label: 'Gestion', icon: 'fa-solid fa-gear' },
      { id: 'profil', label: 'Profil', icon: 'fa-solid fa-user' }
    ],
    
    superadmin: [
      { id: 'Centre de Commande', label: 'Centre de Commande', icon: 'fa-solid fa-sliders' },
      { id: 'planning', label: 'Planning', icon: 'fa-solid fa-calendar-days' },
      { id: 'match', label: 'Match', icon: 'fa-solid fa-futbol' },
      { id: 'gestion', label: 'Gestion', icon: 'fa-solid fa-gear' },
      { id: 'admin', label: 'Admin Panel', icon: 'fa-solid fa-shield-halved' },
      { id: 'profil', label: 'Profil', icon: 'fa-solid fa-user' }
    ]
  };

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    const data = localStorage.getItem('utilisateur');

    if (data) {
      this.user = JSON.parse(data);
      this.role = this.user?.role ?? 'invite';
    } else {
      // utilisateur non connecté = invite
      this.role = 'invite';
    }
    this.currentView = this.navItems[this.role][0].id;
  }

  
  // =========================
  // NAVIGATION
  // =========================

  setView(view: ViewSection) {
    this.currentView = view;
  }

  isActive(view: ViewSection) {
    return this.currentView === view;
  }

  get currentNavItems() {
    return this.navItems[this.role];
  }
  

  currentPage = 0;
itemsPerPage = 4; // adapte (3-5 selon UI mobile)

get paginatedNavItems() {
  const start = this.currentPage * this.itemsPerPage;
  return this.currentNavItems.slice(start, start + this.itemsPerPage);
}

get totalPages() {
  return Math.ceil(this.currentNavItems.length / this.itemsPerPage);
}

get totalPagesArray() {
  return Array(this.totalPages);
}

nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
  }
}
}