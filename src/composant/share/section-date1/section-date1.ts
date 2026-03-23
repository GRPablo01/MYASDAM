import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../Backend/Services/Event.Service';
import { MatchService, Match } from '../../../../Backend/Services/match.service';
import { Icon } from '../../priver/icon/icon';
import { ThemeService } from '../../../../Backend/Services/theme.service';

interface Utilisateur {
  nom?: string;
  prenom?: string;
  theme?: 'clair' | 'sombre';
}

interface Evenement {
  titre: string;
  heure: string;
  duree: string;
  type: 'match' | 'reunion' | 'entrainement' | 'autre';
  jour?: 'aujourdhui' | 'demain';
  date?: string;
  live?: boolean;
}

@Component({
  selector: 'app-section-date1',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './section-date1.html',
  styleUrls: ['./section-date1.css'],
})
export class SectionDate1 implements OnInit {

  // ===============================
  // USER
  // ===============================
  isMobile = false;
  nom: string = '';
  prenom: string = '';
  initiales: string = '';
  theme: 'clair' | 'sombre' = 'clair';

  currentDate!: Date;
  tomorrowDate!: Date;

  get isLoggedIn(): boolean {
    return !!this.nom;
  }

  // ===============================
  // DONNÉES - SÉPARÉES PROPREMENT
  // ===============================
  evenements: Evenement[] = [];
  matchs: Match[] = [];

  // Événements réguliers séparés par jour
  aujourdHuiEvents: Evenement[] = [];
  demainEvents: Evenement[] = [];

  // Matchs séparés par jour
  aujourdHuiMatchs: Match[] = [];
  demainMatchs: Match[] = [];

  // Totaux
  get totalEvents(): number {
    return this.aujourdHuiEvents.length + this.demainEvents.length + 
           this.aujourdHuiMatchs.length + this.demainMatchs.length;
  }

  get totalAujourdHui(): number {
    return this.aujourdHuiEvents.length + this.aujourdHuiMatchs.length;
  }

  get totalDemain(): number {
    return this.demainEvents.length + this.demainMatchs.length;
  }

  constructor(
    private eventService: EventService,
    private matchService: MatchService,
    public themeService: ThemeService
  ) {}

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();

    this.currentDate = this.getStartOfDay(new Date());
    this.tomorrowDate = new Date(this.currentDate);
    this.tomorrowDate.setDate(this.tomorrowDate.getDate() + 1);

    // console.log('📅 Aujourd\'hui :', this.currentDate);
    // console.log('📅 Demain :', this.tomorrowDate);

    this.loadEvenements();
    this.loadMatchs();
  }

  // ===============================
  // DATE UTILS
  // ===============================
  private getStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private isToday(date: Date): boolean {
    return this.getStartOfDay(date).getTime() === this.currentDate.getTime();
  }

  private isTomorrow(date: Date): boolean {
    return this.getStartOfDay(date).getTime() === this.tomorrowDate.getTime();
  }

  // ===============================
  // MOBILE
  // ===============================
  detectMobile(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  // ===============================
  // USER
  // ===============================
  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) {
      try {
        const user: Utilisateur = JSON.parse(storedUser);
        this.nom = user.nom || '';
        this.prenom = user.prenom || '';
        this.initiales = this.getInitiales(this.nom, this.prenom);
        this.theme = user.theme === 'sombre' ? 'sombre' : 'clair';
        // console.log('👤 Utilisateur chargé :', user);
      } catch (error) {
        console.error('Erreur parsing utilisateur :', error);
      }
    }
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

  // ===============================
  // API
  // ===============================
  private loadEvenements(): void {
    this.eventService.getEvents().subscribe({
      next: (data: Evenement[]) => {
        // console.log('📥 EVENTS API RAW :', data);
        this.evenements = data;
        this.filterData();
      },
      error: (err) => console.error('❌ Erreur événements :', err),
    });
  }

  private loadMatchs(): void {
    this.matchService.getMatchs().subscribe({
      next: (data: Match[]) => {
        // console.log('📥 MATCHS API RAW :', data);
        this.matchs = data;
        this.filterData();
      },
      error: (err) => console.error('❌ Erreur matchs :', err),
    });
  }

  // ===============================
  // 🔥 FILTRAGE STRICT AUJOURD'HUI / DEMAIN
  // ===============================
  private filterData(): void {
    // console.log('==============================');
    // console.log('🚀 FILTRAGE EN COURS');
    // console.log('==============================');

    // Reset des tableaux
    this.aujourdHuiEvents = [];
    this.demainEvents = [];
    this.aujourdHuiMatchs = [];
    this.demainMatchs = [];

    // ===== EVENTS =====
    this.evenements.forEach(event => {
      let eventDate: Date | null = null;

      if (event.date) {
        eventDate = new Date(event.date);
      } else if (event.jour === 'aujourdhui') {
        eventDate = this.currentDate;
      } else if (event.jour === 'demain') {
        eventDate = this.tomorrowDate;
      }

      if (!eventDate) return;

      if (this.isToday(eventDate)) {
        this.aujourdHuiEvents.push(event);
      } else if (this.isTomorrow(eventDate)) {
        this.demainEvents.push(event);
      }
    });

    // ===== MATCHS =====
    this.matchs.forEach(match => {
      if (!match.date) return;

      const matchDate = new Date(match.date);

      if (this.isToday(matchDate)) {
        this.aujourdHuiMatchs.push(match);
      } else if (this.isTomorrow(matchDate)) {
        this.demainMatchs.push(match);
      }
    });

    // console.log('📊 RESULTAT FINAL :');
    // console.log('➡️ Events Aujourd\'hui :', this.aujourdHuiEvents.length);
    // console.log('➡️ Matchs Aujourd\'hui :', this.aujourdHuiMatchs.length);
    // console.log('➡️ Events Demain :', this.demainEvents.length);
    // console.log('➡️ Matchs Demain :', this.demainMatchs.length);
    // console.log('🔥 TOTAL :', this.totalEvents);

    this.sortDataByTime();
  }

  // ===============================
  // TRI PAR HEURE
  // ===============================
  private sortDataByTime(): void {
    const getTimeValue = (heure: string): number => {
      const [h, m] = heure.split(':').map(n => parseInt(n, 10) || 0);
      return h * 60 + m;
    };
  
    // Tri des événements
    this.aujourdHuiEvents.sort((a, b) => getTimeValue(a.heure ?? '00:00') - getTimeValue(b.heure ?? '00:00'));
    this.demainEvents.sort((a, b) => getTimeValue(a.heure ?? '00:00') - getTimeValue(b.heure ?? '00:00'));
  
    // Tri des matchs
    this.aujourdHuiMatchs.sort((a, b) => getTimeValue(a.heure ?? '00:00') - getTimeValue(b.heure ?? '00:00'));
    this.demainMatchs.sort((a, b) => getTimeValue(a.heure ?? '00:00') - getTimeValue(b.heure ?? '00:00'));
  }
}