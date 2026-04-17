import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../Backend/Services/User/Auth.Service';
import { ThemeService } from '../../../../Backend/Services/theme.service';

interface IUser {
  id: string;
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
  inviter: number
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User implements OnInit {

  users: IUser[] = [];
  filteredUsers: IUser[] = [];

  loading = false;
  error = '';
  hover = '';
  hoveredBtn: string | null = null;
  

  searchTerm = '';
  selectedRole = 'all';
  sortBy = 'nom';
  viewMode: 'grid' | 'list' = 'grid';

  selectedUser: IUser | null = null;
  showModal = false;
  modalMode: 'edit' | 'delete' | 'view' = 'view';

  // ✅ STATS CLEAN (sans inviter)
  stats: IStats = {
    total: 0,
    admin: 0,
    entraineur: 0,
    user: 0,
    active: 0,
    inviter :0,
  };

  

  readonly roles = [
    { value: 'superadmin', label: 'Super Admin', color: '#7c3aed' },
    { value: 'admin', label: 'Admin', color: '#dc2626' },
    { value: 'entraineur', label: 'Entraineur', color: '#2563eb' },
    { value: 'inviter', label: 'Utilisateur', color: '#16a34a' }
  ];

  constructor(private authService: AuthService,public themeService:ThemeService) {}

  ngOnInit(): void {
    this.loadUsers();
  }


  getRoleColor(user: any): string {
    const role = this.roles.find(r => r.value === user.role);
    return role ? role.color : '#6b7280'; // gris par défaut
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.authService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = Array.isArray(data) ? data : data?.users || [];

        console.log('👥 USERS:', this.users);

        this.updateStats();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement utilisateurs:', err);
        this.error = 'Impossible de charger les utilisateurs.';
        this.loading = false;
      }
    });
  }

  refresh(): void {
    this.loadUsers();
  }

  // ✅ STATS FIXÉES PROPREMENT
  updateStats(): void {
    this.stats = {
      total: this.users.length,
      admin: this.users.filter(u => u.role?.toLowerCase() === 'admin').length,
      entraineur: this.users.filter(u => u.role?.toLowerCase() === 'entraineur').length,
      user: this.users.filter(u => u.role?.toLowerCase() === 'user').length,
      inviter: this.users.filter(u => u.role?.toLowerCase() === 'inviter').length,
      active: this.users.filter(u => u.isActive !== false).length
    };

    console.log('📊 STATS:', this.stats);
  }

  applyFilters(): void {
    let result = [...this.users];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();

      result = result.filter(u =>
        u.nom?.toLowerCase().includes(term) ||
        u.prenom?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    }

    if (this.selectedRole !== 'all') {
      result = result.filter(u =>
        u.role?.toLowerCase() === this.selectedRole
      );
    }

    result.sort((a, b) => {
      const aVal = (a[this.sortBy as keyof IUser] || '')
        .toString().toLowerCase();

      const bVal = (b[this.sortBy as keyof IUser] || '')
        .toString().toLowerCase();

      return aVal.localeCompare(bVal);
    });

    this.filteredUsers = result;

    console.log('🔎 FILTERED:', this.filteredUsers);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  

  onRoleFilter(role: string): void {
    this.selectedRole = role;
    this.applyFilters();
  }

  onSort(sort: string): void {
    this.sortBy = sort;
    this.applyFilters();
  }
  getCardStyle() {
    return {
      background: this.themeService.Backgroundcards,
      border: this.themeService.Bordernormal
    };
  }

  toggleView(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  hoverState: { [key: string]: boolean } = {};

setHover(action: string, index: number, value: boolean) {
  this.hoverState[`${action}-${index}`] = value;
}

isHover(action: string, index: number): boolean {
  return this.hoverState[`${action}-${index}`] === true;
}

  openModal(user: IUser, mode: 'edit' | 'delete' | 'view'): void {
    this.selectedUser = user;
    this.modalMode = mode;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }

  confirmDelete(): void {
    if (!this.selectedUser) return;

    console.log('🗑 DELETE:', this.selectedUser.id);

    this.closeModal();
    this.refresh();
  }

  saveUser(userData: any): void {
    console.log('💾 SAVE:', userData);

    this.closeModal();
    this.refresh();
  }

  getRoleClass(role: string): string {
    const roleLower = (role || '').toLowerCase();
    const roleConfig = this.roles.find(r => r.value === roleLower);
    return roleConfig?.color || '#6b7280';
  }

  getRoleLabel(role: string): string {
    const roleLower = (role || '').toLowerCase();
    const roleConfig = this.roles.find(r => r.value === roleLower);
    return roleConfig?.label || role || 'Inconnu';
  }

  getInitials(user: IUser): string {
    const nom = user.nom?.charAt(0) || '';
    const prenom = user.prenom?.charAt(0) || '';
    return (prenom + nom).toUpperCase() || 'U';
  }

  getAvatarColor(user: IUser): string {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600'
    ];

    const index = (user.id?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  }

  trackByUserId(index: number, user: IUser): string {
    return user.id || index.toString();
  }
}