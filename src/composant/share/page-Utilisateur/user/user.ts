import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../../../../Backend/Services/User/Auth.Service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';

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
  // NOTIFICATIONS
  // =======================
  showNotification = false;
  notificationMessage = '';

  // =======================
  // LOG API
  // =======================
  logUrl = 'http://localhost:3000/api/logs';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
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

    const currentUser = JSON.parse(localStorage.getItem('utilisateur') || '{}');
    const currentRole = currentUser?.role;

    this.authService.getAllUsers().subscribe({
      next: (data: any) => {

        const allUsers = Array.isArray(data) ? data : data?.users || [];

        if (currentRole === 'superadmin') {
          this.users = allUsers;
        }

        else if (currentRole === 'admin') {
          this.users = allUsers.filter((u: any) =>
            u.role !== 'admin' && u.role !== 'superadmin'
          );
        }

        else {
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

    const role = (u: IUser) => u.role?.toLowerCase() || '';

    switch (this.selectedFilter) {

      case 'superadmin':
        return this.users.filter(u =>
          ['joueur', 'inviter', 'entraineur', 'admin'].includes(role(u))
        );

      case 'admin':
        return this.users.filter(u =>
          ['joueur', 'inviter', 'entraineur'].includes(role(u))
        );

      case 'entraineur':
        return this.users.filter(u =>
          ['joueur', 'inviter'].includes(role(u))
        );

      case 'user':
        return this.users.filter(u =>
          ['joueur', 'inviter'].includes(role(u))
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
  // ROLE COLOR
  // =======================
  getRoleColor(user: IUser): string {
    switch (user.role?.toLowerCase()) {

      case 'superadmin': return '#7c3aed';
      case 'admin': return '#dc2626';
      case 'entraineur': return '#2563eb';
      case 'joueur':
      case 'user': return '#16a34a';
      case 'inviter': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Admin';
      case 'superadmin': return 'Super Admin';
      case 'entraineur': return 'Entraineur';
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

  // =======================
  // UPDATE USER
  // =======================
  saveUser(): void {

    console.log('🚀 START UPDATE USER');

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

          console.log('✅ USER UPDATED', res);

          this.users = this.users.map(u =>
            u._id === res._id ? res : u
          );

          this.showToast('Utilisateur modifié avec succès ✔️');

          const user = this.getCurrentUser();

          const logData = {
            user: `${user.prenom} ${user.nom}`,
            role: user.role,
            action: 'UPDATE_USER',
            description: `${user.role} a modifié un utilisateur`,
            type: 'UPDATE',
            field: 'user',
            oldValue: this.selectedUser,
            newValue: payload,
            date: new Date()
          };

          this.http.post(this.logUrl, logData).subscribe();

          this.closeModal();
          this.loadUsers();
        },

        error: (err) => console.error('❌ UPDATE ERROR', err),

        complete: () => this.isLoading = false
      });
  }

  // =======================
  // DELETE USER
  // =======================
  deleteUser(): void {

    if (!this.selectedUser?._id) return;

    const id = this.selectedUser._id;

    this.authService.deleteUser(id).subscribe({

      next: () => {

        this.users = this.users.filter(u => u._id !== id);

        this.showToast('Utilisateur supprimé 🗑️');

        const user = this.getCurrentUser();

        const logData = {
          user: `${user.prenom} ${user.nom}`,
          role: user.role,
          action: 'DELETE_USER',
          description: `${user.role} a supprimé un utilisateur`,
          type: 'DELETE',
          field: 'user',
          oldValue: this.selectedUser,
          date: new Date()
        };

        this.http.post(this.logUrl, logData).subscribe();

        this.closeModal();
      },

      error: (err) => console.error('❌ DELETE ERROR', err)
    });
  }

  // =======================
  // PAGINATION
  // =======================
  currentPage = 1;
  itemsPerPage = 4;

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
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