import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatchService, Match } from '../../../../../Backend/Services/match.service';
import { EquipeService, Equipe } from '../../../../../Backend/Services/equipe.service';

import { Icon } from '../../../priver/icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-match-day',
  standalone: true,
  imports: [CommonModule, FormsModule, Icon],
  templateUrl: './match-day.html',
  styleUrl: './match-day.css',
})
export class MatchDay implements OnInit {

  statut: 'À venir' | 'En live' | 'Terminé' = 'À venir';

  matchs: Match[] = [];
  equipes: Equipe[] = [];

  // 🔥 MAP ULTRA RAPIDE ID → ÉQUIPE
  equipesMap: Map<string, Equipe> = new Map();

  showInfos = false;
  currentIndex = 0;

  constructor(
    public themeService: ThemeService,
    private matchService: MatchService,
    private equipeService: EquipeService
  ) {}

  ngOnInit(): void {
    // console.log('🚀 MatchDay init');

    this.getAllEquipes();
    this.getAllMatchs();
  }

  // =========================
  // LOAD MATCHS
  // =========================
  getAllMatchs(): void {
    // console.log('📥 Chargement des matchs...');

    this.matchService.getMatchs().subscribe({
      next: (data) => {
        this.matchs = data;

        // console.log('✅ Matchs récupérés :', data);
        // console.log('📊 Nombre de matchs :', this.matchs.length);

        this.matchs.forEach((m, i) => {
          // console.log(`⚽ Match ${i + 1}`, m);
        });
      },
      error: (err) => {
        console.error('❌ Erreur matchs :', err);
      }
    });
  }

  // =========================
  // LOAD EQUIPES + BUILD MAP
  // =========================
  getAllEquipes(): void {
    // console.log('📥 Chargement des équipes...');

    this.equipeService.getEquipes().subscribe({
      next: (data) => {

        this.equipes = data;

        // console.log('✅ Équipes récupérées :', data);
        // console.log('📊 Nombre d’équipes :', data.length);

        // 🔥 BUILD MAP
        this.equipesMap.clear();

        data.forEach(equipe => {
          this.equipesMap.set(equipe._id!, equipe);
        });

        // console.log('🧠 Map équipes créée :', this.equipesMap);
      },
      error: (err) => {
        console.error('❌ Erreur équipes :', err);
      }
    });
  }

  // =========================
  // GET TEAM FAST (MAP)
  // =========================
  getEquipe(id: string | undefined): Equipe | undefined {
    if (!id) {
      console.warn('⚠️ ID équipe undefined');
      return undefined;
    }

    const equipe = this.equipesMap.get(id);

    if (!equipe) {
      console.warn('⚠️ Équipe introuvable pour ID :', id);
    } else {
      // console.log('🔎 Équipe trouvée :', equipe);
    }

    return equipe;
  }

  getEquipeName(id: string | undefined): string {
    return this.getEquipe(id)?.nom || 'Équipe inconnue';
  }

  getEquipeLogo(id: string | undefined): string {
    return this.getEquipe(id)?.logo || '';
  }

  // =========================
  // MATCH HELPERS (DOM / EXT)
  // =========================
  getDomEquipe(match: Match): string {
    return this.getEquipeName(match.equipeDom);
  }

  getExtEquipe(match: Match): string {
    return this.getEquipeName(match.equipeExt);
  }

  getDomLogo(match: Match): string {
    return this.getEquipeLogo(match.equipeDom);
  }

  getExtLogo(match: Match): string {
    return this.getEquipeLogo(match.equipeExt);
  }

  // =========================
  // SLIDER
  // =========================
  nextMatch() {
    if (this.currentIndex < this.matchs.length - 1) {
      this.currentIndex++;
      // console.log('➡️ Next index :', this.currentIndex);
    }
  }

  prevMatch() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      // console.log('⬅️ Prev index :', this.currentIndex);
    }
  }

  // =========================
  // UI HELPERS
  // =========================
  toggleInfos(match: any) {
    match.showInfos = !match.showInfos;
    // console.log('ℹ️ toggle infos :', match);
  }

  isToday(date: Date | string): boolean {
    const d = new Date(date);
    const t = new Date();

    const result =
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear();

    // console.log('📅 isToday :', date, result);

    return result;
  }

  isLive(match: Match): boolean {
    const result = this.matchService.isMatchLive(match);
    // console.log('🔴 isLive :', result);
    return result;
  }

  formatMinute(match: Match): string {
    const result = this.matchService.formaterMinute(match);
    // console.log('⏱️ minute :', result);
    return result;
  }

  progress(match: Match): number {
    const result = this.matchService.getProgressionMatch(match);
    // console.log('📊 progress :', result);
    return result;
  }

  // =========================
  // STYLE STATUT
  // =========================
  getStatutClass(statut: string | undefined): string {
    switch (statut) {

      case 'À venir':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';

      case 'Terminé':
      case 'Validé':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600';

      case 'En cours':
      case 'En attente':
        return 'bg-gradient-to-br from-amber-500 to-orange-500';

      case 'Annulé':
      case 'Reporté':
        return 'bg-gradient-to-br from-red-500 to-red-600';

      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  }

  // =========================
  // ICON STATUT
  // =========================
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