import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../Backend/Services/User/Auth.Service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { FormsModule } from '@angular/forms';

interface IUser {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

interface IStats {
  total: number;
  admin: number;
  entraineur: number;
  user: number;
  active: number;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User implements OnInit {

  users: IUser[] = [];
  loading = false;
  error = '';

  viewMode: 'grid' | 'list' = 'grid';
  selectedFilter: string = 'Role';

  showModal = false;
  modalMode: 'view' | 'edit' | 'delete' = 'view';

  selectedUser: IUser | null = null;
  isLoading = false;

  // FORM
  editForm: any = {
    nom: '',
    prenom: '',
    email: '',
    role: ''
  };

  stats: IStats = {
    total: 0,
    admin: 0,
    entraineur: 0,
    user: 0,
    active: 0
  };

  isDropdownOpen = false;

  // =======================
  // TOAST
  // =======================
  showNotification = false;
  notificationMessage = '';

  constructor(
    private authService: AuthService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // =======================
  // TOAST
  // =======================
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

  // =======================
  // LOAD USERS
  // =======================
  loadUsers(): void {
    this.loading = true;

    // 🔹 Utilisateur connecté
    const currentUser = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    const currentRole = currentUser?.role;

    this.authService.getAllUsers().subscribe({
      next: (data: any) => {

        const allUsers = Array.isArray(data) ? data : data?.users || [];

        // =========================
        // 🔐 FILTRAGE PAR ROLE
        // =========================

        if (currentRole === 'superadmin') {

          // 👉 voit tout
          this.users = allUsers;

        } else if (currentRole === 'admin') {

          // 👉 voit tout sauf admin et superadmin
          this.users = allUsers.filter((u: any) =>
            u.role !== 'admin' && u.role !== 'superadmin'
          );

        } else {

          // 👉 utilisateur classique : seulement lui-même
          this.users = allUsers.filter((u: any) =>
            u._id === currentUser._id
          );
        }

        this.updateStats();
        this.loading = false;
      },

      error: () => {
        this.error = 'Erreur chargement utilisateurs';
        this.loading = false;
      }
    });
  }

  // =======================
  // FILTER
  // =======================
  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  get filteredUsers(): IUser[] {
    if (!this.users) return [];

    switch (this.selectedFilter) {
      case 'admin':
        return this.users.filter(u => u.role?.toLowerCase() === 'admin');

      case 'entraineur':
        return this.users.filter(u => u.role?.toLowerCase() === 'entraineur');

      case 'user':
        return this.users.filter(u =>
          ['user', 'joueur', 'inviter'].includes(u.role?.toLowerCase())
        );

      default:
        return this.users;
    }
  }

  // =======================
  // STATS
  // =======================
  updateStats(): void {
    this.stats = {
      total: this.users.length,
      admin: this.users.filter(u => u.role === 'admin').length,
      entraineur: this.users.filter(u => u.role === 'entraineur').length,
      user: this.users.length,
      active: this.users.filter(u => u.isActive !== false).length
    };
  }

  // =======================
  // ROLE
  // =======================
  getRoleColor(user: IUser): string {
    switch (user.role) {
      case 'admin': return '#dc2626';
      case 'entraineur': return '#2563eb';
      default: return '#16a34a';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Admin';
      case 'entraineur': return 'Coach';
      default: return 'Joueur';
    }
  }

  // =======================
  // MODAL
  // =======================
  openModal(user: IUser, mode: 'view' | 'edit' | 'delete'): void {
    this.selectedUser = user;
    this.modalMode = mode;
    this.showModal = true;

    this.editForm = { ...user };
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }

  // =======================
  // UPDATE USER
  // =======================
  saveUser(): void {
    if (!this.selectedUser) return;

    const payload = {
      nom: this.editForm.nom,
      prenom: this.editForm.prenom,
      email: this.editForm.email,
      role: this.editForm.role
    };

    this.isLoading = true;

    this.authService.updateUser(this.selectedUser._id, payload)
      .subscribe({
        next: (res: any) => {

          this.users = this.users.map(u =>
            u._id === res._id ? res : u
          );

          this.showToast('Utilisateur modifié avec succès ✔️');

          this.closeModal();
          this.loadUsers();
        },

        error: () => { },
        complete: () => this.isLoading = false
      });
  }

  // =======================
  // DELETE USER
  // =======================
  deleteUser(): void {
    console.log('🟡 DELETE CLICKED');

    if (!this.selectedUser?._id) {
      console.log('🔴 No selected user or missing ID');
      return;
    }

    const id = this.selectedUser._id;

    this.authService.deleteUser(id).subscribe({
      next: (res) => {
        this.users = this.users.filter(u => u._id !== id);

        this.showToast('Utilisateur supprimé avec succès 🗑️');
        this.closeModal();
      },

      error: (err) => {
        console.error('🔴 DELETE ERROR:', err);
      }
    });
  }

  // =====================================================
  // PAGINATION
  // =====================================================

  currentPage: number = 1;
  itemsPerPage: number = 4;

  // USERS PAGINATED
  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.filteredUsers.slice(start, end);
  }

  // TOTAL PAGES
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  // PAGE ARRAY
  get pages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  // GO PAGE
  goToPage(page: number): void {
    this.currentPage = page;
  }

  // NEXT
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // PREVIOUS
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // =======================
  // DROPDOWN
  // =======================
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}