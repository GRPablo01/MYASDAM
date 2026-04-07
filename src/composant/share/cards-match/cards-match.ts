import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

import { MatchService, Match } from '../../../../Backend/Services/match.service';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { Icon3 } from '../../public/icon3/icon3';

@Component({
  selector: 'app-cards-match',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon3],
  templateUrl: './cards-match.html',
  styleUrl: './cards-match.css',
})
export class CardsMatch implements OnInit, OnDestroy {
  matchs: Match[] = [];
  isDark = false;
  matchsFiltres: Match[] = [];
  loading = true;
  hover: string | null = null;
  focusSearch = false;
  showFiltersMobile = false;
  showFilters: boolean = true;
  statutsFiltre: string[] = [];
  activeCard: string | null = null;
  activeFilters: Array<{type: string, label: string, value: string}> = [];
  selectedMatch: Match | null = null;
  showMatchModal = false;
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'date' | 'status' | 'competition' = 'date';

  // Configuration des filtres
  filtresActifs = {
    recherche: '',
    statuts: [] as string[],
    periode: 'all'
  };

  readonly statutsDisponibles = ['En cours', 'Terminé', 'À venir', 'Reporté', 'Annulé'];
  
  readonly periodes = [
    { label: 'Toutes les périodes', value: 'all', icon: 'fa-calendar-alt' },
    { label: 'Aujourd\'hui', value: 'today', icon: 'fa-sun' },
    { label: 'Cette semaine', value: 'week', icon: 'fa-calendar-week' },
    { label: 'Ce mois', value: 'month', icon: 'fa-calendar' }
  ];

  // Périodes de match pour affichage
  readonly periodesMatch: { [key: string]: string } = {
    '1MT': '1ère MT',
    'MI-TPS': 'Mi-temps',
    '2MT': '2ème MT',
    'PROL': 'Prolongation',
    'TAB': 'Tirs au but',
    'TER': 'Terminé'
  };

  private touchStartY = 0;
  private statusUpdateSubscription: Subscription | null = null;
  private readonly MATCH_DURATION_MINUTES = 90; // Durée standard d'un match (1h30)
  private readonly STATUS_CHECK_INTERVAL = 60000; // Vérification toutes les minutes

  constructor(
    private matchService: MatchService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadMatchs();
    this.detectColorScheme();
    this.startStatusUpdates();
  }

  ngOnDestroy(): void {
    this.stopStatusUpdates();
  }

  // ==============================
  // ⏰ MISE À JOUR AUTOMATIQUE DES STATUTS
  // ==============================

  private startStatusUpdates(): void {
    // Vérification immédiate puis toutes les minutes
    this.updateMatchsStatus();
    this.statusUpdateSubscription = interval(this.STATUS_CHECK_INTERVAL).subscribe(() => {
      this.updateMatchsStatus();
    });
  }

  private stopStatusUpdates(): void {
    if (this.statusUpdateSubscription) {
      this.statusUpdateSubscription.unsubscribe();
      this.statusUpdateSubscription = null;
    }
  }

  private updateMatchsStatus(): void {
    const now = new Date();
    let hasChanges = false;

    this.matchs = this.matchs.map(match => {
      const newStatus = this.calculateMatchStatus(match, now);
      if (newStatus !== match.statut) {
        hasChanges = true;
        console.log(`Statut mis à jour: ${match.equipeDom} vs ${match.equipeExt}: ${match.statut} → ${newStatus}`);
        return { ...match, statut: newStatus };
      }
      return match;
    });

    // Si des changements ont été détectés, on met à jour les filtres
    if (hasChanges) {
      this.appliquerFiltres();
    }
  }

  private calculateMatchStatus(match: Match, now: Date): string {
    // Si le match est reporté ou annulé, on ne change pas le statut
    if (match.statut === 'Reporté' || match.statut === 'Annulé') {
      return match.statut;
    }

    // Si pas de date/heure, on garde le statut actuel ou "À venir" par défaut
    if (!match.date || !match.heure) {
      return match.statut || 'À venir';
    }

    // Construction de la date/heure du match
    const matchDateTime = this.parseMatchDateTime(match.date, match.heure);
    if (!matchDateTime) {
      return match.statut || 'À venir';
    }

    // Calcul des timestamps
    const matchStart = matchDateTime.getTime();
    const matchEnd = matchStart + (this.MATCH_DURATION_MINUTES * 60 * 1000); // +1h30
    const currentTime = now.getTime();

    // Logique de statut
    if (currentTime < matchStart) {
      // Avant l'heure du match : À venir
      return 'À venir';
    } else if (currentTime >= matchStart && currentTime <= matchEnd) {
      // Pendant le match : En cours
      return 'En cours';
    } else {
      // Après la fin du match : Terminé
      return 'Terminé';
    }
  }

  private parseMatchDateTime(date: string, heure: string): Date | null {
    try {
      // Format attendu: date = "2024-01-15" ou "15/01/2024", heure = "14:15"
      let dateObj: Date;

      if (date.includes('/')) {
        // Format français: DD/MM/YYYY
        const [day, month, year] = date.split('/').map(Number);
        const [hours, minutes] = heure.split(':').map(Number);
        dateObj = new Date(year, month - 1, day, hours, minutes, 0, 0);
      } else if (date.includes('-')) {
        // Format ISO: YYYY-MM-DD
        const [hours, minutes] = heure.split(':').map(Number);
        dateObj = new Date(date);
        dateObj.setHours(hours, minutes, 0, 0);
      } else {
        return null;
      }

      return isNaN(dateObj.getTime()) ? null : dateObj;
    } catch (error) {
      console.error('Erreur lors du parsing de la date/heure:', error);
      return null;
    }
  }

  // Méthode utilitaire pour formater l'heure d'affichage
  getHeureAffichage(match: Match): string {
    if (!match.heure) return '';
    return match.heure;
  }

  // Méthode pour savoir si un match démarre bientôt (dans moins de 15 min)
  isStartingSoon(match: Match): boolean {
    if (match.statut !== 'À venir' || !match.date || !match.heure) return false;
    
    const matchDateTime = this.parseMatchDateTime(match.date, match.heure);
    if (!matchDateTime) return false;

    const now = new Date();
    const diffMinutes = (matchDateTime.getTime() - now.getTime()) / (1000 * 60);
    
    return diffMinutes > 0 && diffMinutes <= 15;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      this.showFiltersMobile = false;
    }
  }

  detectColorScheme(): void {
    this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  loadMatchs(): void {
    this.loading = true;
    this.matchService.getMatchs().subscribe({
      next: (data) => {
        console.log('Matchs récupérés :', data);
        this.matchs = data;
        // Mise à jour immédiate des statuts après chargement
        this.updateMatchsStatus();
        this.appliquerFiltres();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API matchs :', err);
        this.matchs = [];
        this.matchsFiltres = [];
        this.loading = false;
      }
    });
  }

  // ==============================
  // ⏱️ GESTION DU TEMPS DE MATCH
  // ==============================

  // Formater l'affichage de la minute (30', 45+3', MI-TPS, etc.)
  getMinuteDisplay(match: Match): string {
    if (!match || match.statut !== 'En cours') return '';
    
    // Calcul de la minute en cours basé sur l'heure de début réelle
    if (match.date && match.heure) {
      const matchDateTime = this.parseMatchDateTime(match.date, match.heure);
      if (matchDateTime) {
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - matchDateTime.getTime()) / (1000 * 60));
        
        if (diffMinutes > 0) {
          if (diffMinutes <= 45) {
            return `${diffMinutes}'`;
          } else if (diffMinutes <= 90) {
            return `${diffMinutes}'`;
          } else {
            return `90+${diffMinutes - 90}'`;
          }
        }
      }
    }
    
    // Fallback sur les propriétés existantes
    if (match.periode && this.periodesMatch[match.periode]) {
      if (match.periode === 'MI-TPS' || match.periode === 'TER' || 
          match.periode === 'PROL' || match.periode === 'TAB') {
        return this.periodesMatch[match.periode];
      }
    }
    
    const minute = match.minute || 0;
    
    // 1ère mi-temps (1-45 + temps additionnel)
    if (match.periode === '1MT') {
      if (minute > 45) {
        return `45+${minute - 45}'`;
      }
      return `${minute}'`;
    }
    
    // 2ème mi-temps (46-90 + temps additionnel)
    if (match.periode === '2MT') {
      if (minute > 90) {
        return `90+${minute - 90}'`;
      }
      return `${minute}'`;
    }
    
    return `${minute}'`;
  }

  // Vérifier si le match est en direct (live)
  isMatchLive(match: Match): boolean {
    return match.statut === 'En cours' && 
           match.periode !== 'TER' && 
           match.periode !== 'MI-TPS';
  }

  // Obtenir le pourcentage de progression du match (0-100%)
  getProgressionMatch(match: Match): number {
    if (match.statut === 'Terminé') return 100;
    if (match.statut !== 'En cours') return 0;
    
    // Calcul basé sur l'heure réelle si disponible
    if (match.date && match.heure) {
      const matchDateTime = this.parseMatchDateTime(match.date, match.heure);
      if (matchDateTime) {
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - matchDateTime.getTime()) / (1000 * 60));
        const progress = Math.min((diffMinutes / this.MATCH_DURATION_MINUTES) * 100, 100);
        return Math.round(progress);
      }
    }
    
    // Fallback
    if (!match.minute) return 0;
    if (match.periode === 'TER') return 100;
    if (match.periode === 'MI-TPS') return 50;
    
    const maxMinutes = 90;
    const current = Math.min(match.minute || 0, maxMinutes);
    return Math.round((current / maxMinutes) * 100);
  }

  // Obtenir la classe CSS pour la barre de progression
  getProgressClass(match: Match): string {
    const progress = this.getProgressionMatch(match);
    if (progress < 30) return 'bg-green-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // ==============================
  // 📋 MÉTHODES EXISTANTES (conservées)
  // ==============================

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filtresActifs.recherche = value;
    this.appliquerFiltres();
  }

  filterByStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value && !this.statutsFiltre.includes(value)) {
      this.statutsFiltre.push(value);
      this.toggleStatut(value);
    }
  }

  removeFilter(filter: any): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filter);
    if (filter.type === 'status') {
      this.toggleStatut(filter.value);
    } else if (filter.type === 'periode') {
      this.setPeriode('all');
    }
  }

  clearAllFilters(): void {
    this.activeFilters = [];
    this.statutsFiltre = [];
    this.resetFiltres();
  }

  getTeamColor(teamName: string): string {
    if (!teamName) return this.themeService.primary;
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
      hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  }

  openMatchDetails(match: Match): void {
    this.selectedMatch = match;
    this.showMatchModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeMatchModal(): void {
    this.showMatchModal = false;
    this.selectedMatch = null;
    document.body.style.overflow = '';
  }

  toggleFiltreStatut(statut: string): void {
    if (this.statutsFiltre.includes(statut)) {
      this.statutsFiltre = this.statutsFiltre.filter(s => s !== statut);
    } else {
      this.statutsFiltre.push(statut);
    }
    this.toggleStatut(statut);
  }

  filtrerMatchs(): any[] {
    if (!this.statutsFiltre || this.statutsFiltre.length === 0) {
      return this.matchs;
    }
    return this.matchs.filter(match =>
      this.statutsFiltre.includes(match.statut ?? '')
    );
  }

  toggleStatut(statut: string): void {
    const index = this.filtresActifs.statuts.indexOf(statut);
    if (index === -1) {
      this.filtresActifs.statuts.push(statut);
      this.activeFilters.push({type: 'status', label: statut, value: statut});
    } else {
      this.filtresActifs.statuts.splice(index, 1);
      this.activeFilters = this.activeFilters.filter(f => !(f.type === 'status' && f.value === statut));
    }
    this.appliquerFiltres();
  }

  setPeriode(periode: string): void {
    this.filtresActifs.periode = periode;
    this.activeFilters = this.activeFilters.filter(f => f.type !== 'periode');
    if (periode !== 'all') {
      const periodeLabel = this.periodes.find(p => p.value === periode)?.label || periode;
      this.activeFilters.push({type: 'periode', label: periodeLabel, value: periode});
    }
    this.appliquerFiltres();
  }

  rechercher(event: any): void {
    this.filtresActifs.recherche = event.target.value;
    this.appliquerFiltres();
  }

  getStatutLabel(statut: string | undefined): string {
    if (!statut) return 'À venir';
    return statut === 'En cours' ? 'LIVE' : statut;
  }

  appliquerFiltres(): void {
    let resultats = [...this.matchs];

    // Filtre par recherche
    if (this.filtresActifs.recherche.trim()) {
      const recherche = this.filtresActifs.recherche.toLowerCase();
      resultats = resultats.filter(match => 
        match.equipeDom?.toLowerCase().includes(recherche) ||
        match.equipeExt?.toLowerCase().includes(recherche) ||
        match.lieu?.toLowerCase().includes(recherche) ||
        match.categorie?.toLowerCase().includes(recherche)
      );
    }

    // Filtre par statut
    if (this.filtresActifs.statuts.length > 0) {
      resultats = resultats.filter(match => 
        this.filtresActifs.statuts.includes(match.statut || 'À venir')
      );
    }

    // Filtre par période
    if (this.filtresActifs.periode !== 'all') {
      const aujourdhui = new Date();
      resultats = resultats.filter(match => {
        if (!match.date) return true;
        const dateMatch = new Date(match.date);
        
        switch (this.filtresActifs.periode) {
          case 'today':
            return dateMatch.toDateString() === aujourdhui.toDateString();
          case 'week':
            const debutSemaine = new Date(aujourdhui);
            debutSemaine.setDate(aujourdhui.getDate() - aujourdhui.getDay());
            const finSemaine = new Date(debutSemaine);
            finSemaine.setDate(debutSemaine.getDate() + 6);
            return dateMatch >= debutSemaine && dateMatch <= finSemaine;
          case 'month':
            return dateMatch.getMonth() === aujourdhui.getMonth() && 
                   dateMatch.getFullYear() === aujourdhui.getFullYear();
          default:
            return true;
        }
      });
    }

    // Tri
    resultats.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        case 'status':
          return (a.statut || '').localeCompare(b.statut || '');
        default:
          return 0;
      }
    });

    this.matchsFiltres = resultats;
  }

  resetFiltres(): void {
    this.filtresActifs = {
      recherche: '',
      statuts: [],
      periode: 'all'
    };
    this.statutsFiltre = [];
    this.appliquerFiltres();
  }

  hasActiveFilters(): boolean {
    return this.filtresActifs.recherche !== '' || 
           this.filtresActifs.statuts.length > 0 || 
           this.filtresActifs.periode !== 'all';
  }

  getStatutIcon(statut: string | undefined): string {
    const icons: { [key: string]: string } = {
      'En cours': 'fa-play-circle',
      'Terminé': 'fa-check-circle',
      'À venir': 'fa-hourglass-start',
      'Reporté': 'fa-calendar-times',
      'Annulé': 'fa-ban'
    };
    return icons[statut || 'À venir'] || 'fa-circle';
  }

  getStatutColor(statut: string | undefined): string {
    const colors: { [key: string]: string } = {
      'En cours': '#10b981',  // Émeraude
      'Terminé': '#6b7280',   // Gris
      'À venir': '#3b82f6',   // Bleu
      'Reporté': '#f59e0b',   // Ambre
      'Annulé': '#ef4444'     // Rouge
    };
    return colors[statut || 'À venir'] || this.themeService.primary;
  }

  isLive(match: Match): boolean {
    return match.statut === 'En cours';
  }

  trackByMatchId(index: number, match: Match): string {
    return match._id || index.toString();
  }

  getCompetitionIcon(type: string | undefined): string {
    const icons: { [key: string]: string } = {
      'Championnat': 'fa-trophy',
      'Coupe': 'fa-medal',
      'Amical': 'fa-handshake',
      'Tournoi': 'fa-star'
    };
    return icons[type || ''] || 'fa-futbol';
  }

  formatDateRelative(date: string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    const diffTime = d.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    if (diffDays === -1) return 'Hier';
    if (diffDays > 0 && diffDays < 7) return `Dans ${diffDays} jours`;
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.showFiltersMobile) return;
    const touchY = event.touches[0].clientY;
    if (touchY - this.touchStartY > 100) {
      this.showFiltersMobile = false;
    }
  }
}