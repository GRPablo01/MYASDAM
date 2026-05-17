import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Match, MatchService } from '../../../../../Backend/Services/match.service';
import { EquipeService, Equipe } from '../../../../../Backend/Services/equipe.service';

import { Icon } from "../../../priver/icon/icon";
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-gestion-match',
  standalone: true,
  templateUrl: './gestion-match.html',
  styleUrl: './gestion-match.css',
  imports: [CommonModule, FormsModule, Icon],
})
export class GestionMatch implements OnInit {

  matchs: Match[] = [];
  equipes: Equipe[] = [];

  equipesCache: { [key: string]: Equipe } = {};

  loading = false;
  isLoading = false;
  error = '';

  showNotification = false;
  notificationMessage = '';

  showEditMatchModal = false;
  showDeleteMatchModal = false;

  selectedMatch: any = {};

  baseUrl = 'http://localhost:3000/uploads/';

  currentPage = 1;
  itemsPerPage = 8;

  constructor(
    private matchService: MatchService,
    private equipeService: EquipeService,
    private http: HttpClient,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.updateItemsPerPage();
  }

  // ======================
  // LOAD DATA
  // ======================
  loadData(): void {
    this.loading = true;

    this.equipeService.getEquipes().subscribe({
      next: (equipes) => {
        this.equipes = equipes;

        this.equipesCache = {};
        equipes.forEach(e => {
          if (e._id) this.equipesCache[e._id] = e;
        });

        this.loadMatchs();
      },
      error: () => {
        this.error = 'Erreur chargement équipes';
        this.loading = false;
      }
    });
  }

  loadMatchs(): void {
    this.matchService.getMatchs().subscribe({
      next: (data) => {
        this.matchs = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement matchs';
        this.loading = false;
      }
    });
  }

  // ======================
  // HELPERS
  // ======================
  getEquipe(id?: string) {
    return id ? this.equipesCache[id] : undefined;
  }

  getDomEquipe(m: Match) {
    return this.getEquipe(m.equipeDom)?.nom || 'Dom';
  }

  getExtEquipe(m: Match) {
    return this.getEquipe(m.equipeExt)?.nom || 'Ext';
  }

  getEquipeLogo(id?: string) {
    return this.equipeService.normalizeLogo(this.getEquipe(id)?.logo);
  }

  // ======================
  // MATCH UPDATE
  // ======================
  saveMatch(): void {
    if (!this.selectedMatch?._id) return;

    this.isLoading = true;

    this.matchService.updateMatch(this.selectedMatch._id, this.selectedMatch)
      .subscribe({
        next: (updated) => {
          this.matchs = this.matchs.map(m =>
            m._id === updated._id ? updated : m
          );

          this.showToast('Match modifié ✔️');
          this.showEditMatchModal = false;
        },
        error: (err) => console.error(err),
        complete: () => this.isLoading = false
      });
  }

  // ======================
  // DELETE
  // ======================
  confirmDeleteMatch(): void {
    const id = this.selectedMatch?._id;
    if (!id) return;

    this.matchService.deleteMatch(id).subscribe({
      next: () => {
        this.matchs = this.matchs.filter(m => m._id !== id);
        this.showToast('Match supprimé 🗑️');
        this.closeDeleteMatch();
      }
    });
  }

  getEquipeName(id: string | undefined): string {

    if (!id) {
      return 'Équipe inconnue';
    }
  
    const equipe = this.equipes.find(e => e._id === id);
  
    return equipe ? equipe.nom : 'Équipe inconnue';
  }

  // ======================
  // MODALS
  // ======================
  openEditMatch(m: Match) {
    this.selectedMatch = { ...m };
    this.showEditMatchModal = true;
  }

  closeEditMatch() {
    this.showEditMatchModal = false;
  }

  openDeleteMatch(m: Match) {
    this.selectedMatch = m;
    this.showDeleteMatchModal = true;
  }

  closeDeleteMatch() {
    this.showDeleteMatchModal = false;
  }

  // ======================
  // TOAST
  // ======================
  showToast(msg: string) {
    this.notificationMessage = msg;
    this.showNotification = true;

    setTimeout(() => this.showNotification = false, 3000);
  }

  closeNotification() {
    this.showNotification = false;
  }

  // ======================
  // PAGINATION
  // ======================
  @HostListener('window:resize')
  updateItemsPerPage() {
    const w = window.innerWidth;
    if (w >= 1280) this.itemsPerPage = 8;
    else if (w >= 1024) this.itemsPerPage = 6;
    else this.itemsPerPage = 4;
  }

  get matchsPagines() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.matchs.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.matchs.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}