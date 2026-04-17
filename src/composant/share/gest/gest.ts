import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../../../../Backend/Services/theme.service';
import { MatchService, Match } from '../../../../Backend/Services/match.service';
import { ConvocationService, Convocation } from '../../../../Backend/Services/convocation.service';
import { EventService } from '../../../../Backend/Services/Event.Service';
import { ActusService, Actu } from '../../../../Backend/Services/actus.service';
import { AuthService } from '../../../../Backend/Services/User/Auth.Service';

/* 🔹 INTERFACES UI */
interface QuickAction {
  label: string;
  icon: string;
  color: string;
}

interface Notification {
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  unread: boolean;
}

interface UpcomingEvent {
  title: string;
  description: string;
  date: string;
  icon: string;
  color: string;
  attendees: string[];
}

@Component({
  selector: 'app-gest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gest.html',
  styleUrls: ['./gest.css'],
})
export class Gest implements OnInit {

  /* 🔹 USER */
  currentUser: any = null;
  role: string = '';
  nom: string = '';
  prenom: string = '';
  initiales: string = '';

  /* 🔹 CLOCK */
  currentTime: string = '';

  /* 🔹 USERS */
  users: any[] = [];

  /* 🔹 DATA */
  matchs: Match[] = [];
  convocations: Convocation[] = [];
  events: any[] = [];
  actus: Actu[] = [];

  /* 🔹 UI DATA */
  quickActions: QuickAction[] = [
    { label: 'Créer match', icon: 'fas fa-futbol', color: '#3b82f6' },
    { label: 'Ajouter event', icon: 'fas fa-calendar', color: '#8b5cf6' },
    { label: 'Convocations', icon: 'fas fa-clipboard', color: '#f59e0b' },
    { label: 'Actualités', icon: 'fas fa-newspaper', color: '#ec4899' }
  ];

  recentNotifications: Notification[] = [
    {
      title: 'Nouvelle convocation',
      message: '3 joueurs convoqués pour le match',
      time: 'Il y a 5 min',
      icon: 'fas fa-clipboard-list',
      color: '#f59e0b',
      unread: true
    },
    {
      title: 'Match programmé',
      message: 'Match ajouté au calendrier',
      time: 'Il y a 1h',
      icon: 'fas fa-futbol',
      color: '#3b82f6',
      unread: false
    }
  ];

  upcomingEvents: UpcomingEvent[] = [
    {
      title: 'Entraînement',
      description: 'Séance technique équipe A',
      date: 'Demain 18h',
      icon: 'fas fa-running',
      color: '#8b5cf6',
      attendees: ['A', 'B', 'C', 'D']
    },
    {
      title: 'Match officiel',
      description: 'Championnat régional',
      date: 'Samedi 15h',
      icon: 'fas fa-trophy',
      color: '#f59e0b',
      attendees: ['A', 'B', 'C', 'D', 'E']
    }
  ];

  todayDate = new Date();
  loading = true;

  constructor(
    public themeService: ThemeService,
    private matchService: MatchService,
    private convocationService: ConvocationService,
    private eventService: EventService,
    private actusService: ActusService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('🚀 INIT GEST');

    this.loadUser();
    this.loadUsers();
    this.loadData();
    this.startClock();
  }

  /* 🔹 CLOCK LIVE */
  private startClock(): void {
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
    }, 1000);
  }

  /* 🔹 USER CONNECTÉ */
  private loadUser(): void {
    const stored = localStorage.getItem('utilisateur');
    if (!stored) return;

    try {
      this.currentUser = JSON.parse(stored);

      this.role = this.currentUser?.role || '';
      this.nom = this.currentUser?.nom || '';
      this.prenom = this.currentUser?.prenom || '';
      this.initiales = this.getInitiales(this.nom, this.prenom);

      console.log('👤 USER:', this.currentUser);
    } catch (err) {
      console.error('❌ Erreur user parse', err);
    }
  }

  private getInitiales(nom: string, prenom: string): string {
    return ((nom?.charAt(0) || '') + (prenom?.charAt(0) || '')).toUpperCase();
  }

  /* 🔹 USERS */
  private loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (data: any) => {
        console.log('👥 RAW USERS RESPONSE:', data);

        if (Array.isArray(data)) {
          this.users = data;
        } else if (data?.users) {
          this.users = data.users;
        } else {
          this.users = [];
        }

        console.log('👥 FINAL USERS:', this.users);
      },
      error: (err) => {
        console.error('❌ USERS ERROR', err);
        this.users = [];
      }
    });
  }

  getUsersVisible(): any[] {
    if (this.currentUser?.role === 'superadmin') return this.users;
    if (this.currentUser?.role === 'admin') return this.users.filter(u => u.role !== 'superadmin');
    return [];
  }

  /* 🔹 DATA */
  private loadData(): void {

    this.matchService.getMatchs().subscribe({
      next: (data) => this.matchs = data || []
    });

    this.convocationService.getConvocations().subscribe({
      next: (data) => this.convocations = data || []
    });

    this.eventService.getEvents().subscribe({
      next: (data) => this.events = data || []
    });

    this.actusService.getAllActus().subscribe({
      next: (data) => {
        this.actus = data || [];
        this.loading = false;
      }
    });
  }

  /* 🔹 UTILS */
  getMatchsEnCours(): number {
    return this.matchs.filter(m => m?.statut === 'En cours').length;
  }

  trackById(index: number, item: any): any {
    return item?._id || index;
  }
}