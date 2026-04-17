import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatchService, Match } from '../../../../Backend/Services/match.service';
import { Icon } from '../../priver/icon/icon';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon3 } from '../../public/icon3/icon3';

interface Utilisateur {
  nom?: string;
  prenom?: string;
  role?: string;
}

interface MatchUI extends Match {
  positionDom?: number;
  positionExt?: number;
  classementDom?: number;
  classementExt?: number;

  enCours: boolean; // ✅ obligatoire

  statut?: string;

  // ✅ PROPRIÉTÉ UI (remplace conflit avec Match)
  compteReboursObj?: {
    jours: number;
    heures: number;
    minutes: number;
  } | null;

  progress?: number;
  actions?: any[];
  competition?: string;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, Icon, Icon3],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome implements OnInit, OnDestroy {

  constructor(
    private matchService: MatchService,
    public themeService: ThemeService
  ) {}

  // ================= USER =================
  utilisateur: Utilisateur | null = null;
  isLoggedIn = false;
  userRole: string = 'inviter';

  // UI
  hoverBtn = false;
  hoverBtnLeft = false;
  hoverBtnRight = false;

  currentTime = '';
  isMobile = false;

  // ================= MATCH =================
  matchs: MatchUI[] = [];
  totalMatches = 0;
  currentMatch = 0;

  isAutoplay = false;
  autoplayInterval: any;
  compteReboursInterval: any;

  // USER INFO
  nom = '';
  prenom = '';
  initiales = '';
  role = '';

  // ================= INIT =================
  ngOnInit(): void {
    this.detectMobile();
    this.loadUserInfo();
    this.loadMatchs();
    this.startCompteRebours();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.stopCompteRebours();
  }

  // ================= MOBILE =================
  detectMobile(): void {
    this.isMobile = window.innerWidth < 768;

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }

  // ================= USER =================
  private loadUserInfo(): void {
    const storedUser = localStorage.getItem('utilisateur');

    if (!storedUser) {
      this.role = 'inviter';
      return;
    }

    try {
      this.utilisateur = JSON.parse(storedUser);
      this.isLoggedIn = true;

      this.nom = this.utilisateur?.nom || '';
      this.prenom = this.utilisateur?.prenom || '';
      this.role = this.utilisateur?.role || 'inviter';
      this.userRole = this.role;

      this.initiales = this.getInitiales(this.nom, this.prenom);

    } catch (error) {
      console.error('❌ Erreur parsing utilisateur :', error);
      this.utilisateur = null;
      this.isLoggedIn = false;
      this.role = 'inviter';
    }
  }

  getInitiales(nom: string, prenom: string): string {
    return (nom?.[0] || '').toUpperCase() + (prenom?.[0] || '').toUpperCase();
  }

  // ================= MATCH =================
  private loadMatchs(): void {
    this.matchService.getMatchs().subscribe({
      next: (data) => {
        this.matchs = this.enrichirMatchs(data);
        this.totalMatches = this.matchs.length;
      },
      error: (err) => console.error(err)
    });
  }

  private enrichirMatchs(matchs: Match[]): MatchUI[] {
    return matchs.map((match, index) => ({
      ...match,

      positionDom: index + 1,
      positionExt: index + 2,

      classementDom: Math.floor(Math.random() * 80) + 20,
      classementExt: Math.floor(Math.random() * 80) + 20,

      enCours: false,

      statut: this.determinerStatutMatch(match),

      // ✅ CORRECTION ICI
      compteReboursObj: this.calculerCompteRebours(match.date),

      progress: 0,

      actions: [
        {
          label: 'Détails',
          icon: 'fas fa-info-circle',
          primary: false,
          onClick: () => this.voirDetailsMatch(match)
        },
        {
          label: 'Billets',
          icon: 'fas fa-ticket-alt',
          primary: true,
          onClick: () => this.acheterBillets(match)
        }
      ]
    }));
  }

  private determinerStatutMatch(match: Match): string {
    const now = new Date();
    const matchDate = new Date(match.date);

    return matchDate > now ? 'À venir' : 'Terminé';
  }

  private calculerCompteRebours(dateMatch: Date | string) {
    const diff = new Date(dateMatch).getTime() - new Date().getTime();

    if (diff <= 0) return null;

    return {
      jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
      heures: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60)
    };
  }

  private startCompteRebours(): void {
    this.compteReboursInterval = setInterval(() => {
      this.matchs.forEach(match => {
        match.compteReboursObj = this.calculerCompteRebours(match.date);
      });
    }, 60000);
  }

  private stopCompteRebours(): void {
    clearInterval(this.compteReboursInterval);
  }

  // ================= CAROUSEL =================
  nextMatch() {
    this.currentMatch = (this.currentMatch + 1) % this.totalMatches;
  }

  prevMatch() {
    this.currentMatch =
      (this.currentMatch - 1 + this.totalMatches) % this.totalMatches;
  }

  goToMatch(i: number) {
    this.currentMatch = i;
  }

  // ================= AUTOPLAY =================
  toggleAutoplay() {
    this.isAutoplay ? this.stopAutoplay() : this.startAutoplay();
    this.isAutoplay = !this.isAutoplay;
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.nextMatch(), 5000);
  }

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }

  // ================= ACTIONS =================
  voirDetailsMatch(match: Match) {
    console.log(match);
  }

  acheterBillets(match: Match) {
    console.log(match);
  }

  trackByMatchId(index: number, match: any): any {
    return match.id; // ou match._id selon ton API
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  // Gestion du swipe tactile
touchStartX: number = 0;
touchEndX: number = 0;

onTouchStart(event: TouchEvent): void {
  this.touchStartX = event.changedTouches[0].screenX;
}

onTouchEnd(event: TouchEvent): void {
  this.touchEndX = event.changedTouches[0].screenX;
  this.handleSwipe();
}

private handleSwipe(): void {
  const swipeThreshold = 50;
  const diff = this.touchStartX - this.touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      this.nextMatch();
    } else {
      this.prevMatch();
    }
  }
}

// Gestion des erreurs d'images
handleImageError(event: Event, fallbackSrc: string): void {
  const img = event.target as HTMLImageElement;
  img.src = fallbackSrc;
}

// Actions des boutons
setReminder(match: Match): void {
  // Implémenter la logique de rappel
  console.log('Rappel activé pour:', match);
}

buyTickets(match: Match): void {
  // Implémenter la redirection vers la billetterie
  console.log('Achat de billets pour:', match);
}

subscribeToNotifications(): void {
  // Implémenter l'inscription aux notifications
  console.log('Inscription aux notifications');
}
}