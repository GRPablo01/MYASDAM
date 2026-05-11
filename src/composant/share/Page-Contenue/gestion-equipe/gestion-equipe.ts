import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Equipe, EquipeService } from '../../../../../Backend/Services/equipe.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-gestion-equipe',
  standalone: true,
  templateUrl: './gestion-equipe.html',
  styleUrl: './gestion-equipe.css',
  imports: [CommonModule, FormsModule],
})
export class GestionEquipe implements OnInit {

  equipes: Equipe[] = [];

  loading = false;
  error = '';

  showNotification: boolean = false;
  notificationMessage: string = '';

  modalOpen = false;
  modalMode: 'edit' | 'delete' = 'edit';
  selectedEquipe: any = {};

  constructor(private equipeService: EquipeService,
     public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadEquipes();
  }

  // ================= LOAD =================
  loadEquipes(): void {
    this.loading = true;

    this.equipeService.getEquipes().subscribe({
      next: (data) => {
        this.equipes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur chargement équipes';
        this.loading = false;
      }
    });
  }

  getLogoUrl(logo: string): string {
    if (!logo) return 'assets/ImageEquipe.png';
  
    return `http://localhost:3000/${logo}`;
  }

  // ================= MODAL =================
  openModal(mode: 'edit' | 'delete', equipe: any) {
    this.modalMode = mode;
    this.selectedEquipe = { ...equipe };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
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

  save() {
    console.log('UPDATE équipe', this.selectedEquipe);

    // 👉 exemple API update
    // this.equipeService.updateEquipe(this.selectedEquipe._id, this.selectedEquipe).subscribe(...)

    this.closeModal();
  }

  confirmDelete() {
    console.log('DELETE équipe', this.selectedEquipe);

    // 👉 exemple API delete
    // this.equipeService.deleteEquipe(this.selectedEquipe._id).subscribe(...)

    this.equipes = this.equipes.filter(e => e._id !== this.selectedEquipe._id);

    this.closeModal();
  }

  // ================= ACTIONS =================
  voirEquipe(eq: any) {
    console.log('Détails équipe :', eq);
  }
}