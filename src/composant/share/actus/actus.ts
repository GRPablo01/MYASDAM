// actus.component.ts - Complet avec console.log
import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActusService, Actu, Commentaire } from '../../../../Backend/Services/actus.service';
import { ThemeService } from '../../../../Backend/Services/theme.service';

type Role = 'entraineur' | 'admin' | 'joueur' | 'invite';

@Component({
  selector: 'app-actus',
  templateUrl: './actus.html',
  styleUrls: ['./actus.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class Actus implements OnInit {

  actus: Actu[] = [];
  newComment: string[] = [];
  commentSectionOpen: boolean[] = [];
  menuOpen: boolean[] = [];
  userRole: Role = 'joueur';
  userNom = '';
  userPrenom = '';
  currentUserId = '';
  loading = false;
  isCreateModalOpen = false;
  selectedActu: Actu | null = null;

  @ViewChildren('commentInput') commentInputs!: QueryList<ElementRef>;

  constructor(private actusService: ActusService, public themeService: ThemeService) {}

  ngOnInit(): void {
    console.log('ngOnInit - Chargement de l’utilisateur et des actus');
    this.loadUser();
    this.loadActus();
  }

  // =============================
  // UTILISATEUR
  // =============================
  loadUser(): void {
    const userData = localStorage.getItem('utilisateur');
    console.log('loadUser - localStorage utilisateur:', userData);

    if (!userData) return;

    const parsed = JSON.parse(userData);
    console.log('loadUser - parsed utilisateur:', parsed);

    this.userRole = parsed.role || 'joueur';
    this.userNom = parsed.nom || '';
    this.userPrenom = parsed.prenom || '';
    this.currentUserId = `${this.userPrenom} ${this.userNom}`;
    console.log('loadUser - currentUserId:', this.currentUserId);
  }

  // =============================
  // CHARGEMENT DES ACTUS
  // =============================
  loadActus(): void {
    this.loading = true;
    console.log('loadActus - démarrage récupération actus');
  
    this.actusService.getAllActus().subscribe({
      next: data => {
        console.log('loadActus - données brutes reçues:', data);
  
        this.actus = data.map(actu => {
          const commentaires = (actu.commentaires || []).map(c => ({
            ...c,
            userId: c.userId || c.nomComplet
          }));
  
          const transformedActu: Actu = {
            ...actu,
            prenom: actu.auteur?.split(' ')[0] || '',
            nom: actu.auteur?.split(' ').slice(1).join(' ') || '',
            commentaires,
            likes: typeof actu.likes === 'number' ? actu.likes : 0,
            favoris: typeof actu.favoris === 'number' ? actu.favoris : 0,
            isLiked: false,
            isFavori: false,
            imageUrl: actu.image ? `http://localhost:3000/uploads/${actu.image}` : ''
          };
  
          console.log('loadActus - actu transformée:', transformedActu);
          return transformedActu;
        });
  
        const length = this.actus.length;
        this.newComment = new Array(length).fill('');
        this.commentSectionOpen = new Array(length).fill(false);
        this.menuOpen = new Array(length).fill(false);
        this.loading = false;
  
        console.log('loadActus - actus finalisées:', this.actus);
      },
      error: err => {
        console.error('loadActus - erreur récupération actus', err);
        this.loading = false;
      }
    });
  }

  // =============================
  // LIKE / FAVORIS
  // =============================
  likeActu(actu: Actu, index: number) {
    console.log('likeActu - avant like:', actu);
    if (!actu.key) return;
    this.actusService.toggleLike(actu.key, `${this.userPrenom} ${this.userNom}`).subscribe(res => {
      console.log('likeActu - réponse serveur:', res);
      this.actus[index].likes = res.likes;
      this.actus[index].isLiked = res.isLiked;
      console.log('likeActu - après mise à jour:', this.actus[index]);
    });
  }

  favoriActu(actu: Actu) {
    console.log('favoriActu - avant favori:', actu);
    if (!actu.key) return;
    this.actusService.toggleFavori(actu.key, `${this.userPrenom} ${this.userNom}`).subscribe(res => {
      const index = this.actus.findIndex(a => a.key === actu.key);
      if (index > -1) {
        this.actus[index].favoris = res.favoris;
        this.actus[index].isFavori = res.isFavori;
        console.log('favoriActu - après mise à jour:', this.actus[index]);
      }
    });
  }

  // =============================
  // COMMENTAIRES
  // =============================
  toggleCommentSection(actu: Actu, index: number) {
    this.commentSectionOpen[index] = !this.commentSectionOpen[index];
    console.log('toggleCommentSection - index:', index, 'open:', this.commentSectionOpen[index]);
    if (this.commentSectionOpen[index]) {
      setTimeout(() => {
        const input = this.commentInputs?.toArray()[index];
        input?.nativeElement?.focus();
      }, 300);
    }
  }

  commenterActu(actu: Actu, index: number) {
    const contenu = this.newComment[index]?.trim();
    console.log('commenterActu - contenu:', contenu);
    if (!contenu || !actu.key) return;

    this.actusService.addCommentaire(actu.key, `${this.userPrenom} ${this.userNom}`, contenu).subscribe(res => {
      console.log('commenterActu - réponse serveur:', res);
      this.actus[index].commentaires = (res.data.commentaires as Commentaire[]).map(c => ({
        ...c,
        userId: c.userId || c.nomComplet
      }));
      this.newComment[index] = '';
      console.log('commenterActu - commentaires mis à jour:', this.actus[index].commentaires);
    });
  }

  // =============================
  // MENUS
  // =============================
  toggleMenu(index: number) {
    this.menuOpen = this.menuOpen.map((o, i) => i === index ? !o : false);
    console.log('toggleMenu - menuOpen:', this.menuOpen);
  }

  closeAllMenus() {
    this.menuOpen = this.menuOpen.map(() => false);
    console.log('closeAllMenus - menuOpen:', this.menuOpen);
  }

  isAnyMenuOpen() {
    const anyOpen = this.menuOpen.some(o => o);
    console.log('isAnyMenuOpen:', anyOpen);
    return anyOpen;
  }

  trackByActuId(index: number, item: Actu) {
    return item.key || item._id;
  }

  // =============================
  // AVATAR COLORS
  // =============================
  getAvatarColor(nomComplet: string): string {
    const hash = this.hashString(nomComplet);
    const colors = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'];
    return colors[hash % colors.length];
  }

  getAvatarColorDark(nomComplet: string): string {
    const hash = this.hashString(nomComplet);
    const colors = ['#B91C1C', '#B45309', '#059669', '#1D4ED8', '#7C3AED', '#DB2777'];
    return colors[hash % colors.length];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  getInitiales(nomComplet: string) {
    if (!nomComplet) return '';
    const parts = nomComplet.split(' ').filter(p => p);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // =============================
  // MODIFIER / SUPPRIMER ACTU
  // =============================
  editActu(actu: Actu): void {
    this.selectedActu = { ...actu };
    console.log('editActu - sélection actu:', actu);
  }

  deleteActu(actu: Actu): void {
    console.log('deleteActu - actu avant suppression:', actu);
    if (!actu.key) return;

    const confirmed = confirm('Voulez-vous vraiment supprimer cette actualité ? Cette action est irréversible.');
    if (!confirmed) return;

    this.actusService.deleteActu(actu.key).subscribe({
      next: () => {
        this.actus = this.actus.filter(a => a.key !== actu.key);
        this.newComment = this.newComment.filter((_, i) => this.actus[i]?.key !== actu.key);
        this.commentSectionOpen = this.commentSectionOpen.filter((_, i) => this.actus[i]?.key !== actu.key);
        this.menuOpen = this.menuOpen.filter((_, i) => this.actus[i]?.key !== actu.key);
        console.log('deleteActu - actus après suppression:', this.actus);
      },
      error: (err) => console.error('deleteActu - erreur suppression', err)
    });
  }

  // =============================
  // MODAL GESTION
  // =============================
  openCreateModal(): void {
    this.isCreateModalOpen = true;
    this.selectedActu = null;
    console.log('openCreateModal - ouverture modal');
  }

  closeModal(event?: MouseEvent): void {
    this.isCreateModalOpen = false;
    this.selectedActu = null;
    console.log('closeModal - fermeture modal');
  }

  // Popup commentaires
  popupCommentOpen: { [key: number]: boolean } = {};

  toggleCommentPopup(actu: Actu) {
    const index = this.actus.indexOf(actu);
    this.popupCommentOpen[index] = !this.popupCommentOpen[index];
    console.log('toggleCommentPopup - index:', index, 'open:', this.popupCommentOpen[index]);
  }

  // ✅ Méthode pour savoir si une actu est récente (moins de 7 jours)
  isRecent(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const today = new Date();
    const actuDate = new Date(dateStr);
    const diffDays = (today.getTime() - actuDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }
  
}