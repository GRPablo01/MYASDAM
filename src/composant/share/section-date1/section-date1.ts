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
  jour: 'aujourdhui' | 'demain';
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
  Logo = '';
  Forme = '';

  currentDate!: Date;
  tomorrowDate!: Date;

  get isLoggedIn(): boolean {
    return !!this.nom;
  }

  

  // ===============================
  // DONNÉES
  // ===============================
  evenements: Evenement[] = [];
  matchs: Match[] = [];

  aujourdHuiEvents: any[] = [];
  demainEvents: any[] = [];

  constructor(
    private eventService: EventService,
    private matchService: MatchService,
    public themeService: ThemeService
  ) { }

  // ===============================
  // INIT
  // ===============================
  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();
    this.loadEvenements();
    this.loadMatchs();
  }

  // 📱 Détection mobile
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
        this.theme =
          user.theme === 'sombre' || user.theme === 'clair'
            ? user.theme
            : 'clair';
      } catch (error) {
        console.error('Erreur parsing utilisateur :', error);
        this.theme = 'clair';
      }
    }

    
  }

  

  // ===============================
  // OUTILS
  // ===============================
  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

  // ===============================
  // API
  // ===============================
  private loadEvenements(): void {
    this.eventService.getEvents().subscribe({
      next: (data: Evenement[]) => {
        this.evenements = data;
        
      },
      error: (err) => console.error('Erreur chargement événements :', err),
    });
  }

  private loadMatchs(): void {
    this.matchService.getMatchs().subscribe({
      next: (data: Match[]) => {
        this.matchs = data;
        
      },
      error: (err) => console.error('Erreur chargement matchs :', err),
    });
  }
}
