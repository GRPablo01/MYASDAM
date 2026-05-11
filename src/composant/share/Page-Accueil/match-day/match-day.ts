import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatchService, Match } from '../../../../../Backend/Services/match.service';
import { Icon } from '../../../priver/icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';



@Component({
  selector: 'app-match-day',
  standalone: true,
  imports: [CommonModule, FormsModule,Icon],
  templateUrl: './match-day.html',
  styleUrl: './match-day.css',
})
export class MatchDay implements OnInit {

  statut: 'À venir' | 'En live' | 'Terminé' = 'À venir';

  matchs: Match[] = [];

  showInfos = false;


  toggleInfos(match: any) {
    match.showInfos = !match.showInfos;
  }

  isToday(date: Date | string): boolean {
    const d = new Date(date);
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  }

  constructor(
    public themeService: ThemeService,
    private matchService: MatchService,
  ) { }

  ngOnInit(): void {
    this.getAllMatchs();
  }

  currentIndex = 0;

  nextMatch() {
    if (this.currentIndex < this.matchs.length - 1) {
      this.currentIndex++;
    }
  }

  prevMatch() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  // 🔵 Récupérer tous les matchs
  getAllMatchs(): void {
    this.matchService.getMatchs().subscribe({
      next: (data) => {
        this.matchs = data;
        // console.log('Matchs chargés :', data);
      },
      error: (err) => {
        console.error('Erreur chargement matchs :', err);
      }
    });
  }

  // 🔵 Helpers utiles
  isLive(match: Match): boolean {
    return this.matchService.isMatchLive(match);
  }

  formatMinute(match: Match): string {
    return this.matchService.formaterMinute(match);
  }

  progress(match: Match): number {
    return this.matchService.getProgressionMatch(match);
  }

  getStatutClass(statut: string | undefined): string {
    switch (statut) {

      // ✅ MATCH À VENIR
      case 'À venir':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';

      // ✅ MATCH TERMINÉ / VALIDÉ
      case 'Terminé':
      case 'Validé':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600';

      // 🟡 EN COURS / EN ATTENTE
      case 'En cours':
      case 'En attente':
        return 'bg-gradient-to-br from-amber-500 to-orange-500';

      // 🔴 ANNULÉ / REPORTÉ
      case 'Annulé':
      case 'Reporté':
        return 'bg-gradient-to-br from-red-500 to-red-600';

      // ⚫ PAR DÉFAUT
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  }

  getStatutIcon(statut: string | undefined): string {
    switch (statut) {

      case 'À venir':
        return 'fa-calendar';

      case 'Terminé':
      case 'Validé':
        return 'fa-check';

      case 'En cours':
        return 'fa-play';

      case 'En attente':
        return 'fa-clock';

      case 'Annulé':
        return 'fa-ban';

      case 'Reporté':
        return 'fa-rotate-right';

      default:
        return 'fa-circle-question';
    }
  }
}