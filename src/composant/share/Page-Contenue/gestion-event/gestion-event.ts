import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventService } from '../../../../../Backend/Services/Event.Service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-gestion-event',
  standalone: true,
  templateUrl: './gestion-event.html',
  styleUrl: './gestion-event.css',
  imports: [CommonModule, FormsModule],
})
export class GestionEvent implements OnInit {

  // ================= DATA =================
  events: any[] = [];

  // ================= UI STATE =================
  loading = false;
  error = '';
  saving = false;
  deleting = false;
  showNotification: boolean = false;
  notificationMessage: string = '';

  // ================= MODAL =================
  modalOpen = false;
  modalMode: 'edit' | 'delete' = 'edit';
  selectedEvent: any = null;

  constructor(
    private eventService: EventService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadEvents();

    this.updateItemsPerPage();

    window.addEventListener('resize', () => {
      this.updateItemsPerPage();
    });
  }

  // ================= LOAD =================
  loadEvents(): void {
    this.loading = true;
    this.error = '';

    this.eventService.getEvents().subscribe({
      next: (data: any) => {
        this.events = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors du chargement des événements";
        this.loading = false;
      }
    });
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

  // ================= OPEN MODAL =================
  openModal(mode: 'edit' | 'delete', event: any): void {
    this.modalMode = mode;
    this.selectedEvent = { ...event };
    this.modalOpen = true;
  }

  // ================= CLOSE =================
  closeModal(): void {
    this.modalOpen = false;
    this.selectedEvent = null;
  }

  // ================= DELETE =================
  confirmDelete(): void {
    if (!this.selectedEvent?._id) return;
  
    this.deleting = true;
  
    this.eventService.deleteEvent(this.selectedEvent._id).subscribe({
      next: () => {
  
        this.events = this.events.filter(e => e._id !== this.selectedEvent._id);
  
        this.deleting = false;
        this.closeModal();
  
        // ✅ TOAST SUCCESS
        this.showToast('Événement supprimé avec succès !');
  
      },
      error: (err) => {
        console.error(err);
        this.deleting = false;
      }
    });
  }

  // ================= UPDATE =================
  save(): void {
    if (!this.selectedEvent?._id) return;
  
    const payload = {
      titre: this.selectedEvent.titre,
      description: this.selectedEvent.description,
      date: this.selectedEvent.date,
      lieu: this.selectedEvent.lieu,
      heureDebut: this.selectedEvent.heureDebut,
      heureFin: this.selectedEvent.heureFin,
      theme: this.selectedEvent.theme,
      categorie: this.selectedEvent.categorie,
      statut: this.selectedEvent.statut
    };
  
    this.saving = true;
  
    this.eventService.updateEvent(this.selectedEvent._id, payload).subscribe({
      next: (updated: any) => {
  
        const index = this.events.findIndex(e => e._id === updated._id);
        if (index !== -1) this.events[index] = updated;
  
        this.saving = false;
        this.closeModal();
  
        // ✅ TOAST SUCCESS
        this.showToast('Événement modifié avec succès !');
  
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
      }
    });
  }

  // ================= TRACK =================
  trackById(index: number, item: any): string {
    return item._id;
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

  return this.events.slice(
    start,
    start + this.itemsPerPage
  );

}

// =====================================================
// TOTAL PAGES
// =====================================================

get totalPages(): number {

  return Math.ceil(
    this.events.length / this.itemsPerPage
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