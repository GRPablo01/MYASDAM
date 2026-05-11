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
}