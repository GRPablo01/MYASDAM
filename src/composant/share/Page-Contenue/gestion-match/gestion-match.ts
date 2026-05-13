import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Match, MatchService } from '../../../../../Backend/Services/match.service';
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
  loading = false;
  error = '';

  showNotification: boolean = false;
  notificationMessage: string = '';

  showEditMatchModal = false;
  showDeleteMatchModal = false;

  selectedMatch: any = {};

  constructor(
    private matchService: MatchService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadMatchs();

    this.updateItemsPerPage();

    window.addEventListener('resize', () => {
      this.updateItemsPerPage();
    });
  }

  // ======================
  // LOAD MATCHS
  // ======================
  loadMatchs(): void {
    this.loading = true;
    this.error = '';

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
  // UTILITIES
  // ======================
  getMinute(match: Match): string {
    return this.matchService.formaterMinute(match);
  }

  isLive(match: Match): boolean {
    return this.matchService.isMatchLive(match);
  }

  // ======================
  // EDIT MATCH
  // ======================
  openEditMatch(match: Match) {
    this.selectedMatch = { ...match };
    this.showEditMatchModal = true;
  }

  closeEditMatch() {
    this.showEditMatchModal = false;
  }

  showToast(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
  
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
  
  closeNotification(): void {
    this.showNotification = false;
  }

  // ======================
  // DELETE MATCH
  // ======================
  openDeleteMatch(match: Match) {
    this.selectedMatch = match;
    this.showDeleteMatchModal = true;
  }

  closeDeleteMatch() {
    this.showDeleteMatchModal = false;
  }

  confirmDeleteMatch() {
    if (!this.selectedMatch?._id) return;
  
    this.matchService.deleteMatch(this.selectedMatch._id)
      .subscribe({
        next: () => {
  
          this.matchs = this.matchs.filter(m => m._id !== this.selectedMatch._id);
          this.closeDeleteMatch();
  
          // ✅ TOAST SUCCESS
          this.showToast('Match supprimé avec succès !');
  
        },
        error: (err) => {
          console.error('Erreur suppression match', err);
        }
      });
  }

  saveMatch() {
    if (!this.selectedMatch?._id) return;
  
    this.matchService.updateMatch(this.selectedMatch._id, this.selectedMatch)
      .subscribe({
        next: (updated) => {
  
          const index = this.matchs.findIndex(m => m._id === updated._id);
  
          if (index !== -1) {
            this.matchs[index] = updated;
          }
  
          this.showEditMatchModal = false;
  
          // ✅ TOAST SUCCESS
          this.showToast('Match modifié avec succès !');
  
        },
        error: (err) => {
          console.error('Erreur update match', err);
        }
      });
  }


  // ======================
  // UI ACTIONS
  // ======================
  voirDetailsMatch(match: Match) {
    console.log(match);
  }

  refreshMatchs() {
    this.loadMatchs();
  }

  // =====================================================
// PAGINATION RESPONSIVE
// =====================================================

currentPage = 1;

itemsPerPage = 8;



// =====================================================
// RESPONSIVE ITEMS
// =====================================================

updateItemsPerPage(): void {

  const width = window.innerWidth;

  // DESKTOP XL = 4 x 2
  if (width >= 1280) {

    this.itemsPerPage = 8;

  }

  // LAPTOP = 3 x 2
  else if (width >= 1024) {

    this.itemsPerPage = 6;

  }

  // TABLETTE = 2 x 2
  else if (width >= 768) {

    this.itemsPerPage = 4;

  }

  // MOBILE = 1 x 4
  else {

    this.itemsPerPage = 4;

  }

}

// =====================================================
// MATCHS PAGINÉS
// =====================================================

get matchsPagines() {

  const start = (this.currentPage - 1) * this.itemsPerPage;

  return this.matchs.slice(
    start,
    start + this.itemsPerPage
  );

}

// =====================================================
// TOTAL PAGES
// =====================================================

get totalPages(): number {

  return Math.ceil(
    this.matchs.length / this.itemsPerPage
  );

}

// =====================================================
// NEXT
// =====================================================

nextPage(): void {

  if (this.currentPage < this.totalPages) {

    this.currentPage++;

    this.scrollTop();

  }

}

// =====================================================
// PREV
// =====================================================

prevPage(): void {

  if (this.currentPage > 1) {

    this.currentPage--;

    this.scrollTop();

  }

}

// =====================================================
// SCROLL TOP
// =====================================================

scrollTop(): void {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}
}