// actus.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActusService, Actu } from '../../../../Backend/Services/actus.service';
import { ThemeService } from '../../../../Backend/Services/theme.service';
import { FormsModule } from '@angular/forms';
import { Icon3 } from '../../public/icon3/icon3';

type Role = 'entraineur' | 'admin' | 'joueur' | 'invite';

@Component({
  selector: 'app-actus',
  templateUrl: './actus.html',
  styleUrls: ['./actus.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,Icon3],
})
export class Actus implements OnInit {

  actus: Actu[] = [];
  isDark = false;
  menuOpen: boolean[] = [];
  isConnected: boolean = false;

  userRole: Role = 'invite'; // Par défaut invite pour non-connecté
  userNom = '';
  userPrenom = '';
  currentUserId = '';

  loading = false;
  selectedActu: Actu | null = null;
  isDetailOpen = false;
  isCreateModalOpen = false;

  // Configuration responsive
  isMobile = window.innerWidth < 768;
  
  // Configuration masonry optimisée
  private readonly positions = [
    { left: 5, top: 0 }, { left: 35, top: 30 }, { left: 65, top: 10 },
    { left: 15, top: 320 }, { left: 45, top: 280 }, { left: 75, top: 350 },
    { left: 25, top: 620 }, { left: 55, top: 580 }, { left: 10, top: 520 },
    { left: 70, top: 680 }, { left: 40, top: 850 }, { left: 5, top: 780 }
  ];
  
  private readonly rotations = [-6, -3, -2, 2, 4, 6, -5, 5, -4, 4, -2, 3];

  constructor(
    private actusService: ActusService,
    public themeService: ThemeService
  ) {
    this.checkScreenSize();
  }

  // =============================
  // GESTION DU RESPONSIVE
  // =============================
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768; // breakpoint mobile
  }
  

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }


  

  ngOnInit(): void {
    this.loadUser();
    this.loadActus();
    this.detectTheme();
  }

  detectTheme(): void {
    // Détection simple du mode sombre basée sur la couleur de fond
    const bg = this.themeService.Backgroundcards || '';
    this.isDark = bg.includes('020617') || bg.includes('05155d') || bg.includes('0f172a');
  }

  // =============================
  // USER
  // =============================
  loadUser(): void {
    const userData = localStorage.getItem('utilisateur');
    if (!userData) {
      this.userRole = 'invite';
      this.userNom = 'Visiteur';
      this.userPrenom = '';
      this.currentUserId = '';
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      this.userRole = parsed.role || 'joueur';
      this.userNom = parsed.nom || '';
      this.userPrenom = parsed.prenom || '';
      this.currentUserId = `${this.userPrenom} ${this.userNom}`;
    } catch {
      this.userRole = 'invite';
    }
  }

  canManageActus(): boolean {
    return this.userRole === 'admin' || this.userRole === 'entraineur';
  }

  isOwner(actu: Actu): boolean {
    return actu.auteur === this.currentUserId;
  }

  // =============================
  // ACTUS
  // =============================
  loadActus(): void {
    this.loading = true;
    this.actusService.getAllActus().subscribe({
      next: (data: Actu[]) => {   // ⚡ Type clair
        if (!Array.isArray(data)) {
          console.error('Data reçue n’est pas un tableau', data);
          this.actus = [];
          this.loading = false;
          return;
        }
    
        this.actus = data
          .sort((a, b) => {
            const dateA = a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
            const dateB = b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
            return dateB - dateA;
          })
          .map(actu => ({
            ...actu,
            imageUrl: actu.image
              ? `http://localhost:3000/uploads/${actu.image}`
              : 'assets/placeholder-news.jpg'
          }));
    
        this.menuOpen = new Array(this.actus.length).fill(false);
        this.loading = false;
      },
      error: err => {
        console.error('Erreur chargement actus', err);
        this.actus = [];
        this.loading = false;
      }
    });
  }

  refreshActus(): void {
    this.loadActus();
  }

  // =============================
  // MASONRY LAYOUT
  // =============================
  getTransform(index: number): string {
    if (this.isMobile) return 'none';
    const rotation = this.rotations[index % this.rotations.length];
    return `rotate(${rotation}deg)`;
  }

  getPosition(index: number): { left: string; top: string } {
    if (this.isMobile) return { left: '0', top: '0' };
    const pos = this.positions[index % this.positions.length];
    const offsetTop = (index * 25) % 80;
    return {
      left: `${pos.left}%`,
      top: `${pos.top + offsetTop}px`
    };
  }

  getZIndex(index: number): number {
    return index;
  }

  // =============================
  // STATUT ACTU
  // =============================
  isNew(actu: Actu): boolean {
    if (!actu.dateCreation) return false;
    const actuDate = new Date(actu.dateCreation);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - actuDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  isVeryRecent(actu: Actu): boolean {
    // Pour le badge "NOUVEAU" - seulement sur la plus récente
    if (!actu.dateCreation || this.actus.length === 0) return false;
    return this.actus[0]._id === actu._id && this.isNew(actu);
  }

  // =============================
  // INTERACTIONS
  // =============================
  openActuDetail(actu: Actu): void {
    this.selectedActu = actu;
    this.isDetailOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeDetail(): void {
    this.isDetailOpen = false;
    this.selectedActu = null;
    document.body.style.overflow = 'auto';
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  toggleMenu(event: Event, index: number): void {
    event.stopPropagation();
    this.menuOpen = this.menuOpen.map((o, i) => i === index ? !o : false);
  }

  closeAllMenus(): void {
    this.menuOpen.fill(false);
  }

  deleteActu(event: Event, actu: Actu, index: number): void {
    event.stopPropagation();
    if (confirm(`Supprimer "${actu.titre}" ?`)) {
      // Appel API à implémenter
      this.actus.splice(index, 1);
      this.menuOpen.splice(index, 1);
    }
  }

  editActu(event: Event, actu: Actu): void {
    event.stopPropagation();
    // Logique d'édition à implémenter
    console.log('Edit', actu);
  }

  trackByActuId(index: number, item: Actu): string {
    return item._id || item.key || index.toString();
  }

  // =============================
  // UTILS
  // =============================
  getInitiales(nom: string): string {
    if (!nom) return '?';
    const parts = nom.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });
  }
}