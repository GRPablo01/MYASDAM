import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Match, MatchService } from '../../../../../Backend/Services/match.service';
import { EventService } from '../../../../../Backend/Services/Event.Service';
import { ActusService, Actu } from '../../../../../Backend/Services/actus.service';
import { Convocation, ConvocationService } from '../../../../../Backend/Services/convocation.service';
import { Equipe, EquipeService } from '../../../../../Backend/Services/equipe.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { FormsModule } from '@angular/forms';
import { GestionMatch } from '../gestion-match/gestion-match';
import { GestionEvent } from '../gestion-event/gestion-event';
import { GestionActus } from '../gestion-actus/gestion-actus';
import { GestionConvoque } from '../gestion-convoque/gestion-convoque';
import { GestionEquipe } from '../gestion-equipe/gestion-equipe';




@Component({
  selector: 'app-cont',
  standalone: true,
  templateUrl: './cont.html',
  styleUrl: './cont.css',
  imports: [CommonModule, FormsModule,GestionMatch,GestionEvent,GestionActus,GestionConvoque,GestionEquipe],
})
export class Cont implements OnInit {

  // DATA
  matchs: Match[] = [];
  events: any[] = [];
  actus: Actu[] = [];
  convocations: Convocation[] = [];
  equipes: Equipe[] = [];

  activeTab: string = 'matchs';  // Matchs par défaut

  // Propriétés pour les stats (optionnel)
  matchsEnDirect: number = 0;
  eventsAVenir: number = 0;
  nouvellesActus: number = 0;
  nombreEquipes: number = 0;

  // UI STATE
  loading = false;
  error = '';

  constructor(
    private matchService: MatchService,
    private eventService: EventService,
    private actusService: ActusService,
    private convocationService: ConvocationService,
    private equipeService: EquipeService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // 🔥 CHARGE TOUT
  loadAll(): void {
    this.loading = true;
    this.error = '';

    this.loadMatchs();
    this.loadEvents();
    this.loadActus();
    this.loadConvocations();
    this.loadEquipes();
  }

  // MATCHS
  loadMatchs(): void {
    this.matchService.getMatchs().subscribe({
      next: (data) => this.matchs = data,
      error: (err) => {
        console.error(err);
        this.error = 'Erreur chargement matchs';
      }
    });
  }

  // EVENTS
  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.warn('Events error', err)
    });
  }

  // ACTUS
  loadActus(): void {
    this.actusService.getAllActus().subscribe({
      next: (data) => this.actus = data,
      error: (err) => console.warn('Actus error', err)
    });
  }

  // CONVOCATIONS
  loadConvocations(): void {
    this.convocationService.getConvocations().subscribe({
      next: (data) => this.convocations = data,
      error: (err) => console.warn('Convocations error', err)
    });
  }

  // EQUIPES
  loadEquipes(): void {
    this.equipeService.getEquipes().subscribe({
      next: (data) => {
        this.equipes = data;
        this.loading = false; // fin globale
      },
      error: (err) => {
        console.warn('Equipes error', err);
        this.loading = false;
      }
    });
  }

  // UTIL MATCH
  getMinute(match: Match): string {
    return this.matchService.formaterMinute(match);
  }

  isLive(match: Match): boolean {
    return this.matchService.isMatchLive(match);
  }

  // 🔍 Voir les détails d’un match
voirDetailsMatch(match: any): void {
  console.log('Détails match :', match);

  // 👉 Exemple simple (popup ou console)
  // Tu peux ici ouvrir une modal, drawer ou page détail
}

// ⭐ Suivre / Favori un match
suivreMatch(match: any): void {
  console.log('Suivre match :', match);

  // 👉 Exemple simple toggle
  match.suivi = !match.suivi;

  // 👉 Si backend plus tard :
  // this.matchService.followMatch(match._id).subscribe(...)
}

voirDetailsEvent(event: any): void {
  console.log('Event details:', event);
}

deleteEvent(event: any): void {
  console.log('Participation event:', event);

  event.participe = !event.participe;
}

supprimerMatch(id: string) {
  this.matchService.deleteMatch(id).subscribe(() => {
    this.matchs = this.matchs.filter(m => m._id !== id);
  });
}

modalOpen = false;
modalMode: 'edit' | 'delete' = 'edit';
selectedItem: any = {};

openModal(mode: 'edit' | 'delete', item: any) {
  this.modalMode = mode;
  this.selectedItem = { ...item };
  this.modalOpen = true;
}

closeModal() {
  this.modalOpen = false;
}

save() {
  // appel API update
  console.log('UPDATE', this.selectedItem);
  this.closeModal();
}

confirmDelete() {
  // appel API delete
  console.log('DELETE', this.selectedItem);
  this.closeModal();
}
}