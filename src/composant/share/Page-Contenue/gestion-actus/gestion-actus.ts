import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActusService, Actu } from '../../../../../Backend/Services/actus.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-gestion-actus',
  standalone: true,
  templateUrl: './gestion-actus.html',
  styleUrl: './gestion-actus.css',
  imports: [CommonModule, FormsModule],
})
export class GestionActus implements OnInit {

  // =========================
  // DATA
  // =========================
  actus: Actu[] = [];

  // =========================
  // UI STATE
  // =========================
  loading = false;
  error = '';
  showNotification: boolean = false;
  notificationMessage: string = '';

  // =========================
  // MODAL
  // =========================
  modalOpen = false;
  modalMode: 'edit' | 'delete' = 'edit';

  selectedEvent: any = {
    _id: '',
    titre: '',
    description: '',
    auteur: ''
  };

  constructor(
    private actusService: ActusService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadActus();
  }

  // =========================
  // LOAD ACTUS
  // =========================
  loadActus(): void {

    this.loading = true;
    this.error = '';

    this.actusService.getAllActus().subscribe({

      next: (data) => {

        this.actus = data;
        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.error = 'Erreur lors du chargement des actualités';

        this.loading = false;

      }

    });

  }

  // =========================
  // VIEW
  // =========================
  voirActu(actu: Actu): void {

    this.modalMode = 'edit';

    this.selectedEvent = {
      ...actu
    };

    this.modalOpen = true;

  }

  // =========================
  // DELETE MODAL
  // =========================
  supprimerActu(id: string): void {

    const actu = this.actus.find(a => a._id === id);

    if (!actu) return;

    this.modalMode = 'delete';

    this.selectedEvent = {
      ...actu
    };

    this.modalOpen = true;

  }

  // =========================
  // CLOSE MODAL
  // =========================
  closeModal(): void {

    this.modalOpen = false;

  }

  showToast(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;
  
    // auto hide
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
  
  closeNotification(): void {
    this.showNotification = false;
  }

  // =========================
  // SAVE (MODIFICATION)
  // =========================
  save(): void {

    console.log('SAVE ACTU:', this.selectedEvent);
  
    this.actusService.updateActu(this.selectedEvent.key, this.selectedEvent)
      .subscribe({
        next: (res) => {
          console.log('Actu modifiée:', res);
  
          this.loadActus();
          this.modalOpen = false;
  
          // ✅ TOAST SUCCESS
          this.showToast('Actualité modifiée avec succès !');
        },
        error: (err) => {
          console.error('Erreur update:', err);
        }
      });
  
  }

  // =========================
  // CONFIRM DELETE
  // =========================
  confirmDelete(): void {

    console.log('DELETE ACTU:', this.selectedEvent.key);

    this.actusService.deleteActu(this.selectedEvent.key)
      .subscribe({
        next: (res) => {
          console.log('Actu supprimée:', res);

          this.loadActus();
          this.modalOpen = false;

          // ✅ TOAST SUCCESS
          this.showToast('Actualité supprimée avec succès !');
        },
        error: (err) => {
          console.error('Erreur delete:', err);
        }
      });

  }
}