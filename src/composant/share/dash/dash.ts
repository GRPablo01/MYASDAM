// dash.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../priver/icon/icon';
import { Commande } from '../commande/commande';
import { SectionDate2 } from "../section-date2/section-date2";

interface User {
  nom?: string;
  prenom?: string;
  email?: string;
  role?: UserRole;
  status?: string;
  theme?: 'clair' | 'sombre';
  photo?: string;
}

type UserRole = 'joueur' | 'entraineur' | 'invite' | 'admin';

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
  imports: [CommonModule, HttpClientModule, FormsModule, Icon, Commande, SectionDate2],
  templateUrl: './dash.html',
  styleUrls: ['./dash.css']
})
export class Dash implements OnInit {

  user: User | null = null;
  currentView!: ViewSection;
  theme: 'clair' | 'sombre' = 'clair';
  isLoading = false;

  hoveredItem: ViewSection | null = null;

  // =========================
  // COULEURS (TOUTES DÉCLARÉES)
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
      { id: 'planning', label: 'Planning', icon: 'fa-solid fa-calendar-days' },
      { id: 'profil', label: 'Profil', icon: 'fa-solid fa-user' }
    ],
    admin: [
      { id: 'Centre de Commande', label: 'Centre de Commande', icon: 'fa-solid fa-sliders' },
      { id: 'planning', label: 'Planning', icon: 'fa-solid fa-calendar-days' },
      { id: 'match', label: 'Match', icon: 'fa-solid fa-futbol' },
      { id: 'gestion', label: 'Gestion', icon: 'fa-solid fa-gear' },
      { id: 'admin', label: 'Admin Panel', icon: 'fa-solid fa-shield-halved' },
      { id: 'profil', label: 'Profil', icon: 'fa-solid fa-user' }
    ]
  };

  ngOnInit(): void {
    const data = localStorage.getItem('utilisateur');
    if (data) {
      this.user = JSON.parse(data);
      this.theme = this.user?.theme ?? 'clair';
    }

    this.setThemeColors();

    if (this.user?.role) {
      this.currentView = this.navItems[this.user.role][0].id;
    }
  }

  setThemeColors() {
    if (this.theme === 'sombre') {
      this.Background = '#1e293b';
      this.Background1 = '#0f172a ';
      this.Background2 = '#1e293b';
      this.Background3 = '#334155';
      this.Background4 = '#475569';
      this.Text = '#ffffff';
      this.Text1 = '#6978b8';
      this.BorderHeader = '#334155';
    } else {
      this.Background = '#ffffff';
      this.Background1 = '#DC2626';
      this.Background2 = '#f8fafc';
      this.Background3 = '#f1f5f9';
      this.Background4 = '#e2e8f0';
      this.Text = '#000000';
      this.Text1 = '#DC2626';
      this.BorderHeader = '#e5e7eb';
    }
  }

  setView(view: ViewSection) {
    this.currentView = view;
  }

  isActive(view: ViewSection) {
    return this.currentView === view;
  }

  get currentNavItems() {
    return this.user?.role ? this.navItems[this.user.role] : [];
  }
}
