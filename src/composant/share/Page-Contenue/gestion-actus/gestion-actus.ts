import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActusService, Actu } from '../../../../../Backend/Services/actus.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { HttpClient } from '@angular/common/http';

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

  // =======================
  // LOG API
  // =======================
  logUrl = 'http://localhost:3000/api/logs';

  // =========================
  // UI STATE
  // =========================
  loading = false;
  error = '';
  isLoading = false;

  showNotification = false;
  notificationMessage = '';

  // =========================
  // MODAL
  // =========================
  modalOpen = false;
  modalMode: 'edit' | 'delete' = 'edit';

  selectedEvent: any = {
    _id: '',
    key: '',
    titre: '',
    description: '',
    auteur: '',
    image: ''
  };

  constructor(
    private actusService: ActusService,
    public themeService: ThemeService,
    private http: HttpClient,
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
  // OPEN EDIT
  // =========================
  voirActu(actu: Actu): void {

    this.modalMode = 'edit';

    this.selectedEvent = {
      ...actu,
      imageFile: null
    };

    this.modalOpen = true;

  }

  // =========================
  // OPEN DELETE
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

  // =========================
  // TOAST
  // =========================
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

  // =========================
  // HANDLE IMAGE
  // =========================
  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedEvent.imageFile = file;
    }
  }
// =======================
// USER CONNECTÉ
// =======================
getCurrentUser(): any {
  const user = localStorage.getItem('utilisateur');

  return user ? JSON.parse(user) : {
    prenom: 'Inconnu',
    nom: '',
    role: 'unknown'
  };
}

// =========================
// SAVE (UPDATE ACTU)
// =========================
save(): void {

  console.log('🚀 START UPDATE ACTU');

  if (!this.selectedEvent) return;

  const formData = new FormData();

  formData.append('titre', this.selectedEvent.titre || '');
  formData.append('auteur', this.selectedEvent.auteur || '');
  formData.append('description', this.selectedEvent.description || '');

  if (this.selectedEvent.imageFile) {
    formData.append('image', this.selectedEvent.imageFile);
  }

  const id = this.selectedEvent._id;

  console.log('ID UPDATE UTILISÉ:', id);

  if (!id) {
    console.error('❌ ID manquant pour update');
    return;
  }

  this.isLoading = true;

  this.actusService.updateActu(id, formData)
    .subscribe({

      next: (res: any) => {

        console.log('✅ ACTU UPDATED', res);

        // mise à jour locale si tu as un tableau
        this.actus = this.actus.map(a =>
          a._id === res._id ? res : a
        );

        this.showToast('Actualité modifiée avec succès ✔️');

        const user = this.getCurrentUser();

        const logData = {
          user: `${user.prenom} ${user.nom}`,
          role: user.role,
          action: 'UPDATE_ACTU',
          description: `${user.role} a modifié une actualité`,
          type: 'UPDATE',
          field: 'actu',
          oldValue: this.selectedEvent,
          newValue: {
            titre: this.selectedEvent.titre,
            auteur: this.selectedEvent.auteur,
            description: this.selectedEvent.description
          },
          date: new Date()
        };

        this.http.post(this.logUrl, logData).subscribe();

        this.modalOpen = false;
        this.loadActus();
      },

      error: (err) => console.error('❌ UPDATE ACTU ERROR', err),

      complete: () => this.isLoading = false
    });
}


// =========================
// CONFIRM DELETE ACTU
// =========================
confirmDelete(): void {

  console.log('🚀 START DELETE ACTU');

  const id = this.selectedEvent?._id;

  console.log('ID DELETE UTILISÉ:', id);

  if (!id) {
    console.error('❌ ID manquant pour delete');
    return;
  }

  this.actusService.deleteActu(id)
    .subscribe({

      next: () => {

        console.log('✅ ACTU DELETED');

        this.actus = this.actus.filter(a => a._id !== id);

        this.showToast('Actualité supprimée 🗑️');

        const user = this.getCurrentUser();

        const logData = {
          user: `${user.prenom} ${user.nom}`,
          role: user.role,
          action: 'DELETE_ACTU',
          description: `${user.role} a supprimé une actualité`,
          type: 'DELETE',
          field: 'actu',
          oldValue: this.selectedEvent,
          date: new Date()
        };

        this.http.post(this.logUrl, logData).subscribe();

        this.modalOpen = false;
      },

      error: (err) => console.error('❌ DELETE ACTU ERROR', err)
    });
}
}