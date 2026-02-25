import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../Backend/Services/Event.Service';
import { MatchService, Match } from '../../../../Backend/Services/match.service';
import { Icon } from '../../priver/icon/icon';

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

  get isLoggedIn(): boolean {
    return !!this.nom;
  }

  // ===============================
  // COULEURS
  // ===============================
  Background: string = '';
  Text: string = '';
  Text1: string = '';
  Text2: string = '';
  Text3: string = '';

  Background1: string = '';
  Background2: string = '';
  Background3: string = '';
  Background4: string = '';
  Background5: string = '';
  Background6: string = '';
  Background7: string = '';
  Background8: string = '';
  Background9: string = '';
  Background10: string = '';
  Background11: string = '';
  Background12: string = '';

  // Section 9 : Planning Spécifique
  BackgroundOrb: string = '';
  BackgroundOrb2: string = '';
  BackgroundGlow: string = '';
  CardBackground: string = '';
  TextMuted: string = '';
  ArrowBackground: string = '';
  ArrowBorder: string = '';
  TeamBackground: string = '';
  DividerColor: string = '';
  IconBackground: string = '';
  BorderLight: string = '';
  TagBackground: string = '';
  BadgeBackground: string = '';
  EmptyStateBackground: string = '';
  EmptyStateIconBackground: string = '';

  BorderHeader: string = '';
  BorderHeader1: string = '';
  BorderHeader2: string = '';
  BorderHeader3: string = '';
  borderHeader1: string = '';
  borderHeader2: string = '';
  borderHeader3: string = '';

  backgroundDegrade1: string = '';

  // ===============================
  // DONNÉES
  // ===============================
  evenements: Evenement[] = [];
  matchs: Match[] = [];

  aujourdHuiEvents: any[] = [];
  demainEvents: any[] = [];

  constructor(
    private eventService: EventService,
    private matchService: MatchService
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

    this.setThemeColors();
  }

  // ===============================
  // THEMES
  // ===============================
  private setThemeColors(): void {

    // 🔴 1️⃣ NON CONNECTÉ
    if (!this.isLoggedIn) {

      //---------- Section 0 ----------//
      this.Background = '#1E293B';
      this.Text = '#FFFFFF';

      //---------- Section 1 ----------//
      this.Background1 = '#6978b8';
      this.Background2 = '#6978b8';
      this.Background3 = '#6978b8';
      this.Background4 = '#334155';

      //---------- Section 2 ----------//
      this.Background5 = '#6978b8';
      this.BorderHeader = '2px solid #334155';

      //---------- Section 3 ----------//
      this.Text1 = '#6978b8';
      this.Text2 = '#6978b8';

      //---------- Section 4 ----------//
      this.Background6 = '#334155';

      //---------- Section 5 ----------//
      this.Background7 = '#6978b8';
      this.Background8 = '#334155';
      this.BorderHeader1 = '2px solid #6978b8';

      //---------- Section 6 ----------//
      this.Background9 = '#334155';
      this.BorderHeader2 = '2px solid #6978b8';

      //---------- Section 7 ----------//
      this.BorderHeader3 = '2px solid #6978b8';
      this.Background10 = '#6978b8';
      this.Background11 = '#64748B';

      //---------- Section 8 ----------//
      this.Background12 = '#6978b8';

      //---------- Section 9 : Planning Spécifique ----------//
      this.BackgroundOrb = 'rgba(255,255,255,0.3)';
      this.BackgroundOrb2 = 'rgba(255,255,255,0.2)';
      this.BackgroundGlow = 'rgba(105,120,184,0.3)';
      this.CardBackground = 'rgba(30,41,59,0.4)';
      this.TextMuted = 'rgba(255,255,255,0.6)';
      this.ArrowBackground = 'rgba(255,255,255,0.15)';
      this.ArrowBorder = 'rgba(255,255,255,0.3)';
      this.TeamBackground = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)';
      this.DividerColor = 'rgba(255,255,255,0.2)';
      this.IconBackground = 'rgba(255,255,255,0.1)';
      this.BorderLight = 'rgba(255,255,255,0.2)';
      this.TagBackground = 'rgba(255,255,255,0.05)';
      this.BadgeBackground = 'rgba(255,255,255,0.1)';
      this.EmptyStateBackground = 'rgba(255,255,255,0.05)';
      this.EmptyStateIconBackground = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)';

      return;
    }

    // 🌙 2️⃣ CONNECTÉ + SOMBRE
    if (this.theme === 'sombre') {

      //---------- Section 0 ----------//
      this.Background = '#1E293B';
      this.Text = '#FFFFFF';

      //---------- Section 1 ----------//
      this.Background1 = '#6978b8';
      this.Background2 = '#6978b8';
      this.Background3 = '#6978b8';
      this.Background4 = '#6978b8';

      //---------- Section 2 ----------//
      this.Background5 = '#6978b8';
      this.BorderHeader = '2px solid #64748B';

      //---------- Section 3 ----------//
      this.Text1 = '#6978b8';
      this.Text2 = '#6978b8';

      //---------- Section 4 ----------//
      this.Background6 = '#334155';

      //---------- Section 5 ----------//
      this.Background7 = '#6978b8';
      this.Background8 = '#334155';
      this.BorderHeader1 = '2px solid #6978b8';

      //---------- Section 6 ----------//
      this.Background9 = '#334155';
      this.BorderHeader2 = '2px solid #6978b8';

      //---------- Section 7 ----------//
      this.BorderHeader3 = '2px solid #6978b8';
      this.Background10 = '#6978b8';
      this.Background11 = '#64748B';

      //---------- Section 8 ----------//
      this.Background12 = '#6978b8';

      //---------- Section 9 : Planning Spécifique ----------//
      this.BackgroundOrb = 'rgba(255,255,255,0.3)';
      this.BackgroundOrb2 = 'rgba(255,255,255,0.2)';
      this.BackgroundGlow = 'rgba(105,120,184,0.3)';
      this.CardBackground = 'rgba(30,41,59,0.4)';
      this.TextMuted = 'rgba(255,255,255,0.6)';
      this.ArrowBackground = 'rgba(255,255,255,0.15)';
      this.ArrowBorder = 'rgba(255,255,255,0.3)';
      this.TeamBackground = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)';
      this.DividerColor = 'rgba(255,255,255,0.2)';
      this.IconBackground = 'rgba(255,255,255,0.1)';
      this.BorderLight = 'rgba(255,255,255,0.2)';
      this.TagBackground = 'rgba(255,255,255,0.05)';
      this.BadgeBackground = 'rgba(255,255,255,0.1)';
      this.EmptyStateBackground = 'rgba(255,255,255,0.05)';
      this.EmptyStateIconBackground = 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)';

      return;
    }

    // ☀️ 3️⃣ CONNECTÉ + CLAIR

    //---------- Section 0 ----------//
    this.Background = '#FFFFFF';
    this.Text = '#000000';

    //---------- Section 1 ----------//
    this.Background1 = '#DC2626';
    this.Background2 = '#DC2626';
    this.Background3 = '#DC2626';
    this.Background4 = '#DC2626';

    //---------- Section 2 ----------//
    this.Background5 = '#DC2626';
    this.BorderHeader = '2px solid #a80303';

    //---------- Section 3 ----------//
    this.Text1 = '#DC2626';
    this.Text2 = '#DC2626';

    //---------- Section 4 ----------//
    this.Background6 = '#e9e6e6';

    //---------- Section 5 ----------//
    this.Background7 = '#DC2626';
    this.Background8 = '#e9e6e6';
    this.BorderHeader1 = '2px solid #DC2626';

    //---------- Section 6 ----------//
    this.Background9 = '#e9e6e6';
    this.BorderHeader2 = '2px solid #DC2626';

    //---------- Section 7 ----------//
    this.BorderHeader3 = '2px solid #DC2626';
    this.Background10 = '#DC2626';
    this.Background11 = '#a3464680';

    //---------- Section 8 ----------//
    this.Background12 = '#DC2626';

    //---------- Section 9 : Planning Spécifique ----------//
    this.BackgroundOrb = 'rgba(220,38,38,0.15)';
    this.BackgroundOrb2 = 'rgba(220,38,38,0.1)';
    this.BackgroundGlow = 'rgba(220,38,38,0.2)';
    this.CardBackground = 'rgba(255,255,255,0.8)';
    this.TextMuted = 'rgba(0,0,0,0.5)';
    this.ArrowBackground = 'rgba(220,38,38,0.1)';
    this.ArrowBorder = 'rgba(220,38,38,0.3)';
    this.TeamBackground = 'linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(220,38,38,0.05) 100%)';
    this.DividerColor = 'rgba(0,0,0,0.1)';
    this.IconBackground = 'rgba(220,38,38,0.1)';
    this.BorderLight = 'rgba(220,38,38,0.2)';
    this.TagBackground = 'rgba(220,38,38,0.05)';
    this.BadgeBackground = 'rgba(220,38,38,0.1)';
    this.EmptyStateBackground = 'rgba(220,38,38,0.05)';
    this.EmptyStateIconBackground = 'linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(220,38,38,0.05) 100%)';

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
