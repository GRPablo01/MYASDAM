import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../../../Backend/Services/message.Service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

@Component({
  selector: 'app-commun',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commun.html',
  styleUrl: './commun.css',
})
export class Commun implements OnInit {

  // ==========================================
  // DATA
  // ==========================================
  messages: any[] = [];
  paginatedMessages: any[] = [];
  selectedMessage: any = null;
  editForm: any = {};

  // ==========================================
  // LOADING & VIEW
  // ==========================================
  loading: boolean = false;
  viewMode: string = 'grid';

  // ==========================================
  // FILTER
  // ==========================================
  isDropdownOpen: boolean = false;
  selectedFilter: string = 'Tous';

  // ==========================================
  // PAGINATION
  // ==========================================
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  pages: number[] = [];

  // ==========================================
  // MODAL
  // ==========================================
  showModal: boolean = false;
  modalMode: 'view' | 'edit' | 'delete' | null = null;

  // ==========================================
  // NOTIFICATION
  // ==========================================
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationTimeout: any;

  constructor(
    private messageService: MessageService,
    public themeService: ThemeService
  ) {
    // console.log('🚀 Commun component chargé');
  }

  ngOnInit(): void {
    // console.log('📦 ngOnInit déclenché');
    this.loadMessages();
  }

  // ==========================================
  // CHARGER TOUS LES MESSAGES
  // ==========================================
  loadMessages(): void {
    // console.log('🔎 Début loadMessages()');
    this.loading = true;

    this.messageService.getAllMessages().subscribe({
      next: (res) => {
        // console.log('📨 Réponse brute API :', res);
        // console.log('📊 Type de réponse :', typeof res);
        // console.log('📦 Est-ce un tableau ? :', Array.isArray(res));

        this.messages = res || [];
        this.applyFilter();

        // console.log('✅ Messages stockés dans le composant :', this.messages);
        // console.log('📏 Nombre de messages :', this.messages?.length);
      },

      error: (err) => {
        console.error('❌ Erreur lors du chargement des messages :', err);
        console.error('🔴 Status HTTP :', err?.status);
        console.error('🧾 Body erreur :', err?.error);
        this.loading = false;
      },

      complete: () => {
        // console.log('🏁 Observable terminé (getAllMessages)');
        this.loading = false;
      }
    });
  }

  // ==========================================
  // FILTRE
  // ==========================================
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  setFilter(filter: string): void {
    this.selectedFilter = this.getFilterLabel(filter);
    this.currentPage = 1;
    this.applyFilter();
  }

  getFilterLabel(filter: string): string {
    const labels: { [key: string]: string } = {
      'all': 'Tous',
      'received': 'Reçus',
      'sent': 'Envoyés',
      'unread': 'Non lus'
    };
    return labels[filter] || 'Tous';
  }

  applyFilter(): void {
    let filtered = [...this.messages];

    switch (this.selectedFilter) {
      case 'Reçus':
        // Adapter selon votre logique métier
        filtered = this.messages.filter(m => m.destinataireId === 'currentUser');
        break;
      case 'Envoyés':
        filtered = this.messages.filter(m => m.expediteurId === 'currentUser');
        break;
      case 'Non lus':
        filtered = this.messages.filter(m => m.lu === false);
        break;
      default:
        filtered = [...this.messages];
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;
    this.updatePagesArray();
    this.updatePaginatedMessages(filtered);
  }

  // ==========================================
  // PAGINATION
  // ==========================================
  updatePagesArray(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePaginatedMessages(filtered: any[] = this.messages): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedMessages = filtered.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilter();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilter();
    }
  }

  // ==========================================
  // COULEURS & LABELS MESSAGES
  // ==========================================
  getMessageColor(msg: any): string {
    switch (msg?.type) {
      case 'urgent': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return this.themeService.primary || '#6366f1';
    }
  }

  getMessageLabel(type: string): string {
    switch (type) {
      case 'urgent': return 'Urgent';
      case 'info': return 'Information';
      default: return 'Standard';
    }
  }

  // ==========================================
  // MODALS
  // ==========================================
  openModal(msg: any, mode: 'view' | 'edit' | 'delete'): void {
    this.selectedMessage = { ...msg };
    this.modalMode = mode;

    if (mode === 'edit') {
      this.editForm = { ...msg };
    }

    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    this.modalMode = null;
    this.selectedMessage = null;
    this.editForm = {};
    document.body.style.overflow = '';
  }

  // ==========================================
  // CRUD ACTIONS
  // ==========================================
  saveMessage(): void {
    if (!this.editForm || !this.selectedMessage) return;

    this.messageService.updateMessage(this.selectedMessage.id, this.editForm).subscribe({
      next: () => {
        this.showSuccess('Message modifié avec succès');
        this.closeModal();
        this.loadMessages();
      },
      error: (err) => {
        console.error('Erreur modification:', err);
        this.showSuccess('Erreur lors de la modification');
      }
    });
  }

  deleteMessage(): void {
    const messageId = this.selectedMessage?._id || this.selectedMessage?.id;
  
    if (!messageId) return;
  
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        this.showSuccess('Message supprimé avec succès');
        this.closeModal();
        this.loadMessages(); // refresh UI
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        this.showSuccess('Erreur lors de la suppression');
      }
    });
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  showSuccess(message: string): void {
    this.notificationMessage = message;
    this.showNotification = true;

    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      this.closeNotification();
    }, 3000);
  }

  closeNotification(): void {
    this.showNotification = false;
    this.notificationMessage = '';
  }

  // ==========================================
  // LIFECYCLE
  // ==========================================
  ngOnDestroy(): void {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  }
}