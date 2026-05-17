import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Convocation, ConvocationService } from '../../../../../Backend/Services/convocation.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-gestion-convoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-convoque.html',
  styleUrl: './gestion-convoque.css',
})
export class GestionConvoque implements OnInit {

  convocations: Convocation[] = [];

  loading = false;
  error = '';

  showNotification: boolean = false;
  notificationMessage: string = '';

  // MODAL
  modalOpen = false;
  modalMode: 'edit' | 'delete' = 'edit';
  selectedItem: any = {};

  constructor(private convocationService: ConvocationService,
     public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadConvocations();
  }

  loadConvocations(): void {
    this.loading = true;

    this.convocationService.getConvocations().subscribe({
      next: (data) => {
        this.convocations = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur chargement convocations';
        this.loading = false;
      }
    });
  }

  // OPEN MODAL
  openModal(mode: 'edit' | 'delete', item: any) {
    this.modalMode = mode;
    this.selectedItem = { ...item };
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
    console.log('UPDATE convocation', this.selectedItem);
  
    if (!this.selectedItem?._id) {
      console.error('❌ ID manquant');
      return;
    }
  
    this.convocationService.updateConvocation(
      this.selectedItem._id,
      this.selectedItem
    ).subscribe({
      next: (res) => {
        console.log('✅ Convocation mise à jour', res);
  
        const index = this.convocations.findIndex(
          c => c._id === this.selectedItem._id
        );
  
        if (index !== -1) {
          this.convocations[index] = {
            ...this.convocations[index],
            ...res
          };
        }
  
        this.closeModal();
  
        this.showToast('Convocation modifiée avec succès !');
      },
      error: (err) => {
        console.error('❌ Erreur update convocation', err);
      }
    });
  }

  confirmDelete() {
    console.log('DELETE convocation', this.selectedItem);
  
    if (!this.selectedItem?._id) {
      console.error('❌ ID manquant');
      return;
    }
  
    this.convocationService.deleteConvocation(
      this.selectedItem._id
    ).subscribe({
      next: () => {
        console.log('🗑️ Convocation supprimée');
  
        this.convocations = this.convocations.filter(
          c => c._id !== this.selectedItem._id
        );
  
        this.closeModal();
  
        this.showToast('Convocation supprimée avec succès !');
      },
      error: (err) => {
        console.error('❌ Erreur delete convocation', err);
      }
    });
  }
}